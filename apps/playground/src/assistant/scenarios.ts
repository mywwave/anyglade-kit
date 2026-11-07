import type { AgentStatus, ChangedFile, Source } from "@anyglade/kit/ai";

export interface PlanStep {
  id: string;
  title: string;
  status: AgentStatus;
  note?: string;
  output?: { title: string; text: string; tone: "default" | "danger" };
  substeps?: PlanStep[];
}

export type Part =
  | { id: string; type: "reasoning"; label: string; text: string; isStreaming: boolean }
  | { id: string; type: "run"; summary: string; steps: PlanStep[] }
  | { id: string; type: "plan"; title: string; steps: PlanStep[] }
  | {
      id: string;
      type: "tool";
      title: string;
      name: string;
      status: AgentStatus;
      input: string;
      output?: string;
      question?: string;
    }
  | { id: string; type: "code"; title: string; output: string; isStreaming: boolean }
  | { id: string; type: "files"; files: ChangedFile[] }
  | { id: string; type: "text"; text: string; isStreaming: boolean; sources: Source[] };

type NewPart = Part extends infer P ? (P extends Part ? Omit<P, "id"> : never) : never;

export interface Script {
  add: (part: NewPart) => string;
  patch: (id: string, change: Partial<NewPart>) => void;
  wait: (milliseconds: number) => Promise<void>;
  stream: (id: string, field: "text" | "output", text: string) => Promise<void>;
  /** Stops the agent until the person answers. */
  approval: (id: string) => Promise<boolean>;
  thinkMs: number;
}

const BEAT_MS = 350;

export const suggestions = [
  "Find stalled deals and email the customers",
  "Check the October report",
  "Prepare a customer export",
];

const dealSources: Source[] = [
  {
    title: "Vector Labs rollout",
    url: "https://example.com/deals/vector",
    note: "No activity for 11 days",
  },
  {
    title: "Keystone licenses",
    url: "https://example.com/deals/opora",
    note: "No activity for 9 days",
  },
  {
    title: "Deal handling guidelines",
    url: "https://example.com/handbook",
    note: "Section on stalled deals",
  },
];

async function think(script: Script, labels: string[], text: string) {
  if (script.thinkMs === 0) {
    return;
  }
  const started = performance.now();
  const id = script.add({
    type: "reasoning",
    label: labels[0] ?? "Thinking",
    text: "",
    isStreaming: true,
  });
  for (const label of labels) {
    script.patch(id, { label });
    await script.wait(script.thinkMs);
  }
  const seconds = Math.max(1, Math.round((performance.now() - started) / 1000));
  script.patch(id, { label: `Thought for ${seconds}s`, text, isStreaming: false });
}

const withStatus = (steps: PlanStep[], index: number, status: AgentStatus) =>
  steps.map((step, position) => (position === index ? { ...step, status } : step));

async function walk(script: Script, id: string, source: PlanStep[], stepMs: number) {
  let steps = source;
  for (const index of steps.keys()) {
    steps = withStatus(steps, index, "running");
    script.patch(id, { steps });
    await script.wait(stepMs);
    steps = withStatus(steps, index, "done");
    script.patch(id, { steps });
  }
  await script.wait(BEAT_MS);
  return steps;
}

async function reply(script: Script, text: string, sources: Source[] = []) {
  await script.wait(BEAT_MS);
  const id = script.add({ type: "text", text: "", isStreaming: true, sources });
  await script.stream(id, "text", text);
  script.patch(id, { isStreaming: false });
}

async function stalledDeals(script: Script) {
  await think(
    script,
    ["Reviewing the pipeline", "Looking for inactive deals"],
    "A deal counts as stalled after more than seven days without activity. Won deals are excluded, since there is no reason to follow up on them.",
  );

  const plan = script.add({
    type: "plan",
    title: "Plan: email the customers",
    steps: [
      { id: "find", title: "Find inactive deals", status: "pending" },
      { id: "pick", title: "Pick the contacts", status: "pending" },
      { id: "write", title: "Draft the emails", status: "pending", note: "Tone from past emails" },
    ],
  });
  await walk(
    script,
    plan,
    [
      { id: "find", title: "Find inactive deals", status: "pending", note: "Found three" },
      { id: "pick", title: "Pick the contacts", status: "pending" },
      { id: "write", title: "Draft the emails", status: "pending", note: "Tone from past emails" },
    ],
    900,
  );

  const search = script.add({
    type: "tool",
    title: "Reading deals",
    name: "find_stalled_deals",
    status: "running",
    input: `{ "minDays": 7, "excludeStage": "won" }`,
  });
  await script.wait(1300);
  script.patch(search, {
    status: "done",
    output: `[\n  { "deal": "Vector Labs rollout", "days": 11 },\n  { "deal": "Keystone licenses", "days": 9 },\n  { "deal": "Meridian audit", "days": 8 }\n]`,
  });

  const send = script.add({
    type: "tool",
    title: "Sending emails",
    name: "send_email",
    status: "waiting",
    input: `{ "recipients": 3, "template": "follow-up" }`,
    question: "Send three emails to customers? This can't be undone.",
  });

  if (await script.approval(send)) {
    script.patch(send, { status: "running" });
    await script.wait(1500);
    script.patch(send, { status: "done", output: `{ "sent": 3, "failed": 0 }` });
    await reply(
      script,
      "All three emails are sent. Vector Labs has the largest deal [1]; it has been idle for 11 days, so it carries the highest risk.\n\nKeystone [2] is close to the threshold in the guidelines [3], so I set a reminder for Thursday.",
      dealSources,
    );
  } else {
    script.patch(send, { status: "failed", output: `{ "sent": 0, "reason": "cancelled" }` });
    await reply(
      script,
      "The emails weren't sent. The drafts are saved, and the deals are still stalled: Vector Labs [1] and Keystone [2].",
      dealSources,
    );
  }
}

async function monthReport(script: Script) {
  await think(
    script,
    ["Reading the report", "Reconciling totals"],
    "First I run the checks, then I compare the totals.",
  );

  const terminal = script.add({
    type: "code",
    title: "report check --month october",
    output: "",
    isStreaming: true,
  });
  await script.stream(
    terminal,
    "output",
    "Deals loaded: 118\nPayments loaded: 342\nCurrency check passed\nDate check passed\nTotals check failed\n",
  );
  script.patch(terminal, { isStreaming: false });

  script.add({
    type: "run",
    summary: "Two of three checks passed",
    steps: [
      { id: "currency", title: "Currencies", status: "done", note: "342 payments" },
      { id: "dates", title: "Close dates", status: "done", note: "118 deals" },
      {
        id: "sum",
        title: "Deal total matches payment total",
        status: "failed",
        note: "Off by $4,900",
        output: {
          title: "AssertionError: payment total does not match",
          tone: "danger",
          text: "expected 371,000\nreceived 366,100\n\n  at compareTotals (report/check.ts:42:11)\n  at runChecks (report/check.ts:18:5)\n  at main (report/cli.ts:9:3)",
        },
      },
    ],
  });
  await script.wait(300);
  await reply(
    script,
    "The report is off by $4,900. The gap matches a payment from North Studio that failed and was never retried.\n\nRetry the payment and the check will pass.",
  );
}

async function exportCustomers(script: Script) {
  await think(
    script,
    ["Gathering requirements"],
    "Exporting customers with their revenue and account manager.",
  );

  const subagent = {
    id: "subagent",
    title: "Data assistant",
    status: "pending" as const,
    note: "Separate agent",
    substeps: [
      { id: "read", title: "Read customers", status: "done" as const, note: "9 records" },
      { id: "merge", title: "Add revenue", status: "done" as const },
    ],
  };
  const run = script.add({
    type: "run",
    summary: "Export is ready",
    steps: [
      { id: "scope", title: "Choose fields", status: "pending" },
      subagent,
      { id: "write", title: "Write files", status: "pending" },
    ],
  });
  await walk(
    script,
    run,
    [
      { id: "scope", title: "Choose fields", status: "pending" },
      subagent,
      { id: "write", title: "Write files", status: "pending" },
    ],
    800,
  );

  script.add({
    type: "files",
    files: [
      { path: "exports/2026-11/customers.csv", added: 10 },
      { path: "exports/2026-11/summary.md", added: 24 },
      { path: "exports/README.md", added: 2, removed: 1 },
    ],
  });
  await reply(
    script,
    "Done: three files in the exports folder. Open any of them in the tree above.",
  );
}

async function freeform(script: Script, prompt: string, attachments: string[]) {
  await think(
    script,
    ["Thinking about the request"],
    "This is a general question, no CRM data needed.",
  );
  const files = attachments.length > 0 ? ` Attachments considered: ${attachments.length}.` : "";
  await reply(
    script,
    `This is a demo with prepared answers, so I can only reply to "${prompt}" in general terms.${files}\n\nTry the suggestions to see a plan, an approval, an error and files.`,
  );
}

export function runScenario(script: Script, prompt: string, attachments: string[]) {
  if (prompt === suggestions[0]) return stalledDeals(script);
  if (prompt === suggestions[1]) return monthReport(script);
  if (prompt === suggestions[2]) return exportCustomers(script);
  return freeform(script, prompt, attachments);
}

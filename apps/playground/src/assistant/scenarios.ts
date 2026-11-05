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
  "Найди застрявшие сделки и напиши клиентам",
  "Проверь отчёт за октябрь",
  "Подготовь выгрузку клиентов",
];

const dealSources: Source[] = [
  {
    title: "Внедрение для «Вектора»",
    url: "https://example.com/deals/vector",
    note: "11 дней без движения",
  },
  {
    title: "Лицензии для «Опоры»",
    url: "https://example.com/deals/opora",
    note: "9 дней без движения",
  },
  {
    title: "Правила работы со сделками",
    url: "https://example.com/handbook",
    note: "Раздел о застое",
  },
];

async function think(script: Script, labels: string[], text: string) {
  if (script.thinkMs === 0) {
    return;
  }
  const started = performance.now();
  const id = script.add({
    type: "reasoning",
    label: labels[0] ?? "Думаю",
    text: "",
    isStreaming: true,
  });
  for (const label of labels) {
    script.patch(id, { label });
    await script.wait(script.thinkMs);
  }
  const seconds = Math.max(1, Math.round((performance.now() - started) / 1000));
  script.patch(id, { label: `Думал ${seconds} с`, text, isStreaming: false });
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
    ["Смотрю воронку", "Ищу сделки без движения"],
    "Застрявшей считаю сделку без движения дольше семи дней. Успешные исключаю: писать по ним незачем.",
  );

  const plan = script.add({
    type: "plan",
    title: "План: написать клиентам",
    steps: [
      { id: "find", title: "Найти сделки без движения", status: "pending" },
      { id: "pick", title: "Определить контакты", status: "pending" },
      { id: "write", title: "Подготовить письма", status: "pending", note: "Тон из прошлых писем" },
    ],
  });
  await walk(
    script,
    plan,
    [
      { id: "find", title: "Найти сделки без движения", status: "pending", note: "Нашлось три" },
      { id: "pick", title: "Определить контакты", status: "pending" },
      { id: "write", title: "Подготовить письма", status: "pending", note: "Тон из прошлых писем" },
    ],
    900,
  );

  const search = script.add({
    type: "tool",
    title: "Читаю сделки",
    name: "find_stalled_deals",
    status: "running",
    input: `{ "minDays": 7, "excludeStage": "won" }`,
  });
  await script.wait(1300);
  script.patch(search, {
    status: "done",
    output: `[\n  { "deal": "Внедрение для «Вектора»", "days": 11 },\n  { "deal": "Лицензии для «Опоры»", "days": 9 },\n  { "deal": "Аудит для «Трассы»", "days": 8 }\n]`,
  });

  const send = script.add({
    type: "tool",
    title: "Отправляю письма",
    name: "send_email",
    status: "waiting",
    input: `{ "recipients": 3, "template": "follow-up" }`,
    question: "Отправить три письма клиентам? Отменить это будет нельзя.",
  });

  if (await script.approval(send)) {
    script.patch(send, { status: "running" });
    await script.wait(1500);
    script.patch(send, { status: "done", output: `{ "sent": 3, "failed": 0 }` });
    await reply(
      script,
      "Письма ушли всем троим. Самая крупная сделка у «Вектора» [1], она стоит 11 дней, и риск по ней выше других.\n\nПо «Опоре» [2] срок близок к порогу из правил [3], поэтому поставил напоминание на четверг.",
      dealSources,
    );
  } else {
    script.patch(send, { status: "failed", output: `{ "sent": 0, "reason": "отменено" }` });
    await reply(
      script,
      "Письма не отправлены. Черновики остались, сделки по-прежнему стоят: «Вектор» [1] и «Опора» [2].",
      dealSources,
    );
  }
}

async function monthReport(script: Script) {
  await think(
    script,
    ["Читаю отчёт", "Сверяю итоги"],
    "Сначала прогоняю проверки, затем сравниваю суммы.",
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
    "Загружено сделок: 118\nЗагружено платежей: 342\nПроверка валют пройдена\nПроверка дат пройдена\nСверка сумм не прошла\n",
  );
  script.patch(terminal, { isStreaming: false });

  script.add({
    type: "run",
    summary: "Две проверки из трёх пройдены",
    steps: [
      { id: "currency", title: "Валюты", status: "done", note: "342 платежа" },
      { id: "dates", title: "Даты закрытия", status: "done", note: "118 сделок" },
      {
        id: "sum",
        title: "Сумма по сделкам равна сумме платежей",
        status: "failed",
        note: "Расхождение 49 000 ₽",
        output: {
          title: "AssertionError: сумма платежей не совпала",
          tone: "danger",
          text: "ожидалось 3 710 000\nполучено  3 661 000\n\n  at compareTotals (report/check.ts:42:11)\n  at runChecks (report/check.ts:18:5)\n  at main (report/cli.ts:9:3)",
        },
      },
    ],
  });
  await script.wait(300);
  await reply(
    script,
    "Отчёт не сходится на 49 000 ₽. Разница совпадает с платежом студии «Север», который упал с ошибкой и не был повторён.\n\nПовторите платёж, и проверка пройдёт.",
  );
}

async function exportCustomers(script: Script) {
  await think(script, ["Собираю требования"], "Клиентов выгружаю вместе с выручкой и менеджером.");

  const subagent = {
    id: "subagent",
    title: "Помощник по данным",
    status: "pending" as const,
    note: "Отдельный агент",
    substeps: [
      { id: "read", title: "Прочитать клиентов", status: "done" as const, note: "9 записей" },
      { id: "merge", title: "Добавить выручку", status: "done" as const },
    ],
  };
  const run = script.add({
    type: "run",
    summary: "Выгрузка готова",
    steps: [
      { id: "scope", title: "Определить поля", status: "pending" },
      subagent,
      { id: "write", title: "Записать файлы", status: "pending" },
    ],
  });
  await walk(
    script,
    run,
    [
      { id: "scope", title: "Определить поля", status: "pending" },
      subagent,
      { id: "write", title: "Записать файлы", status: "pending" },
    ],
    800,
  );

  script.add({
    type: "files",
    files: [
      { path: "exports/2026-11/klienty.csv", added: 10 },
      { path: "exports/2026-11/svodka.md", added: 24 },
      { path: "exports/README.md", added: 2, removed: 1 },
    ],
  });
  await reply(script, "Готово: три файла в папке выгрузок. Откройте файл в дереве выше.");
}

async function freeform(script: Script, prompt: string, attachments: string[]) {
  await think(script, ["Думаю над запросом"], "Вопрос общий, данные CRM не нужны.");
  const files = attachments.length > 0 ? ` Вложений учтено: ${attachments.length}.` : "";
  await reply(
    script,
    `Это демонстрация, ответы заготовлены заранее, поэтому на «${prompt}» отвечу общими словами.${files}\n\nПопробуйте подсказки: в них видны план, подтверждение, ошибка и файлы.`,
  );
}

export function runScenario(script: Script, prompt: string, attachments: string[]) {
  if (prompt === suggestions[0]) return stalledDeals(script);
  if (prompt === suggestions[1]) return monthReport(script);
  if (prompt === suggestions[2]) return exportCustomers(script);
  return freeform(script, prompt, attachments);
}

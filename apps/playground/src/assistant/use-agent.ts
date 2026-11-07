import { useState, type Dispatch, type SetStateAction } from "react";
import { runScenario, type Part, type PlanStep, type Script } from "./scenarios.ts";

export type Effort = "fast" | "balanced" | "deep";

const thinkMs: Record<Effort, number> = { fast: 0, balanced: 1200, deep: 2000 };
const TOKEN_MS = 38;
const PROMPT_TOKENS = 3200;

export interface Turn {
  id: string;
  prompt: string;
  attachments: string[];
  parts: Part[];
  state: "running" | "done" | "stopped";
  tokens: number;
}

const stopStep = (step: PlanStep): PlanStep => ({
  ...step,
  status: step.status === "running" ? "pending" : step.status,
});

/** Nothing keeps shimmering after a stop: every open part settles. */
function settle(part: Part): Part {
  switch (part.type) {
    case "reasoning":
      return { ...part, label: "Stopped", isStreaming: false };
    case "run":
      return { ...part, summary: "Stopped", steps: part.steps.map(stopStep) };
    case "plan":
      return { ...part, steps: part.steps.map(stopStep) };
    case "tool":
      return part.status === "running" || part.status === "waiting"
        ? { ...part, status: "failed", output: `{ "reason": "stopped" }` }
        : part;
    case "code":
    case "text":
      return { ...part, isStreaming: false };
    default:
      return part;
  }
}

function createActions(setTurns: Dispatch<SetStateAction<Turn[]>>) {
  let controller: AbortController | null = null;
  const pendingApproval = new Map<string, (isApproved: boolean) => void>();

  function updateTurn(turnId: string, change: (turn: Turn) => Turn) {
    setTurns((list) => list.map((turn) => (turn.id === turnId ? change(turn) : turn)));
  }

  function createScript(turnId: string, signal: AbortSignal, effort: Effort): Script {
    const updatePart = (id: string, change: (part: Part) => Part) =>
      updateTurn(turnId, (turn) => ({
        ...turn,
        parts: turn.parts.map((part) => (part.id === id ? change(part) : part)),
      }));

    const wait = (milliseconds: number) =>
      new Promise<void>((resolve, reject) => {
        const timer = setTimeout(resolve, milliseconds);
        signal.addEventListener("abort", () => {
          clearTimeout(timer);
          reject(new DOMException("Stopped", "AbortError"));
        });
      });

    return {
      thinkMs: thinkMs[effort],
      wait,
      add(part) {
        const id = crypto.randomUUID();
        updateTurn(turnId, (turn) => ({
          ...turn,
          parts: [...turn.parts, { ...part, id } as Part],
        }));
        return id;
      },
      patch(id, change) {
        updatePart(id, (part) => ({ ...part, ...change }) as Part);
      },
      async stream(id, field, text) {
        const tokens = text.split(/(?<=\s)/);
        let written = "";
        for (const token of tokens) {
          written += token;
          const value = written;
          updatePart(id, (part) => ({ ...part, [field]: value }) as Part);
          await wait(TOKEN_MS);
        }
        updateTurn(turnId, (turn) => ({ ...turn, tokens: turn.tokens + tokens.length * 3 }));
      },
      approval(id) {
        return new Promise((resolve, reject) => {
          pendingApproval.set(id, resolve);
          signal.addEventListener("abort", () => {
            reject(new DOMException("Stopped", "AbortError"));
          });
        });
      },
    };
  }

  async function start(prompt: string, attachments: string[], effort: Effort) {
    const id = crypto.randomUUID();
    const abort = new AbortController();
    controller = abort;
    setTurns((list) => [
      ...list,
      { id, prompt, attachments, parts: [], state: "running", tokens: PROMPT_TOKENS },
    ]);

    try {
      await runScenario(createScript(id, abort.signal, effort), prompt, attachments);
      updateTurn(id, (turn) => ({ ...turn, state: "done" }));
    } catch (error) {
      if (!abort.signal.aborted) {
        throw error;
      }
      updateTurn(id, (turn) => ({ ...turn, state: "stopped", parts: turn.parts.map(settle) }));
    }
  }

  function stop() {
    controller?.abort();
  }

  function answer(partId: string, isApproved: boolean) {
    pendingApproval.get(partId)?.(isApproved);
    pendingApproval.delete(partId);
  }

  function retry(turn: Turn, effort: Effort) {
    setTurns((list) => list.filter((item) => item.id !== turn.id));
    void start(turn.prompt, turn.attachments, effort);
  }

  /** Removes this turn and everything after it. */
  function restore(turnId: string) {
    stop();
    setTurns((list) =>
      list.slice(
        0,
        list.findIndex((turn) => turn.id === turnId),
      ),
    );
  }

  return { start, stop, answer, retry, restore };
}

export function useAgent() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [actions] = useState(() => createActions(setTurns));

  return { turns, isRunning: turns.at(-1)?.state === "running", ...actions };
}

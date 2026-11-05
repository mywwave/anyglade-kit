import { expect, test } from "vite-plus/test";
import plugin from "../oxlint/index.mjs";

interface Rule {
  create(context: { report(problem: unknown): void }): Record<string, (node: unknown) => void>;
}

const rules = plugin.rules as unknown as Record<string, Rule>;

function reports(rule: string, className: string) {
  let count = 0;
  const visitor = rules[rule]?.create({
    report() {
      count += 1;
    },
  });
  visitor?.JSXAttribute?.({
    name: { name: "className" },
    value: { type: "Literal", value: className },
  });
  return count;
}

test.each([
  "text-sm",
  "md:text-2xl",
  "font-semibold",
  "leading-6",
  "tracking-tight",
  "w-full text-xs",
])("no-typography-utility rejects %s", (className) => {
  expect(reports("no-typography-utility", className)).toBe(1);
});

test.each(["text-muted", "text-center", "font-mono", "w-64"])(
  "no-typography-utility allows %s",
  (className) => {
    expect(reports("no-typography-utility", className)).toBe(0);
  },
);

test.each(["p-4", "mt-2", "gap-3", "md:px-6", "-mx-2", "space-y-4", "w-full gap-x-2"])(
  "no-spacing-utility rejects %s",
  (className) => {
    expect(reports("no-spacing-utility", className)).toBe(1);
  },
);

test.each(["mx-auto", "w-full", "max-h-60", "min-w-80", "rounded-3xl", "shadow-panel"])(
  "no-spacing-utility allows %s",
  (className) => {
    expect(reports("no-spacing-utility", className)).toBe(0);
  },
);

test("no-dark-variant and no-arbitrary-value reject raw values", () => {
  expect(reports("no-dark-variant", "dark:bg-black")).toBe(1);
  expect(reports("no-arbitrary-value", "w-[17px]")).toBe(1);
  expect(reports("no-arbitrary-value", "w-64")).toBe(0);
});

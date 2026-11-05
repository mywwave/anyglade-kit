import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { expect, test } from "vite-plus/test";

const script = resolve(
  import.meta.dirname,
  "../../../.claude/skills/design-system-sync/scripts/sync.mjs",
);

test("the portable design skill matches the kit", () => {
  const { status, stdout } = spawnSync(process.execPath, [script, "--check"], { encoding: "utf8" });

  expect(stdout).toBe("Скилл дизайн-системы актуален\n");
  expect(status).toBe(0);
});

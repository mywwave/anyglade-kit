import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, beforeEach, expect, test } from "vite-plus/test";

const bin = resolve(import.meta.dirname, "../bin/anyglade-kit.mjs");
const STUB = ".claude/skills/anyglade-design-system/SKILL.md";
let project: string;

const read = (file: string) => readFileSync(join(project, file), "utf8");

function run(command: string, cwd = project, env: NodeJS.ProcessEnv = {}) {
  return execFileSync(process.execPath, [bin, command], {
    cwd,
    env: { ...process.env, CI: "", ...env },
    stdio: "pipe",
  });
}

function installSkill(root = project) {
  const folder = join(root, "node_modules/@anyglade/kit/skills/anyglade-design-system");
  mkdirSync(folder, { recursive: true });
  writeFileSync(join(folder, "SKILL.md"), "---\nname: x\ndescription: Правила интерфейса\n---\n");
}

beforeEach(() => {
  project = mkdtempSync(join(tmpdir(), "kit-agents-"));
  writeFileSync(join(project, "package.json"), "{}");
});

afterEach(() => {
  rmSync(project, { recursive: true, force: true });
});

test("init points every agent at the skill inside the package", () => {
  installSkill();
  run("init");

  const path = "node_modules/@anyglade/kit/skills/anyglade-design-system/SKILL.md";
  expect(read(STUB)).toContain(`description: Правила интерфейса`);
  expect(read(STUB)).toContain(path);
  expect(read(".agents/skills/anyglade-design-system/SKILL.md")).toBe(read(STUB));
  expect(read("AGENTS.md")).toContain(path);
});

test("init finds a package installed above the app, as in a monorepo", () => {
  installSkill();
  const app = join(project, "apps/web");
  mkdirSync(app, { recursive: true });
  run("init", app);

  expect(readFileSync(join(app, "AGENTS.md"), "utf8")).toContain(
    "../../node_modules/@anyglade/kit/skills",
  );
});

test("init runs again without repeating itself or touching the text around it", () => {
  installSkill();
  writeFileSync(join(project, "AGENTS.md"), "# Наши правила\n");
  run("init");
  run("init");

  const agents = read("AGENTS.md");
  expect(agents.startsWith("# Наши правила\n")).toBe(true);
  expect(agents.match(/anyglade-kit:start/g)).toHaveLength(1);
});

test("init leaves a skill written by hand alone", () => {
  installSkill();
  mkdirSync(join(project, ".claude/skills/anyglade-design-system"), { recursive: true });
  writeFileSync(join(project, STUB), "мой скилл");
  run("init");

  expect(read(STUB)).toBe("мой скилл");
});

test("init explains what to do when the package is not installed", () => {
  expect(() => run("init")).toThrow(/bun add @anyglade\/kit/);
});

test("the install hook stays out of this repository", () => {
  installSkill();
  run("postinstall", project, { INIT_CWD: project });
  expect(existsSync(join(project, "AGENTS.md"))).toBe(false);
});

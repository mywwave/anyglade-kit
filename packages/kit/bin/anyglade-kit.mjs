#!/usr/bin/env node
// Connects a project's AI agents to the design skill shipped inside this package.
//
// The project gets thin pointers, not a copy: the rules stay in node_modules, so they
// always match the installed version and never go stale after an update.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SKILL = "anyglade-design-system";
const INSTALLED = join("node_modules", "@anyglade", "kit");
const SKILL_FOLDERS = [".claude/skills", ".agents/skills"];
const STUB_MARK = "<!-- Created by @anyglade/kit";
// Versions up to 0.4 wrote the same mark in Russian ("Created"). Those stubs are still ours to replace.
const LEGACY_STUB_MARKS = ["<!-- \u0421\u043e\u0437\u0434\u0430\u043d\u043e @anyglade/kit"];
const BLOCK_START = "<!-- anyglade-kit:start -->";
const BLOCK_END = "<!-- anyglade-kit:end -->";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Walks up, because a monorepo keeps node_modules above the app. */
function findInstalledSkill(project) {
  for (let folder = project; ; folder = dirname(folder)) {
    const file = join(folder, INSTALLED, "skills", SKILL, "SKILL.md");
    if (existsSync(file)) {
      return file;
    }
    if (dirname(folder) === folder) {
      return null;
    }
  }
}

const toPosix = (path) => path.replaceAll("\\", "/");

function renderStub(skillFile, skillPath) {
  const description = /^description: (.+)$/m.exec(readFileSync(skillFile, "utf8"))?.[1] ?? "";
  return `---
name: ${SKILL}
description: ${description}
---

${STUB_MARK}. The rules live in the package and update with it. -->

Read \`${skillPath}\` and follow it. The references it links to are in the same folder.
`;
}

const isStub = (text) => [STUB_MARK, ...LEGACY_STUB_MARKS].some((mark) => text.includes(mark));

function writeStub(project, folder, content) {
  const file = join(project, folder, SKILL, "SKILL.md");
  // A file without the mark was written by hand: it is not ours to replace.
  if (existsSync(file) && !isStub(readFileSync(file, "utf8"))) {
    return;
  }
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
}

function writeAgentsBlock(project, skillPath) {
  const file = join(project, "AGENTS.md");
  const block = `${BLOCK_START}
## Interface

The interface of this project is built only from \`@anyglade/kit\`. Before you create or change a screen, component, layout, color or animation, read \`${skillPath}\` and follow it.
${BLOCK_END}`;
  const current = existsSync(file) ? readFileSync(file, "utf8") : "";
  const start = current.indexOf(BLOCK_START);
  const end = current.indexOf(BLOCK_END);

  if (start !== -1 && end !== -1) {
    writeFileSync(file, current.slice(0, start) + block + current.slice(end + BLOCK_END.length));
  } else {
    writeFileSync(
      file,
      `${current}${current && !current.endsWith("\n") ? "\n" : ""}${current ? "\n" : ""}${block}\n`,
    );
  }
}

function connect(project) {
  const skillFile = findInstalledSkill(project);
  if (!skillFile) {
    return false;
  }
  const skillPath = toPosix(relative(project, skillFile));
  const stub = renderStub(skillFile, skillPath);
  for (const folder of SKILL_FOLDERS) {
    writeStub(project, folder, stub);
  }
  writeAgentsBlock(project, skillPath);
  return true;
}

function init() {
  if (connect(process.cwd())) {
    console.log(
      "Agents are connected to the @anyglade/kit rules: .claude/skills, .agents/skills, AGENTS.md",
    );
  } else {
    console.error("Install the package first: bun add @anyglade/kit");
    process.exitCode = 1;
  }
}

/** Runs on install, so it must never fail an install or touch a repository it does not know. */
function postinstall() {
  const project = process.env.INIT_CWD;
  const isSkipped =
    process.env.CI || process.env.ANYGLADE_KIT_NO_AGENTS || !packageRoot.includes("node_modules");
  if (isSkipped || !project || !existsSync(join(project, "package.json"))) {
    return;
  }
  try {
    connect(project);
  } catch {
    // Agents can still be connected by hand with `init`.
  }
}

const command = process.argv[2] ?? "init";

if (command === "init") {
  init();
} else if (command === "postinstall") {
  postinstall();
} else {
  console.error("Commands: init");
  process.exitCode = 1;
}

// Keeps the portable design skill true to the kit.
//   node sync.mjs           regenerate tokens and API, report what still needs a person
//   node sync.mjs --check   change nothing, exit 1 if the skill is behind the kit
//   node sync.mjs --accept  record the current sources as reviewed
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../../../..");
const skill = join(root, ".claude/skills/anyglade-design-system");
const generated = join(skill, "references/generated");
const kitSrc = join(root, "packages/kit/src");

/** Changing any of these can change a rule, so the skill must be read against them again. */
const SOURCES = [
  "packages/kit/README.md",
  "docs/design-system/decisions.md",
  "packages/kit/oxlint/index.mjs",
  "packages/kit/src/box/props.ts",
  "packages/kit/src/text/text.tsx",
];

const ENTRIES = {
  "@anyglade/kit": "index.ts",
  "@anyglade/kit/ai": "ai.ts",
  "@anyglade/kit/charts": "charts.ts",
};

/** Paths of this repository must not leak into a skill that is copied elsewhere. */
const FORBIDDEN = [
  /packages\/kit\//,
  /apps\/playground/,
  /docs\/design-system/,
  /[A-Z]:\\/,
  /block-reference/,
];

const read = (file) => readFileSync(file, "utf8").replaceAll("\r\n", "\n");
const hash = (text) => createHash("sha256").update(text).digest("hex").slice(0, 16);

function walk(directory, filter) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return walk(path, filter);
    return filter(path) ? [path] : [];
  });
}

function table(header, rows) {
  return [
    `| ${header.join(" | ")} |`,
    `| ${header.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.join(" | ")} |`),
  ].join("\n");
}

async function tokensDocument() {
  const tokens = await import(pathToFileURL(join(kitSrc, "tokens.ts")).href);
  const pairs = Object.entries;
  const sections = [
    "# Tokens",
    "This file is generated. Do not edit it by hand.",
    "## Spacing\n\n`Box` props: `padding*`, `margin*`, `gap`.\n\n" +
      table(["Name", "Value"], pairs(tokens.spacing)),
    "## Radii\n\nThe `borderRadius` prop.\n\n" + table(["Name", "Value"], pairs(tokens.radii)),
    "## Shadows\n\nThe `boxShadow` prop.\n\n" +
      table(
        ["Name"],
        Object.keys(tokens.shadows).map((name) => [name]),
      ),
    "## Widths\n\nValues of `tokens.widths`, in pixels.\n\n" +
      table(["Name", "Value"], pairs(tokens.widths)),
    "## Breakpoints\n\nThe `sm`, `md`, `lg`, `xl` conditions in `Box` props.\n\n" +
      table(["Name", "Value"], pairs(tokens.breakpoints)),
    "## Text roles\n\nThe `variant` prop of `Text`. Size is given as base and from `md`.\n\n" +
      table(
        ["Role", "Size", "Line height", "Weight"],
        pairs(tokens.textRoles).map(([name, role]) => [
          name,
          `${tokens.fontSizes[role.size]}${role.mdSize ? ` / ${tokens.fontSizes[role.mdSize]}` : ""}`,
          tokens.lineHeights[role.leading],
          tokens.fontWeights[role.weight ?? "body"],
        ]),
      ),
    "## Weights\n\nThe `weight` prop of `Text`.\n\n" +
      table(["Name", "Value"], pairs(tokens.fontWeights)),
    "## Text colors\n\nThe `color` prop of `Text`.\n\n" +
      table(["Name", "Token"], pairs(tokens.textColors)),
    "## Semantic colors\n\nThe `backgroundColor`, `color` and `borderColor` props of `Box`.\n\n" +
      table(
        ["Token", "Light", "Dark"],
        pairs(tokens.colors).map(([name, [light, dark]]) => [
          name,
          tokens.palette[light],
          tokens.palette[dark],
        ]),
      ),
    "## Durations\n\nCSS variables `--ag-duration-*`.\n\n" +
      table(["Name", "Value"], pairs(tokens.durations)),
    "## Easings\n\nCSS variables `--ag-ease-*`.\n\n" +
      table(["Name", "Value"], pairs(tokens.easings)),
    "## Feedback timing\n\nValues of `tokens.timings`, in milliseconds.\n\n" +
      table(["Name", "Value"], pairs(tokens.timings)),
  ];
  return `${sections.join("\n\n")}\n`;
}

function exportedNames(entry) {
  const source = read(join(kitSrc, entry));
  const names = [];
  for (const [, body] of source.matchAll(/export\s*{([^}]+)}/g)) {
    for (const raw of body.split(",")) {
      const name = raw.trim();
      if (name && !name.startsWith("type ")) names.push(name.split(" as ").at(-1).trim());
    }
  }
  return names.toSorted((a, b) => a.localeCompare(b));
}

function propInterfaces() {
  const files = walk(kitSrc, (path) => /\.tsx?$/.test(path) && !path.endsWith("tokens.ts"));
  const blocks = [];
  const visible = publicTypes();
  for (const file of files) {
    const source = read(file);
    for (const match of source.matchAll(
      /^export interface (\w+)(?:<[^>]+>)?[^{]*{\n[\s\S]*?^}$/gm,
    )) {
      if (visible.has(match[1])) {
        blocks.push({ name: match[1], code: match[0] });
      }
    }
  }
  return blocks.toSorted((a, b) => a.name.localeCompare(b.name));
}

/** Types the entries expose. Internal helpers stay out of the skill. */
function publicTypes() {
  const names = new Set();
  for (const entry of Object.values(ENTRIES)) {
    const source = read(join(kitSrc, entry));
    for (const [, body] of source.matchAll(/export\s*(?:type\s*)?{([^}]+)}/g)) {
      for (const raw of body.split(",")) {
        names.add(raw.trim().replace(/^type /, ""));
      }
    }
  }
  return names;
}

/** Hooks and helpers: lower-case exports, whose signature a reader cannot guess. */
function functionSignatures() {
  const files = walk(kitSrc, (path) => /\.tsx?$/.test(path) && !path.endsWith("tokens.ts"));
  const visible = publicTypes();
  const signatures = [];
  for (const file of files) {
    const source = read(file);
    for (const match of source.matchAll(
      /^export function ([a-z]\w*)(?:<[^>]+>)?\([\s\S]*?\)(?=\s*{\n)/gm,
    )) {
      if (visible.has(match[1])) {
        signatures.push(
          `function ${match[0].replace(/^export function /, "").replace(/\s*\n\s*/g, " ")};`,
        );
      }
    }
    for (const match of source.matchAll(
      /^export type (Sort\w+|Agent\w+|Status\w+)(?:<[^>]+>)? = .*$/gm,
    )) {
      if (visible.has(match[1])) {
        signatures.push(match[0].replace(/^export /, ""));
      }
    }
  }
  return signatures.toSorted((a, b) => a.localeCompare(b));
}

async function boxPropsDocument() {
  const { freeProps, tokenProps } = await import(pathToFileURL(join(kitSrc, "box/props.ts")).href);
  const rows = Object.entries(tokenProps).map(([name, { values }]) => {
    const keys = Object.keys(values).filter((key) => !key.startsWith("-"));
    return [`\`${name}\``, keys.join(", ")];
  });
  return [
    "## Box props",
    "Values can be given as an object of conditions. Negative spacing takes a minus sign: `-s`.",
    table(["Prop", "Values"], rows),
    `Free values: ${Object.keys(freeProps)
      .map((name) => `\`${name}\``)
      .join(", ")}.`,
  ].join("\n\n");
}

function textPropsDocument() {
  const source = read(join(kitSrc, "text/text.tsx"));
  const [code] = source.match(/^interface TextStyleProps {\n[\s\S]*?^}$/m) ?? [""];
  return `## Text props\n\nValues of \`variant\`, \`color\` and \`weight\` are in tokens.md.\n\n\`\`\`ts\n${code}\n\`\`\``;
}

function apiDocument(boxProps) {
  const sections = ["# Public API", "This file is generated. Do not edit it by hand."];
  for (const [name, entry] of Object.entries(ENTRIES)) {
    sections.push(
      `## ${name}\n\n${exportedNames(entry)
        .map((item) => `\`${item}\``)
        .join(", ")}`,
    );
  }
  sections.push(
    "The main entry also exports every HeroUI component and the `tokens` object with scale values: `tokens.widths.content`, `tokens.timings.confirmation`.",
  );
  sections.push(`## Functions and hooks\n\n\`\`\`ts\n${functionSignatures().join("\n")}\n\`\`\``);
  sections.push(boxProps);
  sections.push(textPropsDocument());
  sections.push(
    "## Props and types\n\n" +
      propInterfaces()
        .map(({ code }) => `\`\`\`ts\n${code}\n\`\`\``)
        .join("\n\n"),
  );
  return `${sections.join("\n\n")}\n`;
}

const fingerprint = () =>
  Object.fromEntries(SOURCES.map((file) => [file, hash(read(join(root, file)))]));

const curatedFiles = () =>
  walk(skill, (path) => path.endsWith(".md") && !path.startsWith(generated));

function issues(expected) {
  const found = [];
  const generatedFiles = { "tokens.md": expected.tokens, "api.md": expected.api };

  for (const [name, content] of Object.entries(generatedFiles)) {
    const path = join(generated, name);
    if (!existsSync(path) || read(path) !== content) {
      found.push(`Outdated ${name}: run sync.mjs without flags`);
    }
  }

  const statePath = join(generated, "sources.json");
  const state = existsSync(statePath) ? JSON.parse(read(statePath)) : {};
  for (const [file, value] of Object.entries(fingerprint())) {
    if (state[file] !== value) {
      found.push(`Not reconciled with the rules: ${file}`);
    }
  }

  const curated = curatedFiles().map(read).join("\n");
  for (const entry of Object.values(ENTRIES)) {
    for (const name of exportedNames(entry)) {
      if (name !== "tokens" && !curated.includes(name)) {
        found.push(`Missing from the skill rules: ${name}`);
      }
    }
  }

  for (const file of curatedFiles()) {
    for (const pattern of FORBIDDEN) {
      if (pattern.test(read(file))) {
        found.push(
          `Path of this repository in the portable skill: ${relative(root, file)} (${pattern})`,
        );
      }
    }
  }

  const lines = read(join(skill, "SKILL.md")).split("\n").length;
  if (lines > 500) {
    found.push(`SKILL.md is longer than 500 lines: ${lines}`);
  }
  return found;
}

const mode = process.argv[2];
const expected = { tokens: await tokensDocument(), api: apiDocument(await boxPropsDocument()) };

if (mode !== "--check") {
  mkdirSync(generated, { recursive: true });
  writeFileSync(join(generated, "tokens.md"), expected.tokens);
  writeFileSync(join(generated, "api.md"), expected.api);
}
if (mode === "--accept") {
  writeFileSync(join(generated, "sources.json"), `${JSON.stringify(fingerprint(), null, 2)}\n`);
}

const found = issues(expected);
for (const issue of found) {
  console.log(issue);
}
if (found.length === 0) {
  console.log("The design system skill is up to date");
}
process.exit(found.length > 0 ? 1 : 0);

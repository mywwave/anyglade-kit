// Ships the design skill with the package, so its rules match the installed version.
import { cpSync, rmSync } from "node:fs";
import { basename, resolve } from "node:path";

const source = resolve(import.meta.dirname, "../../../.claude/skills/anyglade-design-system");
const target = resolve(import.meta.dirname, "../skills/anyglade-design-system");

rmSync(target, { recursive: true, force: true });
cpSync(source, target, {
  recursive: true,
  // Fingerprints only serve the sync check in this repository.
  filter: (path) => basename(path) !== "sources.json",
});

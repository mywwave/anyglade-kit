// Publishes @anyglade/kit. Run with `bun run release`.
//
// npm refuses to run inside this repository because devEngines asks for bun, and only
// `bun pm pack` turns `catalog:` into real versions. So bun packs and npm publishes the
// archive from a folder outside the repository.
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const kit = resolve(import.meta.dirname, "../packages/kit");
const { name, version } = JSON.parse(readFileSync(join(kit, "package.json"), "utf8"));
const spec = `${name}@${version}`;

const run = (command, args, cwd) =>
  execFileSync(command, args, { cwd, stdio: "inherit", shell: process.platform === "win32" });

const published = await fetch(`https://registry.npmjs.org/${name.replace("/", "%2f")}/${version}`);
if (published.ok) {
  console.log(`${spec} is already on npm`);
  process.exit(0);
}

const folder = mkdtempSync(join(tmpdir(), "anyglade-kit-"));
try {
  run("bun", ["run", "build"], kit);
  run("bun", ["pm", "pack", "--destination", folder], kit);
  const archive = readdirSync(folder).find((file) => file.endsWith(".tgz"));
  run("npm", ["publish", `./${archive}`, "--access", "public"], folder);
  console.log(`New tag: ${spec}`);
} finally {
  rmSync(folder, { recursive: true, force: true });
}

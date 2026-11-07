import { readFileSync } from "node:fs";

for (const file of process.argv.slice(2)) {
  const { width, pageOverflow, blocks } = JSON.parse(readFileSync(file, "utf8"));
  console.log(`\n${width}px, page overflow: ${pageOverflow ? "YES" : "no"}`);

  for (const [name, { issues, signals }] of Object.entries(blocks)) {
    const raised = Object.entries(signals).filter(([, count]) => count > 0);
    const summary = raised.map(([signal, count]) => `${signal} ${count}`).join(", ");
    console.log(
      `${issues.length || raised.length ? "!" : " "} ${name}${summary ? `: ${summary}` : ""}`,
    );
    for (const issue of issues) {
      console.log(`    ${issue}`);
    }
  }
}

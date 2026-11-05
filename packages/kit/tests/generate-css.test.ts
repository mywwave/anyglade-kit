import { readFileSync } from "node:fs";
import { expect, test } from "vite-plus/test";
import { generateBoxCss, generateTokensCss } from "../src/generate-css.ts";

const read = (file: string) =>
  readFileSync(new URL(`../styles/${file}`, import.meta.url), "utf8").replaceAll("\r\n", "\n");

test("generated styles match the token source", () => {
  expect(read("tokens.css")).toBe(generateTokensCss());
  expect(read("box.css")).toBe(generateBoxCss());
});

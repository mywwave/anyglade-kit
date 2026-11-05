import { writeFileSync } from "node:fs";
import { generateBoxCss, generateTokensCss } from "../src/generate-css.ts";

const styles = new URL("../styles/", import.meta.url);

writeFileSync(new URL("tokens.css", styles), generateTokensCss());
writeFileSync(new URL("box.css", styles), generateBoxCss());

#!/usr/bin/env node
// Finds AI-writing tells in user-facing text. Usage:
//   node scripts/check-copy.mjs <file...>
// A hit means "reread this", not "must rewrite": see references/writing.md, "False positives".
// Exit code 1 when anything was found, so it can gate a script.

import { readFileSync } from "node:fs";

// Stems are matched at a word start, case-insensitive. Hints name the sign
// from the slop table in references/writing.md.
const AD = "advertising instead of fact";
const SIGNIFICANCE = "inflated significance";
const NOT_JUST = '"not just X, but Y"';
const NEGATION = "trailing negation";
const FILLER = "corporate filler";
const TAIL = "participle tail";
const OPENER = "rhetorical opener";
const EXPLAINING = "explaining the interface";
const RELEASE = "release anchoring";
const SERVILITY = "servility";
const AUTHORITY = "invented authority";
const CALQUE = "calque";
const AI_WORDS = "AI vocabulary";

const RU = [
  ["мощн", AD],
  ["удобн", AD],
  ["интуитивн", AD],
  ["бесшовн", AD],
  ["уникальн", AD],
  ["идеальн", AD],
  ["в один клик", AD],
  ["всё в одном месте", AD],
  ["все в одном месте", AD],
  ["легко и быстро", AD],
  ["быстро и легко", AD],
  ["без лишних хлопот", AD],
  ["полный контроль", AD],
  ["на новый уровень", AD],
  ["раскройте", AD],
  ["откройте для себя", AD],
  ["играет ключевую роль", SIGNIFICANCE],
  ["ключев", SIGNIFICANCE],
  ["настоящий прорыв", SIGNIFICANCE],
  ["открывает новые возможности", SIGNIFICANCE],
  ["меняет правила игры", SIGNIFICANCE],
  ["неотъемлем", SIGNIFICANCE],
  ["в современном мире", SIGNIFICANCE],
  ["не просто ", NOT_JUST],
  ["не только", NOT_JUST],
  ["никакой рутины", NEGATION],
  ["без лишних кликов", NEGATION],
  ["является", FILLER],
  ["являются", FILLER],
  ["осуществл", FILLER],
  ["производится", FILLER],
  ["данный", FILLER],
  ["данная", FILLER],
  ["данное", FILLER],
  ["в рамках", FILLER],
  ["с целью", FILLER],
  ["на данный момент", FILLER],
  ["обеспечива", `${FILLER} / ${TAIL}`],
  ["предоставляет возможность", FILLER],
  ["позволяет", `${FILLER}: "позволяет + infinitive"`],
  ["позволяют", `${FILLER}: "позволяет + infinitive"`],
  ["посредством", FILLER],
  ["представьте", OPENER],
  ["знакомо?", OPENER],
  ["секрет прост", OPENER],
  ["давайте разбер", `${OPENER} (announcement)`],
  ["в этой статье", `${OPENER} (announcement)`],
  ["ниже вы найдёте", `${OPENER} (announcement)`],
  ["важно отметить", `${OPENER} (announcement)`],
  ["стоит отметить", `${OPENER} (announcement)`],
  ["следует подчеркнуть", `${OPENER} (announcement)`],
  ["в этом разделе вы можете", EXPLAINING],
  ["нажмите на кнопку ниже", EXPLAINING],
  ["здесь отображаются", EXPLAINING],
  ["мы добавили", RELEASE],
  ["новая функция", RELEASE],
  ["отличный вопрос", SERVILITY],
  ["надеемся, это", SERVILITY],
  ["таким образом", `${SERVILITY} (empty conclusion)`],
  ["в итоге вы получаете", `${SERVILITY} (empty conclusion)`],
  ["ещё эффективнее", `${SERVILITY} (empty conclusion)`],
  ["рады сообщить", SERVILITY],
  ["отличные новости", SERVILITY],
  ["потенциально", `${AUTHORITY} (hedging)`],
  ["многие компании", AUTHORITY],
  ["эксперты", AUTHORITY],
  ["это поможет вам", CALQUE],
  ["на ежедневной основе", CALQUE],
  ["в конце дня", CALQUE],
  ["имеет смысл", CALQUE],
];

const EN = [
  ["powerful", AD],
  ["intuitive", AD],
  ["seamless", AD],
  ["effortless", AD],
  ["one click", AD],
  ["one-click", AD],
  ["all-in-one", AD],
  ["all in one place", AD],
  ["quick and easy", AD],
  ["fast and easy", AD],
  ["hassle-free", AD],
  ["full control", AD],
  ["next level", AD],
  ["supercharge", AD],
  ["unlock", AD],
  ["discover the", AD],
  ["cutting-edge", AD],
  ["plays a key role", SIGNIFICANCE],
  ["plays a pivotal role", SIGNIFICANCE],
  ["pivotal", SIGNIFICANCE],
  ["crucial", SIGNIFICANCE],
  ["game-changer", SIGNIFICANCE],
  ["game changer", SIGNIFICANCE],
  ["new possibilities", SIGNIFICANCE],
  ["integral part", SIGNIFICANCE],
  ["in today's", SIGNIFICANCE],
  ["testament", SIGNIFICANCE],
  ["not just", NOT_JUST],
  ["not only", NOT_JUST],
  ["no extra clicks", NEGATION],
  ["no more busywork", NEGATION],
  ["no busywork", NEGATION],
  ["utiliz", FILLER],
  ["facilitat", FILLER],
  ["in order to", FILLER],
  ["serves as", FILLER],
  ["stands as", FILLER],
  ["boasts", FILLER],
  ["allows you to", FILLER],
  ["enables you to", FILLER],
  ["lets you", FILLER],
  ["ensuring", TAIL],
  ["imagine", OPENER],
  ["sound familiar", OPENER],
  ["here's the thing", OPENER],
  ["let's dive", `${OPENER} (announcement)`],
  ["in this article", `${OPENER} (announcement)`],
  ["below you'll find", `${OPENER} (announcement)`],
  ["it's worth noting", `${OPENER} (announcement)`],
  ["it is worth noting", `${OPENER} (announcement)`],
  ["it's important to note", `${OPENER} (announcement)`],
  ["it is important to note", `${OPENER} (announcement)`],
  ["honestly?", OPENER],
  ["in this section you can", EXPLAINING],
  ["here you can see", EXPLAINING],
  ["click the button below", EXPLAINING],
  ["we've added", RELEASE],
  ["we added", RELEASE],
  ["new feature", RELEASE],
  ["now you can", RELEASE],
  ["great question", SERVILITY],
  ["i hope this helps", SERVILITY],
  ["hope this helps", SERVILITY],
  ["we're excited", SERVILITY],
  ["great news", SERVILITY],
  ["in conclusion", `${SERVILITY} (empty conclusion)`],
  ["potentially", `${AUTHORITY} (hedging)`],
  ["many companies", AUTHORITY],
  ["experts", AUTHORITY],
  ["at the end of the day", AI_WORDS],
  ["on a daily basis", AI_WORDS],
  ["delve", AI_WORDS],
  ["robust", AI_WORDS],
  ["leverag", AI_WORDS],
  ["empower", AI_WORDS],
  ["elevate", AI_WORDS],
  ["streamlin", AI_WORDS],
  ["tapestry", AI_WORDS],
  ["landscape", AI_WORDS],
  ["vibrant", AI_WORDS],
  ["showcas", AI_WORDS],
  ["foster", AI_WORDS],
  ["underscor", AI_WORDS],
  ["intricate", AI_WORDS],
];

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const toRegex = ([stem, hint]) => [new RegExp(`(?<!\\p{L})${escape(stem)}`, "iu"), stem, hint];
const RU_RULES = RU.map(toRegex);
const EN_RULES = EN.map(toRegex);

const EMOJI = /(?![©®™])\p{Extended_Pictographic}/u;
const CYRILLIC = /\p{Script=Cyrillic}/u;
const LATIN_WORDS = /[A-Za-z]{3,}(?:\s+[A-Za-z]{2,}){2,}/;

function isEnglishFile(path) {
  return /(^|[\\/])en([\\/.]|$)/.test(path) || /\.en\.(md|mdx|json)$/.test(path);
}

function check(path) {
  const englishFile = isEnglishFile(path);
  const json = path.endsWith(".json");
  const hits = [];
  readFileSync(path, "utf8")
    .split(/\r?\n/)
    .forEach((raw, i) => {
      // In message files only the value is text; keys like "unlockTitle" are code.
      const line = json ? raw.replace(/^\s*"[^"]*"\s*:\s*/, "") : raw;
      const at = (msg) => hits.push(`${path}:${i + 1}  ${msg}\n    ${raw.trim().slice(0, 160)}`);
      const russian = CYRILLIC.test(line);
      const english = englishFile || (!russian && LATIN_WORDS.test(line));

      if (russian) {
        for (const [re, stem, hint] of RU_RULES) if (re.test(line)) at(`«${stem}» (${hint})`);
        if ((line.match(/ — /g) || []).length >= 2) at("two dashes in one line (dash for a pause)");
        if (/ — и /.test(line)) at("«— и» (dash for a pause)");
        if (/\p{L}!/u.test(line)) at("exclamation mark");
      }
      if (english) {
        // Curly apostrophes are correct typography; match them like straight ones.
        const plain = line.replaceAll("’", "'");
        for (const [re, stem, hint] of EN_RULES) if (re.test(plain)) at(`"${stem}" (${hint})`);
        // An unspaced en dash in a range (Thu–Wed, 10–20) is correct typography.
        if (/—|\s–\s/.test(line) && !russian) at("em/en dash in English text (dash for a pause)");
        // A letter, then "!" and a word boundary: skips TS non-null assertions like x!.y.
        if (!russian && /\p{L}!(?=\s|$|["'”’<)])/u.test(line)) at("exclamation mark");
      }
      if (EMOJI.test(line)) at("emoji (decoration; acceptable only in content for fans)");
    });
  return hits;
}

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("Usage: node check-copy.mjs <file...>");
  process.exit(2);
}
const hits = files.flatMap(check);
console.log(hits.length ? hits.join("\n") : "Clean: no stop phrases found.");
console.log(
  `\n${hits.length} hits. Reread each one; for false positives see references/writing.md.`,
);
process.exit(hits.length ? 1 : 0);

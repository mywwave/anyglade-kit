#!/usr/bin/env node
// Finds AI-writing tells in user-facing text. Usage:
//   node scripts/check-copy.mjs <file...>
// A hit means "reread this", not "must rewrite": see references/writing.md, «Ложные срабатывания».
// Exit code 1 when anything was found, so it can gate a script.

import { readFileSync } from "node:fs";

// Stems are matched at a word start, case-insensitive. Hints name the pattern
// from references/writing.md.
const RU = [
  ["мощн", "1 реклама"],
  ["удобн", "1 реклама"],
  ["интуитивн", "1 реклама"],
  ["бесшовн", "1 реклама"],
  ["уникальн", "1 реклама"],
  ["идеальн", "1 реклама"],
  ["в один клик", "1 реклама"],
  ["всё в одном месте", "1 реклама"],
  ["все в одном месте", "1 реклама"],
  ["легко и быстро", "1 реклама"],
  ["быстро и легко", "1 реклама"],
  ["без лишних хлопот", "1 реклама"],
  ["полный контроль", "1 реклама"],
  ["на новый уровень", "1 реклама"],
  ["раскройте", "1 реклама"],
  ["откройте для себя", "1 реклама"],
  ["играет ключевую роль", "2 значимость"],
  ["ключев", "2 значимость"],
  ["настоящий прорыв", "2 значимость"],
  ["открывает новые возможности", "2 значимость"],
  ["меняет правила игры", "2 значимость"],
  ["неотъемлем", "2 значимость"],
  ["в современном мире", "2 значимость"],
  ["не просто ", "3 «не просто X, а Y»"],
  ["не только", "3 «не только…, но и»"],
  ["никакой рутины", "3 хвостовое отрицание"],
  ["без лишних кликов", "3 хвостовое отрицание"],
  ["является", "4 канцелярит"],
  ["являются", "4 канцелярит"],
  ["осуществл", "4 канцелярит"],
  ["производится", "4 канцелярит"],
  ["данный", "4 канцелярит"],
  ["данная", "4 канцелярит"],
  ["данное", "4 канцелярит"],
  ["в рамках", "4 канцелярит"],
  ["с целью", "4 канцелярит"],
  ["на данный момент", "4 канцелярит"],
  ["обеспечива", "4 канцелярит / 5 хвост"],
  ["предоставляет возможность", "4 канцелярит"],
  ["позволяет", "4 «позволяет + инфинитив»"],
  ["позволяют", "4 «позволяет + инфинитив»"],
  ["посредством", "4 канцелярит"],
  ["представьте", "9 риторический заход"],
  ["знакомо?", "9 риторический заход"],
  ["секрет прост", "9 риторический заход"],
  ["давайте разбер", "9 анонс"],
  ["в этой статье", "9 анонс"],
  ["ниже вы найдёте", "9 анонс"],
  ["важно отметить", "9 анонс"],
  ["стоит отметить", "9 анонс"],
  ["следует подчеркнуть", "9 анонс"],
  ["в этом разделе вы можете", "10 объяснение интерфейса"],
  ["нажмите на кнопку ниже", "10 объяснение интерфейса"],
  ["здесь отображаются", "10 объяснение интерфейса"],
  ["мы добавили", "10 привязка к релизу"],
  ["новая функция", "10 привязка к релизу"],
  ["отличный вопрос", "12 сервильность"],
  ["надеемся, это", "12 сервильность"],
  ["таким образом", "12 пустой вывод"],
  ["в итоге вы получаете", "12 пустой вывод"],
  ["ещё эффективнее", "12 пустой вывод"],
  ["рады сообщить", "12 сервильность"],
  ["отличные новости", "12 сервильность"],
  ["потенциально", "13 перестраховка"],
  ["многие компании", "13 выдуманная опора"],
  ["эксперты", "13 выдуманная опора"],
  ["это поможет вам", "14 калька"],
  ["на ежедневной основе", "14 калька"],
  ["в конце дня", "14 калька"],
  ["имеет смысл", "14 калька"],
];

const EN = [
  "delve",
  "seamless",
  "robust",
  "leverag",
  "empower",
  "unlock",
  "elevate",
  "streamlin",
  "tapestry",
  "landscape",
  "testament",
  "pivotal",
  "crucial",
  "vibrant",
  "showcas",
  "foster",
  "underscor",
  "intricate",
  "game-changer",
  "game changer",
  "cutting-edge",
  "effortless",
  "serves as",
  "stands as",
  "boasts",
  "not just",
  "not only",
  "in today's",
  "great question",
  "i hope this helps",
  "let's dive",
  "here's the thing",
  "honestly?",
  "one click",
  "all-in-one",
  "powerful",
  "next level",
  "supercharge",
].map((stem) => [stem, "EN AI vocabulary"]);

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
        if ((line.match(/ — /g) || []).length >= 2) at("два тире в строке (7 тире ради паузы)");
        if (/ — и /.test(line)) at("«— и» (7 тире ради паузы)");
      }
      if (english) {
        for (const [re, stem, hint] of EN_RULES) if (re.test(line)) at(`"${stem}" (${hint})`);
        // An unspaced en dash in a range (Thu–Wed, 10–20) is correct typography.
        if (/—|\s–\s/.test(line) && !russian) at("em/en dash в английском тексте");
      }
      if (EMOJI.test(line)) at("эмодзи (15 оформление; допустимо только в контенте для фанатов)");
      if (russian && /\p{L}!/u.test(line)) at("восклицательный знак");
    });
  return hits;
}

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("Usage: node check.mjs <file...>");
  process.exit(2);
}
const hits = files.flatMap(check);
console.log(hits.length ? hits.join("\n") : "Чисто: стоп-фраз не найдено.");
console.log(
  `\n${hits.length} срабатываний. Каждое перечитать; ложные см. в references/writing.md.`,
);
process.exit(hits.length ? 1 : 0);

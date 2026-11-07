const letters = new Intl.Segmenter(undefined, { granularity: "grapheme" });

const split = (text: string) => Array.from(letters.segment(text), ({ segment }) => segment);

/** Finds the part of a text that really changed, so everything around it can stay put. */
export function splitChange(before: string, after: string) {
  const from = split(before);
  const to = split(after);
  const room = Math.min(from.length, to.length);

  let start = 0;
  while (start < room && from[start] === to[start]) {
    start += 1;
  }

  let end = 0;
  while (end < room - start && from[from.length - 1 - end] === to[to.length - 1 - end]) {
    end += 1;
  }

  return {
    prefix: from.slice(0, start).join(""),
    leaving: from.slice(start, from.length - end).join(""),
    arriving: to.slice(start, to.length - end).join(""),
    suffix: end > 0 ? from.slice(-end).join("") : "",
  };
}

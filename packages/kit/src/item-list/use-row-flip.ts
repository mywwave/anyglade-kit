import { useLayoutEffect, type RefObject } from "react";
import { durations, easings } from "../tokens.ts";
import { isDropLanding } from "./drag-session.ts";

/** More changes at once mean a new list, such as another section, and not a move. */
const MAX_CHANGED_ROWS = 1;

const readRows = (list: HTMLElement) => [...list.querySelectorAll<HTMLElement>("[data-key]")];
const measure = (rows: HTMLElement[]) =>
  new Map(rows.map((row) => [row.dataset.key ?? "", row.offsetTop]));

/**
 * Rows glide to their new place when the order changes. Only the rows move, so unlike a
 * view transition nothing else on the page is replaced by a snapshot or stops taking input.
 *
 * The rows are watched in the DOM: a React Aria collection commits them in a pass of its
 * own, after the parent's effects. The observer runs after that pass and before the paint.
 */
export function useRowFlip(list: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const element = list.current;
    if (!element) {
      return;
    }
    let tops = measure(readRows(element));

    function flip() {
      const rows = readRows(element!);
      const previous = tops;
      tops = measure(rows);

      const added = [...tops.keys()].filter((id) => !previous.has(id)).length;
      const removed = [...previous.keys()].filter((id) => !tops.has(id)).length;
      const isReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (added + removed > MAX_CHANGED_ROWS || isReduced || isDropLanding()) {
        return;
      }

      const timing = { duration: Number.parseInt(durations.base), easing: easings.standard };
      for (const row of rows) {
        const from = previous.get(row.dataset.key ?? "");
        if (from === undefined) {
          row.animate({ opacity: [0, 1] }, timing);
        } else if (from !== row.offsetTop) {
          row.animate({ transform: [`translateY(${from - row.offsetTop}px)`, "none"] }, timing);
        }
      }
    }

    const observer = new MutationObserver(flip);
    observer.observe(element, { childList: true });
    return () => observer.disconnect();
  }, [list]);
}

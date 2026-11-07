"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Shimmer } from "../shimmer/shimmer.tsx";
import { durations, easings, spacing } from "../tokens.ts";
import { splitChange } from "./split-change.ts";

const isReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Less than this is rounding, and easing it would only shake the text next to it. */
const MIN_WIDTH_CHANGE = 0.5;
/** Lines that may still be on their way out, so a fast change never cuts one off. */
const KEPT_LINES = 2;

const arriving = { duration: Number.parseInt(durations.base), easing: easings.decelerate };
const leaving = { duration: Number.parseInt(durations.fast), easing: easings.accelerate };
const slidingOut = { duration: Number.parseInt(durations.base), easing: easings.accelerate };
const slidingIn = { duration: Number.parseInt(durations.base), easing: easings.standard };
/** Short of a full line, so the text fades on its way and never meets the clipped edge. */
const SLIDE_DISTANCE = "70%";
/** The new line starts as the old one is nearly gone: with a true gap the text blinks. */
const SLIDE_OVERLAP = (Number.parseInt(durations.fast) * 2) / 3;

export interface TextSwapProps {
  text: string;
  /**
   * The text is in progress: see `Shimmer`. Passing it at all keeps the whole line
   * together, because the highlight runs along the line and not along a part of it.
   */
  isShimmering?: boolean;
}

interface Line {
  id: number;
  text: string;
}

/** Stops what runs on an element and returns where it stood, so the next move starts there. */
function freeze(element: Element, read: (style: CSSStyleDeclaration) => Keyframe) {
  const frame = read(getComputedStyle(element));
  for (const animation of element.getAnimations()) {
    animation.cancel();
  }
  return frame;
}

/** Starts from the running width, or from the given one when the box stood still. */
function easeWidth(
  box: HTMLElement,
  restingWidth: number,
  timing: (isGrowing: boolean) => KeyframeAnimationOptions,
) {
  const isEasing = box.getAnimations().length > 0;
  const { width } = freeze(box, (style) => ({ width: style.width }));
  const from = isEasing ? Number.parseFloat(String(width)) : restingWidth;
  const target = box.getBoundingClientRect().width;
  if (Math.abs(from - target) >= MIN_WIDTH_CHANGE) {
    box.animate({ width: [`${from}px`, `${target}px`] }, timing(target > from));
  }
  return target;
}

function LineSwap({ text, isShimmering }: { text: string; isShimmering: boolean }) {
  const box = useRef<HTMLSpanElement>(null);
  const [lines, setLines] = useState<Line[]>([{ id: 0, text }]);
  const current = lines.at(-1) ?? { id: 0, text };
  const lastId = useRef(current.id);
  const restingWidth = useRef(0);

  if (text !== current.text) {
    const kept = isReducedMotion() ? [] : lines.slice(-KEPT_LINES);
    setLines([...kept, { id: current.id + 1, text }]);
  }

  useLayoutEffect(() => {
    restingWidth.current = box.current?.getBoundingClientRect().width ?? 0;
  }, []);

  useLayoutEffect(() => {
    const element = box.current;
    if (!element || current.id === lastId.current) {
      return;
    }
    lastId.current = current.id;
    if (isReducedMotion()) {
      return;
    }

    const incoming = element.lastElementChild;
    const outgoing = incoming?.previousElementSibling;
    restingWidth.current = easeWidth(element, restingWidth.current, () => ({
      ...arriving,
      easing: easings.standard,
    }));
    incoming?.animate(
      { opacity: [0, 1], transform: [`translateY(${spacing.s})`, "none"] },
      arriving,
    );

    if (outgoing) {
      const leavingId = current.id - 1;
      const from = freeze(outgoing, ({ opacity, transform }) => ({ opacity, transform }));
      outgoing.animate([from, { opacity: 0, transform: `translateY(-${spacing.s})` }], {
        ...leaving,
        fill: "forwards",
      }).onfinish = () => setLines((list) => list.filter((line) => line.id !== leavingId));
    }
  }, [current.id]);

  return (
    <span ref={box} className="ag-swap">
      {lines.map((line) => {
        const isCurrent = line.id === current.id;

        return (
          <span
            key={line.id}
            aria-hidden={isCurrent ? undefined : true}
            className={isCurrent ? "ag-swap__line" : "ag-swap__line ag-swap__line--leaving"}
          >
            <Shimmer isActive={isCurrent && isShimmering}>{line.text}</Shimmer>
          </span>
        );
      })}
    </span>
  );
}

interface SlideState {
  text: string;
  prefix: string;
  suffix: string;
  /** The changing part, last one on screen. Earlier ones are on their way out. */
  lines: Line[];
}

/** Waiting behind a line that is leaving, so nobody has seen it yet. */
const isWaiting = (line: Element) =>
  line.getAnimations().some(({ currentTime, effect }) => {
    const delay = effect?.getComputedTiming().delay ?? 0;
    return Number(currentTime ?? 0) < delay;
  });

function SlidingText({ text }: { text: string }) {
  const slot = useRef<HTMLSpanElement>(null);
  const exitEnd = useRef(0);
  const [state, setState] = useState<SlideState>({ text, prefix: text, suffix: "", lines: [] });
  const currentId = state.lines.at(-1)?.id ?? 0;
  const lastId = useRef(currentId);

  if (text !== state.text) {
    const change = splitChange(state.text, text);
    const on = isReducedMotion() ? [] : state.lines.slice(-KEPT_LINES);
    // The line on screen takes the whole leaving part, so the first frame looks the same.
    const lines = on.map((line) =>
      line.id === currentId ? { ...line, text: change.leaving } : line,
    );
    const outgoing =
      on.length === 0 && change.leaving && !isReducedMotion()
        ? [{ id: currentId, text: change.leaving }]
        : [];

    setState({
      text,
      prefix: change.prefix,
      suffix: change.suffix,
      lines: [...lines, ...outgoing, { id: currentId + 1, text: change.arriving }],
    });
  }

  const forget = useCallback((id: number) => {
    setState((now) => ({ ...now, lines: now.lines.filter((line) => line.id !== id) }));
  }, []);

  useLayoutEffect(() => {
    const element = slot.current;
    if (!element || currentId === lastId.current) {
      return;
    }
    lastId.current = currentId;
    if (isReducedMotion()) {
      return;
    }

    const incoming = element.lastElementChild;
    const outgoing = incoming?.previousElementSibling;
    const now = performance.now();

    if (outgoing && isWaiting(outgoing)) {
      forget(currentId - 1);
    } else if (outgoing) {
      const leavingId = currentId - 1;
      const from = freeze(outgoing, ({ opacity, transform }) => ({ opacity, transform }));
      exitEnd.current = now + slidingOut.duration;
      outgoing.animate([from, { opacity: 0, transform: `translateY(-${SLIDE_DISTANCE})` }], {
        ...slidingOut,
        fill: "forwards",
      }).onfinish = () => forget(leavingId);
    }

    // The new line waits only for what is left of the exit, so a fast change is never blank.
    const exitLeft = Math.max(0, exitEnd.current - now);
    const delay = Math.max(0, exitLeft - SLIDE_OVERLAP);
    // The slot clips, so it opens before the new line comes and closes after the old one left.
    easeWidth(element, outgoing?.getBoundingClientRect().width ?? 0, (isGrowing) => ({
      duration: isGrowing ? Math.max(delay, leaving.duration) : slidingIn.duration,
      delay: isGrowing ? 0 : exitLeft,
      easing: easings.standard,
      fill: "backwards",
    }));
    incoming?.animate(
      { opacity: [0, 1], transform: [`translateY(${SLIDE_DISTANCE})`, "none"] },
      { ...slidingIn, delay, fill: "backwards" },
    );
  }, [currentId, forget]);

  return (
    <span className="ag-swap">
      <span className="ag-visually-hidden">{text}</span>
      <span aria-hidden className="ag-swap__text">
        {state.prefix}
        <span ref={slot} className="ag-swap__slot">
          {state.lines.map((line) => (
            <span
              key={line.id}
              className={
                line.id === currentId ? "ag-swap__line" : "ag-swap__line ag-swap__line--leaving"
              }
            >
              {line.text}
            </span>
          ))}
        </span>
        {state.suffix}
      </span>
    </span>
  );
}

/**
 * Text that changes in place. What stays the same does not move: the changed part slides
 * up and the new one follows from below, like a digit on a clock, and the width eases so
 * whatever stands next to it does not jump. A shimmering line swaps as a whole.
 *
 * A change can land at any moment. A line stays the same element from arriving to leaving,
 * so an interrupted one leaves from where it stood instead of starting over.
 *
 * It stands out, so keep it rare: one short line of the same object per action. Timers,
 * values that follow input, table cells and sentences stay plain.
 */
export function TextSwap({ text, isShimmering }: TextSwapProps) {
  return isShimmering === undefined ? (
    <SlidingText text={text} />
  ) : (
    <LineSwap isShimmering={isShimmering} text={text} />
  );
}

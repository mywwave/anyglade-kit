"use client";

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { createPortal, flushSync } from "react-dom";
import { durations, easings } from "../tokens.ts";
import {
  aimSession,
  getSessionTarget,
  markLanding,
  publishSession,
  rulesOf,
} from "./drag-session.ts";

/** A press stays a press until the pointer really travels. */
const DRAG_THRESHOLD = 4;
const GHOST = ".ag-item-list__ghost-body";

const timing = { duration: Number.parseInt(durations.base), easing: easings.standard };

const isReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Closes the space a leaving row held, with the gap next to it, so nothing below jumps. */
function collapse(element: HTMLElement) {
  let leaving = element;
  while (leaving.parentElement?.childElementCount === 1) {
    leaving = leaving.parentElement;
  }
  const gap = Number.parseFloat(getComputedStyle(leaving.parentElement ?? leaving).rowGap) || 0;
  const edge = leaving.previousElementSibling ? "marginTop" : "marginBottom";

  return {
    /** What everything below this row will rise by. */
    closes: leaving.offsetHeight + gap,
    animation: leaving.animate(
      [
        { height: `${leaving.offsetHeight}px`, overflow: "hidden" },
        {
          height: "0px",
          paddingBlock: "0px",
          [edge]: `${-gap}px`,
          opacity: 0,
          overflow: "hidden",
        },
      ],
      { ...timing, fill: "forwards" },
    ),
  };
}

const translate = (x: number, y: number) => `translate(${x}px, ${y}px)`;

export interface DraggableProps {
  /** What a target receives. Targets are `ItemList` rows with `drop`. */
  value: string;
  /** Follows the pointer and shows in the row where it would land. A short name, not the row. */
  preview: ReactNode;
  isDisabled?: boolean;
  children: ReactNode;
}

/** Drag is a shortcut: always offer the same action in a menu for touch and the keyboard. */
export function Draggable({ value, preview, isDisabled = false, children }: DraggableProps) {
  const source = useRef<HTMLDivElement>(null);
  const chip = useRef<HTMLDivElement>(null);
  const stopTracking = useRef<() => void>(() => undefined);
  const [phase, setPhase] = useState<"idle" | "lifted" | "settling">("idle");

  useEffect(() => () => stopTracking.current(), []);

  function clear() {
    delete document.documentElement.dataset.agSettling;
    publishSession(null);
    setPhase("idle");
  }

  /** The chip travels to its place first and the data changes after, so nothing teleports. */
  function settle(x: number, y: number, leaving?: Animation) {
    const element = chip.current;
    setPhase("settling");
    return Promise.all([
      element?.animate(
        { transform: [element.style.transform, translate(x, y)] },
        { ...timing, fill: "forwards" },
      ).finished,
      leaving?.finished,
    ]);
  }

  async function finish(start: DOMRect) {
    const target = getSessionTarget();
    const rules = target && rulesOf(target);
    const ghost = target?.querySelector(GHOST)?.getBoundingClientRect();
    const element = chip.current;

    if (rules && ghost && element && source.current && !isReducedMotion()) {
      const style = getComputedStyle(element);
      // The chip takes over from the ghost, or the name would show twice while it lands.
      document.documentElement.dataset.agSettling = "";
      const isAbove = source.current.getBoundingClientRect().top < ghost.top;
      const { closes, animation } = collapse(source.current);
      await settle(
        ghost.left - Number.parseFloat(style.paddingLeft),
        ghost.top - Number.parseFloat(style.paddingTop) - (isAbove ? closes : 0),
        animation,
      );
      markLanding();
    } else if (!rules && !isReducedMotion()) {
      publishSession(null);
      await settle(start.left, start.top);
    }

    flushSync(() => {
      rules?.onDrop(value);
      clear();
    });
  }

  function press(event: ReactPointerEvent<HTMLDivElement>) {
    if (isDisabled || event.button !== 0 || event.pointerType === "touch" || phase !== "idle") {
      return;
    }
    const { clientX: startX, clientY: startY, pointerId, target } = event;
    const start = event.currentTarget.getBoundingClientRect();
    let isLifted = false;

    function lift() {
      isLifted = true;
      // The row underneath must not read the release as a press on it.
      target.dispatchEvent(new PointerEvent("pointercancel", { bubbles: true, pointerId }));
      document.documentElement.dataset.agDragging = "";
      flushSync(() => setPhase("lifted"));
      publishSession({ value, preview, target: null });
    }

    function move(moved: PointerEvent) {
      if (!isLifted) {
        if (Math.hypot(moved.clientX - startX, moved.clientY - startY) < DRAG_THRESHOLD) {
          return;
        }
        lift();
      }
      if (chip.current) {
        chip.current.style.transform = translate(
          start.left + moved.clientX - startX,
          start.top + moved.clientY - startY,
        );
      }
      aimSession(moved.clientX, moved.clientY);
    }

    function release() {
      stopTracking.current();
      if (isLifted) {
        void finish(start);
      }
    }

    function abort() {
      publishSession(null);
      release();
    }

    function onKey(pressed: KeyboardEvent) {
      if (pressed.key === "Escape") {
        abort();
      }
    }

    function onCancel(cancelled: PointerEvent) {
      if (cancelled.isTrusted) {
        abort();
      }
    }

    stopTracking.current = () => {
      delete document.documentElement.dataset.agDragging;
      removeEventListener("pointermove", move);
      removeEventListener("pointerup", release);
      removeEventListener("pointercancel", onCancel);
      removeEventListener("keydown", onKey);
    };
    addEventListener("pointermove", move);
    addEventListener("pointerup", release);
    addEventListener("pointercancel", onCancel);
    addEventListener("keydown", onKey);
  }

  return (
    <div
      ref={source}
      className="ag-draggable"
      data-disabled={isDisabled ? "" : undefined}
      data-dragging={phase === "idle" ? undefined : ""}
      onPointerDown={press}
    >
      {children}
      {phase === "idle"
        ? null
        : createPortal(
            <div
              ref={chip}
              aria-hidden
              className="ag-drag-chip"
              data-settling={phase === "settling" ? "" : undefined}
            >
              {preview}
            </div>,
            document.body,
          )}
    </div>
  );
}

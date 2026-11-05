"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Shimmer } from "../shimmer/shimmer.tsx";
import { durations, easings } from "../tokens.ts";

const isReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

export interface TextSwapProps {
  text: string;
  /** The text is in progress: see `Shimmer`. */
  isShimmering?: boolean;
}

/**
 * Text that changes in place: the old line leaves upward, the new one arrives from
 * below, and the width eases so whatever stands next to it does not jump.
 */
export function TextSwap({ text, isShimmering = false }: TextSwapProps) {
  const box = useRef<HTMLSpanElement>(null);
  const lastWidth = useRef<number | null>(null);
  const [current, setCurrent] = useState(text);
  const [leaving, setLeaving] = useState<string | null>(null);
  const [hasChanged, setHasChanged] = useState(false);

  if (text !== current) {
    setCurrent(text);
    setLeaving(isReducedMotion() ? null : current);
    setHasChanged(true);
  }

  useLayoutEffect(() => {
    const element = box.current;
    if (!element) {
      return;
    }
    const width = element.getBoundingClientRect().width;
    const previous = lastWidth.current;
    lastWidth.current = width;
    if (previous !== null && previous !== width && !isReducedMotion()) {
      element.animate(
        { width: [`${previous}px`, `${width}px`] },
        { duration: Number.parseInt(durations.base), easing: easings.standard },
      );
    }
  }, [current]);

  return (
    <span ref={box} className="ag-swap">
      {leaving ? (
        <span aria-hidden className="ag-swap__leaving" onAnimationEnd={() => setLeaving(null)}>
          {leaving}
        </span>
      ) : null}
      <span key={current} className={hasChanged ? "ag-swap__entering" : undefined}>
        <Shimmer isActive={isShimmering}>{current}</Shimmer>
      </span>
    </span>
  );
}

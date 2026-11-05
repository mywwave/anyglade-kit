"use client";

import { useEffect, useRef, useState } from "react";
import { timings } from "../tokens.ts";

/**
 * Turns "work is running" into "show a loader": nothing for fast work, and once
 * shown the loader stays long enough to be read instead of flashing.
 */
export function useLoadingIndicator(isLoading: boolean) {
  const [isVisible, setIsVisible] = useState(false);
  const shownAt = useRef(0);

  useEffect(() => {
    if (isLoading === isVisible) {
      return undefined;
    }
    const wait = isLoading
      ? timings.loaderDelay
      : Math.max(0, shownAt.current + timings.loaderMinimum - performance.now());
    const timer = setTimeout(() => {
      shownAt.current = performance.now();
      setIsVisible(isLoading);
    }, wait);
    return () => clearTimeout(timer);
  }, [isLoading, isVisible]);

  return isVisible;
}

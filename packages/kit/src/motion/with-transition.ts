import { flushSync } from "react-dom";

/**
 * Applies a state change so that elements with a `viewTransitionName` flow to
 * their new place. Without browser support, or with reduced motion, it just applies it.
 * The same goes while a panel floats over the page: the transition swaps the whole page
 * for a snapshot, and someone working in that panel would see it blink and lose input.
 */
export function withTransition(update: () => void) {
  const isReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasLivePanel = document.querySelector(".ag-floating") !== null;
  if (isReduced || hasLivePanel || !("startViewTransition" in document)) {
    update();
    return;
  }
  // A newer transition skips this one. The update still applies, only the animation is dropped.
  document.startViewTransition(() => flushSync(update)).ready.catch(() => undefined);
}

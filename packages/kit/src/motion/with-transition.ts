import { flushSync } from "react-dom";

/**
 * Applies a state change so that elements with a `viewTransitionName` flow to
 * their new place. Without browser support, or with reduced motion, it just applies it.
 */
export function withTransition(update: () => void) {
  const isReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (isReduced || !("startViewTransition" in document)) {
    update();
    return;
  }
  // A newer transition skips this one. The update still applies, only the animation is dropped.
  document.startViewTransition(() => flushSync(update)).ready.catch(() => undefined);
}

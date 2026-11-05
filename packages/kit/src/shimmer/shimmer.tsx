"use client";

import { useState } from "react";

export interface ShimmerProps {
  children: string;
  /** Stop it the moment the work ends: a shimmer always means "in progress". */
  isActive?: boolean;
}

/**
 * The text itself never changes. The highlight is a layer on top, and it finishes its
 * pass before it goes: between passes it is off the text, so the end is invisible.
 */
export function Shimmer({ children, isActive = true }: ShimmerProps) {
  const [isLayerMounted, setIsLayerMounted] = useState(isActive);

  if (isActive && !isLayerMounted) {
    setIsLayerMounted(true);
  }

  return (
    <span
      className="ag-shimmer"
      data-active={isActive || undefined}
      data-layer={isLayerMounted || undefined}
      data-text={children}
      onAnimationIteration={() => {
        if (!isActive) {
          setIsLayerMounted(false);
        }
      }}
    >
      {children}
    </span>
  );
}

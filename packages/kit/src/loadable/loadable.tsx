"use client";

import type { ReactNode } from "react";
import { Box } from "../box/box.tsx";
import { useLoadingIndicator } from "../motion/use-loading-indicator.ts";

export interface LoadableProps {
  isLoading: boolean;
  /** Repeats the layout of the content, so nothing jumps when it arrives. */
  skeleton: ReactNode;
  children: ReactNode;
}

export function Loadable({ isLoading, skeleton, children }: LoadableProps) {
  const isSkeletonVisible = useLoadingIndicator(isLoading);

  if (isSkeletonVisible) {
    return (
      <Box aria-busy display="block" motion="fade" width="100%">
        {skeleton}
      </Box>
    );
  }

  return isLoading ? null : (
    <Box display="block" motion="fade" width="100%">
      {children}
    </Box>
  );
}

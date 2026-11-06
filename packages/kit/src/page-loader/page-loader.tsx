"use client";

import { ProgressBar } from "@heroui/react";
import { useExitAnimation } from "@react-aria/utils";
import { useRef, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { useLoadingIndicator } from "../motion/use-loading-indicator.ts";
import { timings } from "../tokens.ts";
import { Text } from "../text/text.tsx";
import { TextSwap } from "../text-swap/text-swap.tsx";

export interface PageLoaderProps {
  isLoading: boolean;
  /** One shape on a clear background: it becomes a mask, so the colors follow the theme. */
  logo: { src: string; width: number; height: number };
  /** What is happening now. It swaps in place as the work moves on. */
  status: string;
  /** Spoken name of the bar. */
  label: string;
  /** Percent done. Without it the bar runs until the work ends. */
  value?: number;
  /**
   * How long the work may take before the loader appears, in milliseconds.
   * Anything faster never sees it, so a static page opens without a flash.
   */
  delay?: number;
}

/** Covers the page while a whole app starts, when the shape of what comes is not known yet. */
export function PageLoader({
  isLoading,
  logo,
  status,
  label,
  value,
  delay = timings.pageLoaderDelay,
}: PageLoaderProps) {
  const root = useRef<HTMLDivElement>(null);
  const isVisible = useLoadingIndicator(isLoading, delay);
  const isExiting = useExitAnimation(root, isVisible);

  if (!isVisible && !isExiting) {
    return null;
  }

  const shape = {
    width: logo.width,
    height: logo.height,
    "--ag-page-loader-logo": `url("${logo.src}")`,
  } as CSSProperties;

  return createPortal(
    <div ref={root} aria-busy className="ag-page-loader" data-exiting={isExiting ? "" : undefined}>
      <div className="ag-page-loader__logo" style={shape} />
      <div className="ag-page-loader__progress">
        <ProgressBar
          aria-label={label}
          isIndeterminate={value === undefined}
          size="sm"
          value={value}
        >
          <ProgressBar.Track>
            <ProgressBar.Fill />
          </ProgressBar.Track>
        </ProgressBar>
        <output>
          <Text as="span" variant="caption" color="muted">
            <TextSwap text={status} />
          </Text>
        </output>
      </div>
    </div>,
    document.body,
  );
}

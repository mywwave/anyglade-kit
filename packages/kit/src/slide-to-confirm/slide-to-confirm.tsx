"use client";

import { Spinner } from "@heroui/react";
import { useRef, useState } from "react";
import { mergeProps, useButton, useMove } from "react-aria";
import { ArrowRight, Check } from "../icons.ts";
import { Shimmer } from "../shimmer/shimmer.tsx";
import { Text } from "../text/text.tsx";
import { durations, easings } from "../tokens.ts";

export interface SlideToConfirmProps {
  /** The action and its stake, short enough for one line: "Send $480". */
  label: string;
  /** Shown while `onConfirm` runs, with a shimmer. */
  pendingLabel: string;
  doneLabel: string;
  /**
   * Runs once the thumb reaches the end, or on Enter for a keyboard.
   * Return a promise and the thumb waits at the end. A rejection sends it back.
   */
  onConfirm: () => unknown;
}

type Phase = "idle" | "pending" | "done";

/** Share of the track past which letting go confirms instead of sliding back. */
const CONFIRM_AT = 0.9;

/**
 * An action that should not happen by accident: a money transfer, a deletion.
 * A drag is a deliberate gesture, a stray click is not. The keyboard confirms with Enter.
 */
export function SlideToConfirm({ label, pendingLabel, doneLabel, onConfirm }: SlideToConfirmProps) {
  const track = useRef<HTMLDivElement>(null);
  const thumb = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLSpanElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const offset = useRef(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [isDragging, setIsDragging] = useState(false);

  function travel() {
    const trackElement = track.current;
    const thumbElement = thumb.current;
    if (!trackElement || !thumbElement) {
      return 0;
    }
    const inset = thumbElement.offsetLeft;
    return trackElement.clientWidth - thumbElement.offsetWidth - inset * 2;
  }

  /** The fill is as wide as the rail and slides with its right edge under the thumb. */
  function fillShift(x: number) {
    return `translateX(${x - travel()}px)`;
  }

  function place(x: number) {
    offset.current = x;
    const max = travel();
    if (thumb.current) {
      thumb.current.style.transform = `translateX(${x}px)`;
    }
    if (fill.current) {
      fill.current.style.transform = fillShift(x);
    }
    if (hint.current) {
      hint.current.style.opacity = String(max > 0 ? 1 - x / max : 1);
    }
  }

  function glide(to: number) {
    const from = offset.current;
    place(to);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const timing = { duration: Number.parseFloat(durations.base), easing: easings.standard };
    thumb.current?.animate(
      [{ transform: `translateX(${from}px)` }, { transform: `translateX(${to}px)` }],
      timing,
    );
    fill.current?.animate([{ transform: fillShift(from) }, { transform: fillShift(to) }], timing);
  }

  async function confirm() {
    if (phase !== "idle") {
      return;
    }
    glide(travel());
    navigator.vibrate?.(12);
    setPhase("pending");
    try {
      await onConfirm();
      setPhase("done");
    } catch {
      glide(0);
      setPhase("idle");
    }
  }

  const { moveProps } = useMove({
    onMoveStart() {
      if (phase === "idle") {
        setIsDragging(true);
      }
    },
    onMove(event) {
      if (phase === "idle" && event.pointerType !== "keyboard") {
        place(Math.min(Math.max(offset.current + event.deltaX, 0), travel()));
      }
    },
    onMoveEnd() {
      setIsDragging(false);
      if (phase !== "idle") {
        return;
      }
      if (offset.current > 0 && offset.current >= travel() * CONFIRM_AT) {
        void confirm();
      } else if (offset.current > 0) {
        glide(0);
      }
    },
  });

  const { buttonProps } = useButton(
    {
      elementType: "div",
      "aria-label": label,
      isDisabled: phase !== "idle",
      onPress(event) {
        // A pointer confirms only by sliding. Releasing after a drag must not count as a press.
        if (event.pointerType === "keyboard" || event.pointerType === "virtual") {
          void confirm();
        }
      },
    },
    thumb,
  );

  return (
    <div ref={track} className="ag-slide-confirm" data-phase={phase}>
      <span aria-hidden className="ag-slide-confirm__rail">
        <span ref={fill} className="ag-slide-confirm__fill" />
      </span>
      <span ref={hint} aria-hidden className="ag-slide-confirm__label">
        {phase === "idle" ? (
          <Text as="span" color="muted" truncate>
            {label}
          </Text>
        ) : null}
      </span>
      <span aria-live="polite" className="ag-slide-confirm__label">
        {phase === "pending" ? <Shimmer>{pendingLabel}</Shimmer> : null}
        {phase === "done" ? (
          <Text as="span" truncate>
            {doneLabel}
          </Text>
        ) : null}
      </span>
      <div
        {...mergeProps(buttonProps, moveProps)}
        ref={thumb}
        className="ag-slide-confirm__thumb"
        data-dragging={isDragging || undefined}
      >
        {phase === "pending" ? <Spinner color="current" size="sm" /> : null}
        {phase === "done" ? <Check /> : null}
        {phase === "idle" ? <ArrowRight /> : null}
      </div>
    </div>
  );
}

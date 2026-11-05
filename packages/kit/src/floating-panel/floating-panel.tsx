"use client";

import { Pin, PinFill, Xmark } from "@gravity-ui/icons";
import { useIsSSR } from "@react-aria/ssr";
import { useExitAnimation } from "@react-aria/utils";
import { useId, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import { FocusScope, useMove, useOverlay } from "react-aria";
import { Button } from "../button/button.tsx";
import { Text } from "../text/text.tsx";
import { TextSwap } from "../text-swap/text-swap.tsx";
import { durations, easings, widths } from "../tokens.ts";
import { clampToViewport, placeAtAnchor, type Point } from "./placement.ts";

const KEYBOARD_STEP = 16;

export interface FloatingPanelProps {
  /** Heading and drag handle. A change flows in place, so a pinned panel can follow the page. */
  title: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  /** The button that opens the panel. An unpinned panel stands next to it. */
  triggerRef: RefObject<HTMLElement | null>;
  pinLabel: string;
  unpinLabel: string;
  /** Spoken on the handle. Arrow keys move the panel as well. */
  moveLabel: string;
  closeLabel: string;
  children: ReactNode;
}

const viewportSize = () => ({
  width: document.documentElement.clientWidth,
  height: document.documentElement.clientHeight,
});

/**
 * A popover that can stay. Next to its trigger it closes like any popover. Pinned, or
 * once dragged, it stays on screen while the page keeps working, and remembers its place.
 */
export function FloatingPanel({
  title,
  isOpen,
  onOpenChange,
  triggerRef,
  pinLabel,
  unpinLabel,
  moveLabel,
  closeLabel,
  children,
}: FloatingPanelProps) {
  const panel = useRef<HTMLDialogElement>(null);
  const surface = useRef<HTMLDivElement>(null);
  const point = useRef<Point>({ x: 0, y: 0 });
  /** Follows the pointer past the screen edge, so the panel meets it again on the way back. */
  const pointer = useRef<Point>({ x: 0, y: 0 });
  const returningFrom = useRef<string | null>(null);
  const titleId = useId();
  const isSSR = useIsSSR();
  const [isPinned, setIsPinned] = useState(false);
  const isExiting = useExitAnimation(surface, isOpen);
  const isRendered = isOpen || isExiting;

  // Written to the element directly: a drag must not re-render whatever the panel holds.
  function moveTo(next: Point) {
    point.current = next;
    if (panel.current) {
      panel.current.style.transform = `translate3d(${next.x}px, ${next.y}px, 0)`;
    }
  }

  useLayoutEffect(() => {
    const element = panel.current;
    if (!isRendered || !element) {
      return;
    }

    function settle() {
      const size = { width: element!.offsetWidth, height: element!.offsetHeight };
      const trigger = triggerRef.current?.getBoundingClientRect();
      moveTo(
        !isPinned && trigger
          ? placeAtAnchor(trigger, size, viewportSize())
          : clampToViewport(point.current, size, viewportSize()),
      );
    }

    settle();
    if (returningFrom.current && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.animate(
        { transform: [returningFrom.current, element.style.transform] },
        { duration: Number.parseInt(durations.slow), easing: easings.standard },
      );
    }
    returningFrom.current = null;

    const observer = new ResizeObserver(settle);
    observer.observe(element);
    addEventListener("resize", settle);
    addEventListener("scroll", settle, { capture: true, passive: true });

    return () => {
      observer.disconnect();
      removeEventListener("resize", settle);
      removeEventListener("scroll", settle, { capture: true });
    };
  }, [isRendered, isPinned, triggerRef]);

  const { overlayProps } = useOverlay(
    {
      isOpen: isOpen && !isPinned,
      isDismissable: true,
      shouldCloseOnInteractOutside: (element) => !triggerRef.current?.contains(element),
      onClose: () => onOpenChange(false),
    },
    panel,
  );

  const { moveProps } = useMove({
    onMoveStart: () => {
      setIsPinned(true);
      pointer.current = point.current;
      panel.current?.getAnimations().forEach((animation) => animation.cancel());
      panel.current?.setAttribute("data-dragging", "");
    },
    onMove: ({ deltaX, deltaY, pointerType }) => {
      const step = pointerType === "keyboard" ? KEYBOARD_STEP : 1;
      const { x, y } = pointer.current;
      pointer.current = { x: x + deltaX * step, y: y + deltaY * step };
      if (panel.current) {
        const size = { width: panel.current.offsetWidth, height: panel.current.offsetHeight };
        moveTo(clampToViewport(pointer.current, size, viewportSize()));
      }
    },
    onMoveEnd: () => panel.current?.removeAttribute("data-dragging"),
  });

  function togglePin() {
    returningFrom.current = isPinned ? (panel.current?.style.transform ?? null) : null;
    setIsPinned(!isPinned);
  }

  if (isSSR || !isRendered) {
    return null;
  }

  return createPortal(
    <dialog
      {...overlayProps}
      open
      ref={panel}
      aria-labelledby={titleId}
      className="ag-floating"
      style={{ width: `min(${widths.panel}px, 100vw - 16px)` }}
    >
      <FocusScope restoreFocus autoFocus={!isPinned}>
        <div ref={surface} className="ag-floating__surface" data-exiting={isExiting || undefined}>
          <div className="ag-floating__header">
            <button
              {...moveProps}
              aria-label={moveLabel}
              className="ag-floating__handle"
              type="button"
            >
              <Text as="span" id={titleId} variant="title" truncate>
                <TextSwap text={title} />
              </Text>
            </button>
            <Button
              isIconOnly
              aria-label={isPinned ? unpinLabel : pinLabel}
              aria-pressed={isPinned}
              size="sm"
              variant="ghost"
              onPress={togglePin}
            >
              {isPinned ? <PinFill /> : <Pin />}
            </Button>
            <Button
              isIconOnly
              aria-label={closeLabel}
              size="sm"
              variant="ghost"
              onPress={() => onOpenChange(false)}
            >
              <Xmark />
            </Button>
          </div>
          <div className="ag-floating__body">{children}</div>
        </div>
      </FocusScope>
    </dialog>,
    document.body,
  );
}

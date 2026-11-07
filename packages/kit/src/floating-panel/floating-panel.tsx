"use client";

import { Pin, PinFill, Xmark } from "@gravity-ui/icons";
import { useIsSSR } from "@react-aria/ssr";
import { useExitAnimation } from "@react-aria/utils";
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { FocusScope, useMove, useOverlay } from "react-aria";
import { Button } from "../button/button.tsx";
import { Text } from "../text/text.tsx";
import { durations, easings, widths } from "../tokens.ts";
import {
  cascadePoint,
  clampSize,
  clampToViewport,
  placeAtAnchor,
  type Point,
  type Size,
} from "./placement.ts";

const KEYBOARD_STEP = 16;
const MIN_SIZE: Size = { width: widths.panel, height: 320 };

let nextCascadeSlot = 0;
let topLayer = 0;

interface FloatingPanelBaseProps {
  /** Heading and drag handle. A change flows in place, so a pinned panel can follow the page. */
  title: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  /** The exit animation has finished, so the panel can leave the page. */
  onExited?: () => void;
  /** Spoken on the handle. Arrow keys move the panel as well. */
  moveLabel: string;
  closeLabel: string;
  /** Adds handles on the right, the bottom and the corner. Arrow keys work on the corner. */
  resize?: { label: string; defaultSize: Size };
  /** The content brings its own bottom edge, such as the docked footer of `Conversation`. */
  isBodyFlush?: boolean;
  children: ReactNode;
}

interface AnchoredPanelProps {
  /** The button that opens the panel. An unpinned panel stands next to it. */
  triggerRef: RefObject<HTMLElement | null>;
  pinLabel: string;
  unpinLabel: string;
}

/** Without a trigger the panel stands on its own, and several of them cascade. */
interface StandingPanelProps {
  triggerRef?: undefined;
  pinLabel?: undefined;
  unpinLabel?: undefined;
}

export type FloatingPanelProps = FloatingPanelBaseProps & (AnchoredPanelProps | StandingPanelProps);

const viewportSize = () => ({
  width: document.documentElement.clientWidth,
  height: document.documentElement.clientHeight,
});

/** One stacking context: panels can trade places forever without climbing over a modal. */
function floatingLayer() {
  const existing = document.querySelector(".ag-floating-layer");
  if (existing) {
    return existing;
  }
  const layer = document.createElement("div");
  layer.className = "ag-floating-layer";
  document.body.append(layer);
  return layer;
}

const RESIZE_EDGES = ["east", "south", "corner"] as const;

interface ResizeHandleProps {
  edge: (typeof RESIZE_EDGES)[number];
  label: string;
  onStart: () => void;
  onResize: (deltaX: number, deltaY: number) => void;
  onEnd: () => void;
}

function ResizeHandle({ edge, label, onStart, onResize, onEnd }: ResizeHandleProps) {
  const { moveProps } = useMove({
    onMoveStart: onStart,
    onMove: ({ deltaX, deltaY, pointerType }) => {
      const step = pointerType === "keyboard" ? KEYBOARD_STEP : 1;
      onResize(edge === "south" ? 0 : deltaX * step, edge === "east" ? 0 : deltaY * step);
    },
    onMoveEnd: onEnd,
  });
  const isCorner = edge === "corner";

  return (
    <button
      {...moveProps}
      aria-hidden={isCorner ? undefined : true}
      aria-label={isCorner ? label : undefined}
      className={`ag-floating__resize ag-floating__resize--${edge}`}
      tabIndex={isCorner ? undefined : -1}
      type="button"
    />
  );
}

/**
 * A popover that can stay. Next to its trigger it closes like any popover. Pinned, or
 * once dragged, it stays on screen while the page keeps working, and remembers its place.
 * With no trigger it stays from the start, so a page can keep several of them open.
 */
export function FloatingPanel({
  title,
  isOpen,
  onOpenChange,
  onExited,
  triggerRef,
  pinLabel,
  unpinLabel,
  moveLabel,
  closeLabel,
  resize,
  isBodyFlush = false,
  children,
}: FloatingPanelProps) {
  const panel = useRef<HTMLDialogElement>(null);
  const surface = useRef<HTMLDivElement>(null);
  const point = useRef<Point>({ x: 0, y: 0 });
  /** Follows the pointer past the screen edge, so the panel meets it again on the way back. */
  const pointer = useRef<Point>({ x: 0, y: 0 });
  const size = useRef(resize?.defaultSize);
  /** The same for size: it keeps counting past the smallest and the largest. */
  const pointerSize = useRef<Size>({ width: 0, height: 0 });
  const returningFrom = useRef<string | null>(null);
  const isCascaded = useRef(false);
  const wasRendered = useRef(false);
  const titleId = useId();
  const isSSR = useIsSSR();
  const [isPinned, setIsPinned] = useState(!triggerRef);
  const isExiting = useExitAnimation(surface, isOpen);
  const isRendered = isOpen || isExiting;

  // Written to the element directly: a drag must not re-render whatever the panel holds.
  function moveTo(next: Point) {
    point.current = next;
    if (panel.current) {
      panel.current.style.transform = `translate3d(${next.x}px, ${next.y}px, 0)`;
    }
  }

  function applySize(next: Size) {
    size.current = next;
    if (panel.current && surface.current) {
      panel.current.style.width = `min(${next.width}px, 100vw - 16px)`;
      surface.current.style.height = `${next.height}px`;
    }
  }

  function raise() {
    topLayer += 1;
    if (panel.current) {
      panel.current.style.zIndex = String(topLayer);
    }
  }

  useLayoutEffect(() => {
    const element = panel.current;
    if (!isRendered || !element) {
      return;
    }

    function settle() {
      const box = { width: element!.offsetWidth, height: element!.offsetHeight };
      const trigger = triggerRef?.current?.getBoundingClientRect();
      if (!isPinned && trigger) {
        moveTo(placeAtAnchor(trigger, box, viewportSize()));
      } else if (!triggerRef && !isCascaded.current) {
        isCascaded.current = true;
        moveTo(cascadePoint(nextCascadeSlot, box, viewportSize()));
        nextCascadeSlot += 1;
      } else {
        moveTo(clampToViewport(point.current, box, viewportSize()));
      }
    }

    if (size.current) {
      applySize(size.current);
    }
    raise();
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

  useEffect(() => {
    if (wasRendered.current && !isRendered) {
      onExited?.();
    }
    wasRendered.current = isRendered;
  }, [isRendered, onExited]);

  const { overlayProps } = useOverlay(
    {
      isOpen: isOpen && !isPinned,
      isDismissable: true,
      shouldCloseOnInteractOutside: (element) => !triggerRef?.current?.contains(element),
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
        const box = { width: panel.current.offsetWidth, height: panel.current.offsetHeight };
        moveTo(clampToViewport(pointer.current, box, viewportSize()));
      }
    },
    onMoveEnd: () => panel.current?.removeAttribute("data-dragging"),
  });

  function startResize() {
    setIsPinned(true);
    panel.current?.getAnimations().forEach((animation) => animation.cancel());
    panel.current?.setAttribute("data-resizing", "");
    pointerSize.current = {
      width: panel.current?.offsetWidth ?? 0,
      height: surface.current?.offsetHeight ?? 0,
    };
  }

  function resizeBy(deltaX: number, deltaY: number) {
    pointerSize.current = {
      width: pointerSize.current.width + deltaX,
      height: pointerSize.current.height + deltaY,
    };
    applySize(clampSize(pointerSize.current, MIN_SIZE, point.current, viewportSize()));
  }

  function endResize() {
    panel.current?.removeAttribute("data-resizing");
  }

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
      onFocusCapture={raise}
      onPointerDownCapture={raise}
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
                {title}
              </Text>
            </button>
            {triggerRef ? (
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
            ) : null}
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
          <div className="ag-floating__body" data-flush={isBodyFlush || undefined}>
            {children}
          </div>
        </div>
        {resize
          ? RESIZE_EDGES.map((edge) => (
              <ResizeHandle
                key={edge}
                edge={edge}
                label={resize.label}
                onEnd={endResize}
                onResize={resizeBy}
                onStart={startResize}
              />
            ))
          : null}
      </FocusScope>
    </dialog>,
    floatingLayer(),
  );
}

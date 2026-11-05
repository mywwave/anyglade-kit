"use client";

import { ArrowDown } from "@gravity-ui/icons";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Box } from "../box/box.tsx";
import { Button } from "../button/button.tsx";

const AT_END_DISTANCE = 8;
const FOLLOW_SHARE = 0.16;

function findScroller(element: HTMLElement | null) {
  for (let node = element?.parentElement; node; node = node.parentElement) {
    if (/auto|scroll/.test(getComputedStyle(node).overflowY)) {
      return node;
    }
  }
  return document.documentElement;
}

export interface ConversationProps {
  label: string;
  scrollLabel: string;
  /** One `ConversationTurn` per question and answer. */
  children: ReactNode;
  /**
   * Usually `PromptComposer`. It stays at the bottom of the page while the page scrolls.
   * Leave no padding under the conversation, or the footer shifts by that much as it docks.
   */
  footer: ReactNode;
  /** Id of the latest turn. When it changes, the view moves to that turn. */
  followKey?: string;
  /** Height of whatever is stuck to the top of the page, in pixels. */
  topInset?: number;
}

/** A turn takes the whole view, so the answer grows into free space. */
export function ConversationTurn({ children }: { children: ReactNode }) {
  return <div className="ag-turn">{children}</div>;
}

/**
 * The page scrolls, not the chat. A new question moves to the top and the answer grows
 * below it. Only when it reaches the footer does the page ease after it, and a reader
 * who scrolls up keeps the view until they return to the end.
 */
export function Conversation({
  label,
  scrollLabel,
  children,
  footer,
  followKey,
  topInset = 0,
}: ConversationProps) {
  const root = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const footerBox = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLElement | null>(null);
  const isFollowing = useRef(true);
  const frame = useRef(0);
  const [isAtEnd, setIsAtEnd] = useState(true);

  function follow() {
    cancelAnimationFrame(frame.current);
    const isInstant = matchMedia("(prefers-reduced-motion: reduce)").matches;

    function step() {
      const element = scroller.current;
      if (!element || !isFollowing.current) {
        return;
      }
      const distance = element.scrollHeight - element.scrollTop - element.clientHeight;
      if (distance >= 1) {
        element.scrollTop += isInstant ? distance : Math.max(1, Math.ceil(distance * FOLLOW_SHARE));
        frame.current = requestAnimationFrame(step);
      }
    }
    step();
  }

  useEffect(() => {
    const element = findScroller(root.current);
    const target = element === document.documentElement ? window : element;
    scroller.current = element;
    let lastTop = element.scrollTop;
    let lastHeight = element.scrollHeight;

    function measure() {
      const room = element.clientHeight - topInset - (footerBox.current?.offsetHeight ?? 0);
      root.current?.style.setProperty("--ag-conversation-room", `${room}px`);
    }

    function updateEnd() {
      const { scrollTop, scrollHeight, clientHeight } = element;
      const isNearEnd = scrollHeight - scrollTop - clientHeight < AT_END_DISTANCE;
      if (isNearEnd) {
        isFollowing.current = true;
      } else if (scrollTop < lastTop && scrollHeight >= lastHeight) {
        isFollowing.current = false;
      }
      lastTop = scrollTop;
      lastHeight = scrollHeight;
      setIsAtEnd(isNearEnd);
    }

    function update() {
      measure();
      updateEnd();
      if (isFollowing.current) {
        follow();
      }
    }

    const observer = new ResizeObserver(update);
    for (const box of [content.current, footerBox.current, element]) {
      if (box) {
        observer.observe(box);
      }
    }
    update();
    target.addEventListener("scroll", updateEnd, { passive: true });
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame.current);
      target.removeEventListener("scroll", updateEnd);
    };
  }, [topInset]);

  useEffect(() => {
    if (followKey !== undefined) {
      isFollowing.current = true;
      follow();
    }
  }, [followKey]);

  function scrollToEnd() {
    isFollowing.current = true;
    follow();
  }

  return (
    <Box ref={root} flexDirection="column" flexGrow={1} width="100%" minWidth={0}>
      <Box
        ref={content}
        aria-label={label}
        aria-live="polite"
        flexDirection="column"
        flexGrow={1}
        gap="2xl"
        minWidth={0}
        role="log"
      >
        {children}
      </Box>
      <Box
        ref={footerBox}
        position="sticky"
        bottom={0}
        flexDirection="column"
        paddingVertical="l"
        backgroundColor="background-panel"
      >
        {isAtEnd ? null : (
          <Box position="absolute" top={-40} left="50%" motion="fade">
            <Button
              isIconOnly
              aria-label={scrollLabel}
              className="-translate-x-1/2"
              size="sm"
              variant="secondary"
              onPress={scrollToEnd}
            >
              <ArrowDown />
            </Button>
          </Box>
        )}
        {footer}
      </Box>
    </Box>
  );
}

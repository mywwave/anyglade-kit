"use client";

import { ArrowDown } from "@gravity-ui/icons";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Box } from "../box/box.tsx";
import { spacing } from "../tokens.ts";
import { Button } from "../button/button.tsx";
import { CountBadge } from "../count-badge/count-badge.tsx";
import { Text } from "../text/text.tsx";

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
  /** Id of the latest turn. When it changes, the view eases there. On mount it jumps. */
  followKey?: string;
  /** Height of whatever is stuck to the top of the page, in pixels. */
  topInset?: number;
  /**
   * For a pane or a window with a height of its own: the messages scroll in their own box
   * and the footer stands under it, outside the scrolling, so new content cannot move it.
   * Only `followKey` scrolls here. What others write stays below, behind the scroll button.
   */
  isContained?: boolean;
  /** Called every time the end is in view: whatever is there has now been seen. */
  onReachEnd?: () => void;
  /** Messages waiting below. The scroll button shows the number. */
  newCount?: number;
}

/** Stands before the first unread message. A contained chat opens here, not at the end. */
export function ConversationNewMark({ label }: { label: string }) {
  return (
    <div data-conversation-new>
      <Text variant="caption" color="muted" align="center">
        {label}
      </Text>
    </div>
  );
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
  isContained = false,
  onReachEnd,
  newCount = 0,
}: ConversationProps) {
  const root = useRef<HTMLDivElement>(null);
  const ownScroller = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const footerBox = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLElement | null>(null);
  const isFollowing = useRef(true);
  const isEasing = useRef(false);
  const frame = useRef(0);
  const hasFollowed = useRef(false);
  const lastFollowKey = useRef(followKey);
  const reachEnd = useRef(onReachEnd);
  const [isAtEnd, setIsAtEnd] = useState(true);

  useLayoutEffect(() => {
    reachEnd.current = onReachEnd;
  }, [onReachEnd]);

  function follow() {
    cancelAnimationFrame(frame.current);
    const isInstant = matchMedia("(prefers-reduced-motion: reduce)").matches;
    isEasing.current = true;

    function step() {
      const element = scroller.current;
      if (!element || !isFollowing.current) {
        isEasing.current = false;
        return;
      }
      const distance = element.scrollHeight - element.scrollTop - element.clientHeight;
      if (distance >= 1) {
        element.scrollTop += isInstant ? distance : Math.max(1, Math.ceil(distance * FOLLOW_SHARE));
        frame.current = requestAnimationFrame(step);
      } else {
        isEasing.current = false;
      }
    }
    step();
  }

  // Layout effects: they must run before the observer below reports the new height.
  useLayoutEffect(() => {
    const element = ownScroller.current ?? findScroller(root.current);
    const target = element === document.documentElement ? window : element;
    scroller.current = element;
    let lastTop = element.scrollTop;
    let lastHeight = element.scrollHeight;
    let lastViewHeight = element.clientHeight;

    function measure() {
      const room = element.clientHeight - topInset - (footerBox.current?.offsetHeight ?? 0);
      root.current?.style.setProperty("--ag-conversation-room", `${room}px`);
    }

    function updateEnd() {
      const { scrollTop, scrollHeight, clientHeight } = element;
      const isNearEnd = scrollHeight - scrollTop - clientHeight < AT_END_DISTANCE;
      if (isNearEnd) {
        isFollowing.current = true;
        reachEnd.current?.();
      } else if (
        (isContained && !isEasing.current) ||
        (scrollTop < lastTop && scrollHeight >= lastHeight)
      ) {
        isFollowing.current = false;
      }
      lastTop = scrollTop;
      lastHeight = scrollHeight;
      // Content grows a few frames before the easing catches up, and that is not leaving the end.
      setIsAtEnd(isFollowing.current);
    }

    function update() {
      measure();
      // A taller field keeps the end in view. In a contained chat new content does not move it.
      const isViewResized = element.clientHeight !== lastViewHeight;
      lastViewHeight = element.clientHeight;
      if (isFollowing.current && isViewResized) {
        follow();
      }
      updateEnd();
      if (isFollowing.current && !isContained) {
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
  }, [topInset, isContained]);

  useLayoutEffect(() => {
    if (!hasFollowed.current) {
      hasFollowed.current = true;
      const element = scroller.current;
      const mark = isContained ? content.current?.querySelector("[data-conversation-new]") : null;
      if (element && mark) {
        const gap = Number.parseInt(spacing.l);
        element.scrollTop +=
          mark.getBoundingClientRect().top - element.getBoundingClientRect().top - gap;
        isFollowing.current = false;
        setIsAtEnd(false);
      } else if (element && (followKey !== undefined || isContained)) {
        element.scrollTop = element.scrollHeight;
        isFollowing.current = true;
        setIsAtEnd(true);
      }
    } else if (followKey !== undefined && followKey !== lastFollowKey.current) {
      isFollowing.current = true;
      follow();
    }
    lastFollowKey.current = followKey;
  }, [followKey, isContained]);

  function scrollToEnd() {
    isFollowing.current = true;
    follow();
  }

  const log = (
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
  );
  const scrollButton = isAtEnd ? null : (
    <Box
      position="absolute"
      top={isContained ? undefined : -40}
      bottom={isContained ? 8 : undefined}
      left="50%"
      motion="fade"
    >
      <span className="ag-conversation__jump">
        <Button
          isIconOnly
          aria-label={newCount > 0 ? `${scrollLabel}: ${newCount}` : scrollLabel}
          size="sm"
          variant="secondary"
          onPress={scrollToEnd}
        >
          <ArrowDown />
        </Button>
        {newCount > 0 ? (
          <span aria-hidden className="ag-conversation__count">
            <CountBadge count={newCount} />
          </span>
        ) : null}
      </span>
    </Box>
  );

  if (isContained) {
    return (
      <div ref={root} className="ag-conversation">
        <div className="ag-conversation__view">
          <div ref={ownScroller} className="ag-conversation__scroller">
            {log}
          </div>
          {scrollButton}
        </div>
        <div ref={footerBox} className="ag-conversation__footer">
          {footer}
        </div>
      </div>
    );
  }

  return (
    <Box ref={root} flexDirection="column" flexGrow={1} width="100%" minWidth={0}>
      {log}
      <Box
        ref={footerBox}
        position="sticky"
        bottom={0}
        flexDirection="column"
        paddingVertical="l"
        backgroundColor="background-panel"
      >
        {scrollButton}
        {footer}
      </Box>
    </Box>
  );
}

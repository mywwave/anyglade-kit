import { Box, Button, Text, TextSwap, tokens, type BoxProps } from "@anyglade/kit";
import { Check, ChevronLeft, ChevronRight } from "@anyglade/kit/icons";
import { useLayoutEffect, useRef, useState, type PointerEvent } from "react";

type Surface = "inverse" | "emphasis" | "panel";

interface Card {
  id: string;
  name: string;
  last: string;
  holder: string;
  expires: string;
  network: string;
  surface: Surface;
}

const CARDS: readonly Card[] = [
  {
    id: "salary",
    name: "Зарплатная",
    last: "4417",
    holder: "VERA SOKOLOVA",
    expires: "12/29",
    network: "МИР",
    surface: "inverse",
  },
  {
    id: "business",
    name: "Бизнес",
    last: "1185",
    holder: "VERA SOKOLOVA",
    expires: "10/28",
    network: "МИР",
    surface: "emphasis",
  },
  {
    id: "credit",
    name: "Кредитная",
    last: "9032",
    holder: "VERA SOKOLOVA",
    expires: "11/30",
    network: "VISA",
    surface: "panel",
  },
];

interface SurfaceStyle extends Pick<BoxProps, "backgroundColor" | "color"> {
  /** The chip is a metal plate: a step away from the card in either theme. */
  chip: string;
  /** Lines of the chip contacts, cut through to the card colour. */
  engraving: string;
}

const FALLBACK = CARDS[0] as Card;

const SURFACES: Record<Surface, SurfaceStyle> = {
  inverse: {
    backgroundColor: "background-inverse",
    color: "text-inverse",
    chip: "var(--ag-background-emphasis)",
    engraving: "var(--ag-background-inverse)",
  },
  emphasis: {
    backgroundColor: "background-emphasis",
    color: "text-primary",
    chip: "var(--ag-border-primary)",
    engraving: "var(--ag-background-emphasis)",
  },
  panel: {
    backgroundColor: "background-panel",
    color: "text-primary",
    chip: "var(--ag-background-emphasis)",
    engraving: "var(--ag-background-panel)",
  },
};

const ms = (value: string) => Number.parseFloat(value);
const SETTLE = { duration: ms(tokens.durations.slow), easing: tokens.easings.standard };
const LEAVE = { duration: ms(tokens.durations.base), easing: tokens.easings.accelerate };
const THROW = { duration: ms(tokens.durations.base), easing: tokens.easings.decelerate };
const LAND = { duration: ms(tokens.durations.slow), easing: tokens.easings.decelerate };
const SPRING = { duration: ms(tokens.durations.slower), easing: tokens.easings.standard };

/** Share of the card width past which letting go throws the card instead of springing back. */
const THROW_AT = 0.32;
/** A quick flick throws the card even if it travelled less, in pixels per millisecond. */
const FLICK_SPEED = 0.5;

const isReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Where a card rests at a depth. Fractional depths are in-between poses,
 * so the card below can rise while the top one is being pulled away.
 * Cards further back are smaller and peek out above the front one.
 */
function pose(depth: number, isFanned: boolean, height: number) {
  const step = isFanned ? 18 : 12;
  const scale = 1 - depth * 0.06;
  const y = -depth * step - ((1 - scale) * height) / 2;
  const x = isFanned ? -depth * 8 : 0;
  const rotate = isFanned ? -depth * 2 : 0;
  return `translate(${x}px, ${y}px) rotate(${rotate}deg) scale(${scale})`;
}

/** Off the stage to one side, far enough to clear the stack before it changes layer. */
function offstage(direction: number, width: number) {
  return `translate(${direction * width * 1.2}px, -8px) rotate(${direction * 16}deg) scale(1)`;
}

/** Starts the move from wherever the card is now, even in the middle of another move. */
function moveTo(element: HTMLElement, to: string, timing: KeyframeAnimationOptions | null) {
  const from = getComputedStyle(element).transform;
  for (const animation of element.getAnimations()) {
    animation.cancel();
  }
  element.style.transform = to;
  if (!timing || isReducedMotion() || from === "none") {
    return null;
  }
  return element.animate([{ transform: from }, { transform: to }], timing);
}

function Chip({ surface }: { surface: SurfaceStyle }) {
  return (
    <svg aria-hidden fill="none" height="26" viewBox="0 0 34 26" width="34">
      <rect fill={surface.chip} height="25" rx="5" width="33" x="0.5" y="0.5" />
      <path
        d="M0.5 9.5H12M0.5 16.5H12M22 9.5H33.5M22 16.5H33.5M12 0.5V25.5M22 0.5V25.5M12 13H22"
        stroke={surface.engraving}
        strokeWidth="1.2"
      />
    </svg>
  );
}

function Contactless() {
  return (
    <svg
      aria-hidden
      fill="none"
      height="20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      width="20"
    >
      <path d="M6 9.5A4 4 0 0 1 6 14.5" />
      <path d="M9.5 7A7 7 0 0 1 9.5 17" />
      <path d="M13 4.5A10.5 10.5 0 0 1 13 19.5" />
      <path d="M16.5 2A14 14 0 0 1 16.5 22" />
    </svg>
  );
}

function CardFace({ card, isPrimary }: { card: Card; isPrimary: boolean }) {
  const surface = SURFACES[card.surface];
  return (
    <>
      <Box alignItems="center" justifyContent="between" gap="s">
        <Text variant="label">{card.name}</Text>
        {isPrimary ? (
          <Box alignItems="center" gap="xs" motion="pop">
            <Check height={12} width={12} />
            <Text variant="label">Основная</Text>
          </Box>
        ) : null}
      </Box>
      <Box flexDirection="column" gap="s">
        <Box alignItems="center" gap="s">
          <Chip surface={surface} />
          <Contactless />
        </Box>
        <Text as="p" variant="heading-xxs" monospace tabularNums>
          •• {card.last}
        </Text>
      </Box>
      <Box alignItems="end" justifyContent="between" gap="m">
        <Box gap="m">
          <Text variant="caption">{card.holder}</Text>
          <Text variant="caption" tabularNums>
            {card.expires}
          </Text>
        </Box>
        <Text as="p" variant="heading-xxs" weight="semibold">
          {card.network}
        </Text>
      </Box>
    </>
  );
}

interface Drag {
  id: string;
  pointerId: number;
  startX: number;
  startY: number;
  dx: number;
  dy: number;
  lastX: number;
  lastTime: number;
  velocity: number;
  isPastThreshold: boolean;
}

export function CardStackBlock() {
  const [order, setOrder] = useState(() => CARDS.map((card) => card.id));
  const [primaryId, setPrimaryId] = useState("salary");
  const [isFanned, setIsFanned] = useState(false);
  const elements = useRef(new Map<string, HTMLDivElement>());
  const drag = useRef<Drag | null>(null);
  const isBusy = useRef(false);
  /** The card that changes layer lands with its own timing, the rest settle. */
  const landing = useRef<{ id: string; timing: KeyframeAnimationOptions } | null>(null);
  const hasPlaced = useRef(false);

  const card = (id: string | undefined) => CARDS.find((item) => item.id === id) ?? FALLBACK;
  const front = card(order[0]);
  const primary = card(primaryId);

  useLayoutEffect(() => {
    order.forEach((id, depth) => {
      const element = elements.current.get(id);
      if (!element || drag.current?.id === id) {
        return;
      }
      const target = pose(depth, isFanned, element.offsetHeight);
      if (!hasPlaced.current) {
        element.style.transform = target;
        return;
      }
      if (element.style.transform === target) {
        return;
      }
      const isLanding = landing.current?.id === id;
      moveTo(element, target, isLanding ? (landing.current?.timing ?? LAND) : SETTLE);
    });
    hasPlaced.current = true;
    landing.current = null;
  }, [order, isFanned]);

  /** Sends the front card off to one side and tucks it in at the back. */
  function sendToBack(direction: number, timing: KeyframeAnimationOptions) {
    const [first, ...rest] = order;
    const element = first ? elements.current.get(first) : undefined;
    if (!first || !element || isBusy.current) {
      return;
    }
    isBusy.current = true;
    for (const [depth, id] of rest.entries()) {
      const below = elements.current.get(id);
      if (below) {
        moveTo(below, pose(depth, isFanned, below.offsetHeight), SETTLE);
      }
    }
    const finish = () => {
      landing.current = { id: first, timing: LAND };
      setOrder([...rest, first]);
      isBusy.current = false;
    };
    const flight = moveTo(element, offstage(direction, element.offsetWidth), timing);
    if (flight) {
      void flight.finished.then(finish, finish);
    } else {
      finish();
    }
  }

  /** Pulls the back card out to one side and lays it on top. */
  function bringFromBack(direction: number) {
    const current = order;
    const last = current.at(-1);
    const element = last ? elements.current.get(last) : undefined;
    if (!last || !element || isBusy.current) {
      return;
    }
    isBusy.current = true;
    const finish = () => {
      landing.current = { id: last, timing: LAND };
      setOrder([last, ...current.slice(0, -1)]);
      isBusy.current = false;
    };
    const flight = moveTo(element, offstage(direction, element.offsetWidth), LEAVE);
    if (flight) {
      void flight.finished.then(finish, finish);
    } else {
      finish();
    }
  }

  function bringForward(id: string) {
    const depth = order.indexOf(id);
    if (depth === 1) {
      sendToBack(-1, LEAVE);
    } else if (depth === order.length - 1) {
      bringFromBack(-1);
    }
  }

  function grab(event: PointerEvent<HTMLDivElement>, id: string) {
    if (event.button !== 0 || isBusy.current || order[0] !== id) {
      return;
    }
    const element = event.currentTarget;
    element.setPointerCapture(event.pointerId);
    const now = getComputedStyle(element).transform;
    for (const animation of element.getAnimations()) {
      animation.cancel();
    }
    element.style.transform = now;
    drag.current = {
      id,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      dx: 0,
      dy: 0,
      lastX: event.clientX,
      lastTime: event.timeStamp,
      velocity: 0,
      isPastThreshold: false,
    };
  }

  function pull(event: PointerEvent<HTMLDivElement>) {
    const state = drag.current;
    if (!state || state.pointerId !== event.pointerId) {
      return;
    }
    const element = event.currentTarget;
    const elapsed = event.timeStamp - state.lastTime;
    if (elapsed > 0) {
      state.velocity = (event.clientX - state.lastX) / elapsed;
    }
    state.lastX = event.clientX;
    state.lastTime = event.timeStamp;
    state.dx = event.clientX - state.startX;
    state.dy = event.clientY - state.startY;

    // The card turns with the pull, like a card held at its bottom edge.
    element.style.transform = `translate(${state.dx}px, ${state.dy * 0.2}px) rotate(${state.dx * 0.06}deg) scale(1)`;

    const threshold = element.offsetWidth * THROW_AT;
    const progress = Math.min(Math.abs(state.dx) / threshold, 1);
    const isPast = progress >= 1;
    if (isPast && !state.isPastThreshold) {
      navigator.vibrate?.(8);
    }
    state.isPastThreshold = isPast;

    // The cards below rise as the top one leaves, so the next one is ready under the finger.
    for (const [depth, id] of order.entries()) {
      const below = elements.current.get(id);
      if (depth > 0 && below) {
        for (const animation of below.getAnimations()) {
          animation.cancel();
        }
        below.style.transform = pose(depth - progress * 0.7, isFanned, below.offsetHeight);
      }
    }
  }

  function release(event: PointerEvent<HTMLDivElement>) {
    const state = drag.current;
    if (!state || state.pointerId !== event.pointerId) {
      return;
    }
    drag.current = null;
    const element = event.currentTarget;
    const direction = Math.sign(state.dx) || 1;
    const isFlick =
      Math.abs(state.velocity) > FLICK_SPEED &&
      Math.sign(state.velocity) === direction &&
      Math.abs(state.dx) > 16;
    if (state.isPastThreshold || isFlick) {
      sendToBack(direction, THROW);
      return;
    }

    // Short of the threshold the card springs home, overshooting a little against the pull.
    const from = element.style.transform;
    const rest = pose(0, isFanned, element.offsetHeight);
    element.style.transform = rest;
    if (!isReducedMotion() && (state.dx !== 0 || state.dy !== 0)) {
      element.animate(
        [
          { transform: from },
          {
            transform: `translate(${-state.dx * 0.06}px, 0px) rotate(${-state.dx * 0.004}deg) scale(1)`,
            offset: 0.55,
          },
          { transform: rest },
        ],
        SPRING,
      );
    }
    for (const [depth, id] of order.entries()) {
      const below = elements.current.get(id);
      if (depth > 0 && below) {
        moveTo(below, pose(depth, isFanned, below.offsetHeight), SETTLE);
      }
    }
  }

  return (
    <Box
      flexDirection="column"
      alignItems="center"
      gap="l"
      flexGrow={1}
      minWidth={0}
      marginHorizontal="-xl"
      marginTop="-xl"
      paddingHorizontal="xl"
      paddingTop="xl"
      overflow="hidden"
    >
      <Box
        width="100%"
        maxWidth={272}
        paddingTop="2xl"
        userSelect="none"
        onPointerEnter={(event) => event.pointerType === "mouse" && setIsFanned(true)}
        onPointerLeave={(event) => event.pointerType === "mouse" && setIsFanned(false)}
      >
        <Box position="relative" width="100%" aspectRatio="1.586 / 1">
          {CARDS.map((item) => {
            const depth = order.indexOf(item.id);
            const isFront = depth === 0;
            const surface = SURFACES[item.surface];
            return (
              <Box
                key={item.id}
                ref={(element: HTMLDivElement | null) => {
                  if (element) {
                    elements.current.set(item.id, element);
                    // Sideways pulls move the card, vertical swipes still scroll the page.
                    element.style.touchAction = "pan-y";
                  } else {
                    elements.current.delete(item.id);
                  }
                }}
                role={isFront ? "group" : undefined}
                aria-label={isFront ? `${item.name}, ${item.network} •• ${item.last}` : undefined}
                aria-hidden={!isFront}
                position="absolute"
                inset={0}
                flexDirection="column"
                justifyContent="between"
                padding="l"
                borderRadius="l"
                boxShadow={isFront ? "l" : "m"}
                zIndex={CARDS.length - depth}
                cursor={isFront ? "grab" : "pointer"}
                backgroundColor={surface.backgroundColor}
                color={surface.color}
                onClick={isFront ? undefined : () => bringForward(item.id)}
                onPointerCancel={release}
                onPointerDown={(event) => grab(event, item.id)}
                onPointerMove={pull}
                onPointerUp={release}
              >
                <CardFace card={item} isPrimary={item.id === primaryId} />
              </Box>
            );
          })}
        </Box>
      </Box>

      <Box flexDirection="column" alignItems="center" gap="s">
        <Box alignItems="center" gap="xs">
          <Button
            isIconOnly
            aria-label="Предыдущая"
            size="sm"
            variant="ghost"
            onPress={() => bringFromBack(-1)}
          >
            <ChevronLeft />
          </Button>
          <Button
            isDisabled={front.id === primaryId}
            size="sm"
            variant="secondary"
            onPress={() => setPrimaryId(front.id)}
          >
            Сделать основной
          </Button>
          <Button
            isIconOnly
            aria-label="Следующая"
            size="sm"
            variant="ghost"
            onPress={() => sendToBack(-1, LEAVE)}
          >
            <ChevronRight />
          </Button>
        </Box>
        <Text variant="caption" color="muted" tabularNums>
          Списывать с <TextSwap text={`•• ${primary.last}`} />
        </Text>
      </Box>
    </Box>
  );
}

CardStackBlock.displayName = "Карты";

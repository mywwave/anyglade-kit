import { Box, Button, Shimmer, Text, tokens } from "@anyglade/kit";
import { Scissors } from "@anyglade/kit/icons";
import { useLayoutEffect, useRef, useState, type PointerEvent } from "react";
import { simulateRequest } from "../../simulate.ts";
import { formatRubles } from "../format.ts";

interface Line {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  table: number;
  cashier: string;
  card: string;
  lines: readonly Line[];
}

const orders: readonly Order[] = [
  {
    table: 4,
    cashier: "Дарья",
    card: "Карта •• 4417",
    lines: [
      { name: "Эспрессо", quantity: 2, price: 120 },
      { name: "Круассан с миндалём", quantity: 1, price: 260 },
      { name: "Вода «Шишкин лес»", quantity: 1, price: 140 },
    ],
  },
  {
    table: 7,
    cashier: "Дарья",
    card: "Карта •• 1185",
    lines: [
      { name: "Раф лавандовый", quantity: 1, price: 340 },
      { name: "Чизкейк", quantity: 1, price: 390 },
      { name: "Морс клюквенный", quantity: 2, price: 150 },
    ],
  },
  {
    table: 2,
    cashier: "Тимур",
    card: "СБП",
    lines: [
      { name: "Флэт уайт", quantity: 2, price: 290 },
      { name: "Сырники со сметаной", quantity: 1, price: 420 },
      { name: "Чай облепиховый", quantity: 1, price: 310 },
    ],
  },
];

const totalOf = (order: Order) =>
  order.lines.reduce((sum, line) => sum + line.quantity * line.price, 0);

const ms = (duration: string) => Number.parseFloat(duration);
const isReduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value));

const PAPER_WIDTH = 216;
const SLOT_HEIGHT = 12;
const TOOTH = 8;
const TEETH_HEIGHT = 6;
/** The printer always shows a strip of paper: the edge left by the last tear. */
const TONGUE = 4;
/** One line feed of the print head. */
const LINE_FEED = 20;
/** How far the attached paper stretches before it tears off. */
const TEAR_AT = 40;
/** Paper held by the printer gives way slower than the finger. */
const RESISTANCE = 0.5;
/** Pointer speed in px/ms above which a flick counts the same: raw speed spikes between events. */
const MAX_SPEED = 2;
/** How long the speed takes to catch up with the pointer, in ms: smooths the tilt. */
const SPEED_SMOOTHING = 90;

const translateY = (y: number) => `translateY(${y}px)`;
/** The roll behind the receipt shows only the part pulled out of the slot. */
const rollAt = (pull: number) => translateY(pull - TEAR_AT);

const dateFormat = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});
const timeFormat = new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit" });

/** A torn paper edge. The fill is the paper surface token, so it matches the paper in both themes. */
function Teeth({ edge }: { edge: "top" | "bottom" }) {
  const base = edge === "bottom" ? 0 : TEETH_HEIGHT;
  const tip = TEETH_HEIGHT - base;
  const points = Array.from(
    { length: PAPER_WIDTH / TOOTH },
    (_, index) => `L${index * TOOTH + TOOTH / 2} ${tip}L${(index + 1) * TOOTH} ${base}`,
  ).join("");

  return (
    <svg
      aria-hidden
      width={PAPER_WIDTH}
      height={TEETH_HEIGHT}
      viewBox={`0 0 ${PAPER_WIDTH} ${TEETH_HEIGHT}`}
      style={{ display: "block", fill: "var(--ag-background-panel)" }}
    >
      <path d={`M0 ${base}${points}Z`} />
    </svg>
  );
}

/** A QR code drawn from the receipt number: every receipt gets its own pattern. */
function qrPath(seed: number) {
  const size = 21;
  let state = Math.imul(seed, 2_654_435_761) >>> 0 || 1;
  const random = () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4_294_967_296;
  };
  const isFinder = (x: number, y: number) =>
    (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12);

  let path = "";
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (isFinder(x, y)) {
        continue;
      }
      const isTiming = x === 6 || y === 6;
      if (isTiming ? (x + y) % 2 === 0 : random() > 0.5) {
        path += `M${x} ${y}h1v1h-1z`;
      }
    }
  }
  for (const [x, y] of [
    [0, 0],
    [14, 0],
    [0, 14],
  ] as const) {
    path += `M${x} ${y}h7v7h-7zM${x + 1} ${y + 1}v5h5v-5zM${x + 2} ${y + 2}h3v3h-3z`;
  }
  return path;
}

const DOTS = "·".repeat(14);

/** A receipt line: label, dot leader, amount. */
function Leader({ label, amount }: { label: string; amount: string }) {
  return (
    <Box alignItems="baseline" gap="xs" minWidth={0}>
      <Text variant="caption" monospace tabularNums wrap="nowrap">
        {label}
      </Text>
      <Box flex={1} minWidth={0} overflow="hidden" aria-hidden>
        <Text variant="caption" monospace color="subtle" wrap="nowrap">
          {DOTS}
        </Text>
      </Box>
      <Text variant="caption" monospace tabularNums wrap="nowrap">
        {amount}
      </Text>
    </Box>
  );
}

function Pair({ left, right }: { left: string; right: string }) {
  return (
    <Box justifyContent="between" gap="m">
      <Text variant="caption" monospace tabularNums wrap="nowrap">
        {left}
      </Text>
      <Text variant="caption" monospace tabularNums wrap="nowrap">
        {right}
      </Text>
    </Box>
  );
}

function Paper({ order, number, printedAt }: { order: Order; number: number; printedAt: Date }) {
  const total = totalOf(order);

  return (
    <>
      <Box flexDirection="column" alignItems="center">
        <Text variant="title" monospace>
          Кофейня «Зерно»
        </Text>
        <Text variant="caption" monospace color="muted">
          Москва, Покровка, 17
        </Text>
      </Box>
      <Box flexDirection="column">
        <Pair left={dateFormat.format(printedAt)} right={timeFormat.format(printedAt)} />
        <Pair left={`Кассир ${order.cashier}`} right={`Чек № ${number}`} />
      </Box>
      <Box flexDirection="column" gap="xs">
        {order.lines.map((line) => (
          <Box key={line.name} flexDirection="column" minWidth={0}>
            <Text variant="caption" monospace truncate>
              {line.name}
            </Text>
            <Leader
              label={`${line.quantity} × ${formatRubles(line.price)}`}
              amount={formatRubles(line.quantity * line.price)}
            />
          </Box>
        ))}
      </Box>
      <Box flexDirection="column" gap="xs">
        <Leader label="В т. ч. НДС 20 %" amount={formatRubles(Math.round(total / 6))} />
        <Box justifyContent="between" alignItems="baseline" gap="m">
          <Text variant="heading-xxs" monospace>
            ИТОГО
          </Text>
          <Text variant="heading-xxs" monospace tabularNums wrap="nowrap">
            {formatRubles(total)}
          </Text>
        </Box>
      </Box>
      <Box alignItems="center" gap="m">
        <Box flexShrink={0} color="text-primary">
          <svg
            aria-hidden
            width={48}
            height={48}
            viewBox="0 0 21 21"
            shapeRendering="crispEdges"
            fill="currentColor"
            fillRule="evenodd"
          >
            <path d={qrPath(number)} />
          </svg>
        </Box>
        <Box flexDirection="column" minWidth={0}>
          <Text variant="title" monospace>
            Спасибо!
          </Text>
          <Text variant="caption" monospace color="muted" wrap="nowrap">
            {order.card}
          </Text>
          <Text variant="caption" monospace color="muted" wrap="nowrap">
            Столик {order.table}
          </Text>
        </Box>
      </Box>
    </>
  );
}

type Phase = "idle" | "printing" | "printed" | "leaving";

interface Drag {
  pointer: number;
  startX: number;
  startY: number;
  tearX: number;
  tearY: number;
  isTorn: boolean;
  x: number;
  y: number;
  rotate: number;
  lastX: number;
  lastTime: number;
  velocity: number;
}

/** Freezes a running animation where it is, so the next motion starts from there. */
function settle(element: HTMLElement) {
  for (const animation of element.getAnimations()) {
    try {
      animation.commitStyles();
    } catch {
      // The element left the page: there is nothing to keep.
    }
    animation.cancel();
  }
}

export function ReceiptBlock() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [orderIndex, setOrderIndex] = useState(0);
  const [number, setNumber] = useState(4182);
  const [printedAt, setPrintedAt] = useState(() => new Date());
  const [isTorn, setIsTorn] = useState(false);
  const paper = useRef<HTMLDivElement>(null);
  const roll = useRef<HTMLDivElement>(null);
  const led = useRef<HTMLDivElement>(null);
  const drag = useRef<Drag | null>(null);

  const order = orders[orderIndex] ?? orders[0];
  const total = totalOf(order);

  // A finger pulling the paper must not scroll the page.
  useLayoutEffect(() => {
    if (paper.current) {
      paper.current.style.touchAction = "none";
    }
  }, [number]);

  // The print head feeds the paper one line at a time, and the light blinks while it works.
  useLayoutEffect(() => {
    const element = paper.current;
    if (phase !== "printing" || !element) {
      return undefined;
    }
    const light = led.current?.animate([{ opacity: 1 }, { opacity: 0.25 }], {
      duration: ms(tokens.durations.fast),
      direction: "alternate",
      iterations: Number.POSITIVE_INFINITY,
    });

    let animation: Animation;
    if (isReduced()) {
      element.style.transform = translateY(0);
      animation = element.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: ms(tokens.durations.slow),
      });
    } else {
      const from = -(element.offsetHeight - TONGUE);
      const steps = Math.ceil(-from / LINE_FEED);
      const move = ms(tokens.durations.stagger);
      const step = ms(tokens.durations.fast) - move / 3;
      const length = steps * step;
      const keyframes: Keyframe[] = [
        { offset: 0, transform: translateY(from), easing: tokens.easings.decelerate },
      ];
      for (let index = 1; index <= steps; index += 1) {
        const y = Math.min(0, from + index * LINE_FEED);
        keyframes.push({ offset: ((index - 1) * step + move) / length, transform: translateY(y) });
        if (index < steps) {
          keyframes.push({
            offset: (index * step) / length,
            transform: translateY(y),
            easing: tokens.easings.decelerate,
          });
        }
      }
      keyframes.push({ offset: 1, transform: translateY(0) });
      animation = element.animate(keyframes, { duration: length, fill: "forwards" });
    }

    animation.onfinish = () => {
      element.style.transform = translateY(0);
      animation.cancel();
      setPhase("printed");
    };
    return () => {
      animation.onfinish = null;
      animation.cancel();
      light?.cancel();
    };
  }, [phase]);

  // Once printed, the paper dips once: it can be pulled.
  useLayoutEffect(() => {
    const element = paper.current;
    if (phase !== "printed" || !element || isReduced()) {
      return undefined;
    }
    const nudge = element.animate(
      [
        { transform: translateY(0) },
        { transform: translateY(6), offset: 0.35 },
        { transform: translateY(0) },
      ],
      {
        duration: ms(tokens.durations.slower) * 1.5,
        delay: ms(tokens.durations.slow),
        easing: tokens.easings.standard,
      },
    );
    return () => nudge.cancel();
  }, [phase]);

  async function pay() {
    await simulateRequest(1100);
    setPrintedAt(new Date());
    setPhase("printing");
  }

  function nextOrder() {
    setIsTorn(false);
    setNumber((current) => current + 1);
    setOrderIndex((current) => (current + 1) % orders.length);
    setPhase("idle");
  }

  function tear(pull: number) {
    setIsTorn(true);
    navigator.vibrate?.(8);
    const element = roll.current;
    if (element) {
      element.style.transform = rollAt(0);
      element.animate([{ transform: rollAt(pull) }, { transform: rollAt(0) }], {
        duration: ms(tokens.durations.base),
        easing: tokens.easings.decelerate,
      });
    }
  }

  function flyAway(x: number, y: number, rotate: number, velocity: number) {
    const element = paper.current;
    if (!element) {
      nextOrder();
      return;
    }
    setPhase("leaving");
    const from = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
    const direction = velocity === 0 ? Math.sign(rotate) || 1 : Math.sign(velocity);
    const to = isReduced()
      ? from
      : `translate(${x + clamp(velocity * 120, 48)}px, ${y + 160}px) rotate(${rotate + direction * 8}deg)`;
    const animation = element.animate(
      [
        { transform: from, opacity: 1 },
        { transform: to, opacity: 0 },
      ],
      { duration: ms(tokens.durations.slow), easing: tokens.easings.accelerate, fill: "forwards" },
    );
    animation.onfinish = nextOrder;
  }

  /** Keyboard path: the same pull, tear and fall, played by itself. */
  function tearOff() {
    const element = paper.current;
    const rollElement = roll.current;
    if (phase !== "printed" || !element || !rollElement) {
      return;
    }
    settle(element);
    if (isReduced()) {
      flyAway(0, 0, 0, 0);
      return;
    }
    element.style.transformOrigin = "50% 100%";
    const timing = { duration: ms(tokens.durations.base), easing: tokens.easings.standard };
    rollElement.animate([{ transform: rollAt(0) }, { transform: rollAt(TEAR_AT) }], timing);
    const pull = element.animate(
      [{ transform: translateY(0) }, { transform: translateY(TEAR_AT) }],
      timing,
    );
    pull.onfinish = () => {
      tear(TEAR_AT);
      flyAway(0, TEAR_AT, 0, 0);
    };
  }

  function grab(event: PointerEvent<HTMLDivElement>) {
    const element = paper.current;
    if (phase !== "printed" || !element) {
      return;
    }
    settle(element);
    event.currentTarget.setPointerCapture(event.pointerId);
    const rect = element.getBoundingClientRect();
    element.style.transformOrigin = `${event.clientX - rect.left}px ${event.clientY - rect.top}px`;
    drag.current = {
      pointer: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      tearX: 0,
      tearY: 0,
      isTorn: false,
      x: 0,
      y: 0,
      rotate: 0,
      lastX: event.clientX,
      lastTime: event.timeStamp,
      velocity: 0,
    };
  }

  function pull(event: PointerEvent<HTMLDivElement>) {
    const state = drag.current;
    const element = paper.current;
    if (!state || state.pointer !== event.pointerId || !element) {
      return;
    }
    // Pointer events can come a millisecond apart, so the raw speed jumps wildly.
    // The tilt follows a smoothed, capped speed, otherwise the paper shakes in the hand.
    const elapsed = event.timeStamp - state.lastTime;
    if (elapsed > 0) {
      const speed = clamp((event.clientX - state.lastX) / elapsed, MAX_SPEED);
      state.velocity += (speed - state.velocity) * Math.min(elapsed / SPEED_SMOOTHING, 1);
      state.lastX = event.clientX;
      state.lastTime = event.timeStamp;
    }

    if (!state.isTorn) {
      const stretch = Math.max(0, event.clientY - state.startY) * RESISTANCE;
      if (stretch < TEAR_AT) {
        state.y = stretch;
        element.style.transform = translateY(stretch);
        if (roll.current) {
          roll.current.style.transform = rollAt(stretch);
        }
        return;
      }
      state.isTorn = true;
      state.tearX = event.clientX;
      state.tearY = event.clientY;
      tear(TEAR_AT);
    }

    state.x = event.clientX - state.tearX;
    state.y = TEAR_AT + event.clientY - state.tearY;
    state.rotate = clamp(state.x / 12 + state.velocity * 3, 10);
    element.style.transform = `translate(${state.x}px, ${state.y}px) rotate(${state.rotate}deg)`;
  }

  function release(event: PointerEvent<HTMLDivElement>) {
    const state = drag.current;
    const element = paper.current;
    if (!state || state.pointer !== event.pointerId || !element) {
      return;
    }
    drag.current = null;
    if (state.isTorn) {
      flyAway(state.x, state.y, state.rotate, state.velocity);
      return;
    }
    if (state.y === 0) {
      return;
    }
    const timing = { duration: ms(tokens.durations.slow), easing: tokens.easings.decelerate };
    element.style.transform = translateY(0);
    element.animate([{ transform: translateY(state.y) }, { transform: translateY(0) }], timing);
    if (roll.current) {
      roll.current.style.transform = rollAt(0);
      roll.current.animate([{ transform: rollAt(state.y) }, { transform: rollAt(0) }], timing);
    }
  }

  const isOut = phase === "printed" || phase === "leaving";

  return (
    <Box flexDirection="column" alignItems="center" gap="l" width="100%" maxWidth={256}>
      <Box position="relative" flexDirection="column" alignItems="center" width="100%">
        <Box
          position="relative"
          zIndex={3}
          alignItems="center"
          justifyContent="end"
          width="100%"
          maxWidth={240}
          height={SLOT_HEIGHT}
          paddingRight="m"
          backgroundColor="background-inverse"
          borderRadius="full"
        >
          <Box ref={led} color="text-success" aria-hidden>
            <svg
              width={4}
              height={4}
              viewBox="0 0 4 4"
              fill="currentColor"
              style={{ display: "block" }}
            >
              <circle cx={2} cy={2} r={2} />
            </svg>
          </Box>
        </Box>

        <Box
          position="relative"
          flexDirection="column"
          alignItems="center"
          width="100%"
          paddingBottom="s"
          overflow={isOut ? "visible" : "hidden"}
        >
          <Box
            position="absolute"
            inset={0}
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap="m"
            opacity={phase === "idle" ? 1 : 0}
            transitionProperty="opacity"
            transitionDuration="base"
            ease="standard"
            aria-hidden={phase !== "idle"}
          >
            <Text variant="title">Столик {order.table}</Text>
            <Box flexDirection="column" gap="xs" width={PAPER_WIDTH}>
              {order.lines.map((line) => (
                <Box key={line.name} justifyContent="between" gap="m">
                  <Text color="muted" truncate>
                    {line.quantity > 1 ? `${line.name} × ${line.quantity}` : line.name}
                  </Text>
                  <Text tabularNums wrap="nowrap">
                    {formatRubles(line.quantity * line.price)}
                  </Text>
                </Box>
              ))}
            </Box>
          </Box>

          <Box
            position="absolute"
            top={0}
            left={`calc(50% - ${PAPER_WIDTH / 2}px)`}
            zIndex={1}
            width={PAPER_WIDTH}
            height={TEAR_AT + TONGUE + TEETH_HEIGHT}
            overflow="hidden"
            aria-hidden
          >
            <Box
              ref={roll}
              position="relative"
              flexShrink={0}
              width={PAPER_WIDTH}
              height={TEAR_AT + TONGUE}
              backgroundColor="background-panel"
              transform={rollAt(0)}
            >
              <Box position="absolute" top="100%" left={0}>
                <Teeth edge="bottom" />
              </Box>
            </Box>
          </Box>

          <Box
            key={number}
            ref={paper}
            position="relative"
            zIndex={2}
            flexDirection="column"
            gap="l"
            width={PAPER_WIDTH}
            paddingHorizontal="l"
            paddingTop="xl"
            paddingBottom="l"
            backgroundColor="background-panel"
            color="text-primary"
            boxShadow={isOut ? "m" : "none"}
            cursor={phase === "printed" ? "grab" : undefined}
            userSelect="none"
            transform={isOut ? undefined : `translateY(calc(${TONGUE}px - 100%))`}
            onPointerDown={grab}
            onPointerMove={pull}
            onPointerUp={release}
            onPointerCancel={release}
          >
            {isTorn ? (
              <Box position="absolute" bottom="100%" left={0}>
                <Teeth edge="top" />
              </Box>
            ) : null}
            <Paper order={order} number={number} printedAt={printedAt} />
            <Box position="absolute" top="100%" left={0}>
              <Teeth edge="bottom" />
            </Box>
          </Box>
        </Box>
      </Box>

      <Box alignItems="center" justifyContent="center" minHeight={40} aria-live="polite">
        {phase === "idle" ? (
          <Box key="pay" display="block" motion="fade">
            <Button onPress={pay}>Оплатить {formatRubles(total)}</Button>
          </Box>
        ) : phase === "printing" ? (
          <Box key="printing" display="block" motion="fade">
            <Text variant="caption" color="muted">
              <Shimmer>Печатаем чек</Shimmer>
            </Text>
          </Box>
        ) : (
          <Box key="tear" display="block" motion="fade">
            <Button size="sm" variant="ghost" isDisabled={phase !== "printed"} onPress={tearOff}>
              <Scissors />
              Оторвать чек
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}

ReceiptBlock.displayName = "Чек";

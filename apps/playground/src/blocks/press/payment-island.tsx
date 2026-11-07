import { Avatar, Box, Button, Text, TextSwap, toast, tokens } from "@anyglade/kit";
import { ArrowUturnCcwLeft } from "@anyglade/kit/icons";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { simulateRequest } from "../../simulate.ts";
import { formatMoney } from "../format.ts";

interface Payer {
  name: string;
  initials: string;
  photo?: number;
  purpose: string;
  amount: number;
  method: string;
  email: string;
}

interface Payment extends Payer {
  id: number;
  invoice: string;
  time: string;
  isLive: boolean;
  isRefunded: boolean;
}

const payers: readonly Payer[] = [
  {
    name: "Anna Sawyer",
    initials: "AS",
    photo: 47,
    purpose: "UI Basics course",
    amount: 129,
    method: "Card •• 4417",
    email: "anna.sawyer@gmail.com",
  },
  {
    name: "David Ortiz",
    initials: "DO",
    photo: 53,
    purpose: "Consultation, 2 hours",
    amount: 180,
    method: "Apple Pay",
    email: "d.ortiz@outlook.com",
  },
  {
    name: "Katherine Bell",
    initials: "KB",
    photo: 32,
    purpose: "Annual subscription",
    amount: 99,
    method: "Card •• 2291",
    email: "k.bell@gmail.com",
  },
  {
    name: "Arthur Zane",
    initials: "AZ",
    photo: 68,
    purpose: "50% deposit",
    amount: 480,
    method: "Apple Pay",
    email: "zane@northstudio.co",
  },
  {
    name: "Olivia Moore",
    initials: "OM",
    photo: 5,
    purpose: "UI Basics course",
    amount: 129,
    method: "Card •• 9032",
    email: "olivia.moore@gmail.com",
  },
];

const earlier: readonly Payment[] = [
  {
    id: 2186,
    name: "Ethan Brooks",
    initials: "EB",
    photo: 12,
    purpose: "Consultation, 1 hour",
    amount: 90,
    method: "Apple Pay",
    email: "ethan.brooks@outlook.com",
    invoice: "#2186",
    time: "9:38 AM",
    isLive: false,
    isRefunded: false,
  },
  {
    id: 2185,
    name: "Maria Kim",
    initials: "MK",
    photo: 45,
    purpose: "Annual subscription",
    amount: 99,
    method: "Card •• 1185",
    email: "maria.kim@gmail.com",
    invoice: "#2185",
    time: "9:12 AM",
    isLive: false,
    isRefunded: false,
  },
  {
    id: 2184,
    name: "North Studio",
    initials: "NS",
    purpose: "Invoice #2184",
    amount: 600,
    method: "Invoice",
    email: "hello@northstudio.co",
    invoice: "#2184",
    time: "8:55 AM",
    isLive: false,
    isRefunded: false,
  },
];

const ms = (duration: string) => Number.parseFloat(duration);
const isReduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/** How long a payment stays on the island before the next one or rest. */
const SHOWN_FOR = ms(tokens.durations.drift) * 1.5;
const VISIBLE_ROWS = 3;

const plural = new Intl.PluralRules("en-US");
const paymentWords = { one: "payment", other: "payments" };
const refundWords = { one: "refund", other: "refunds" };
const counted = (count: number, words: typeof paymentWords) =>
  `${count} ${plural.select(count) === "one" ? words.one : words.other}`;

/**
 * A rounded rectangle built from four circles and two bars. Circles scale evenly and bars
 * have no corners, so the shape morphs on transform alone and the corners stay round.
 */
const PIECE = 64;
const MAX_RADIUS = 28;

interface Geometry {
  width: number;
  height: number;
}

function pieceTransforms({ width, height }: Geometry) {
  const radius = Math.min(height / 2, MAX_RADIUS);
  const diameter = radius * 2;
  /** Places a piece of the given box: the piece scales around its own centre. */
  const box = (x: number, y: number, w: number, h: number, uniform: boolean) =>
    `translate(${x + w / 2 - PIECE / 2}px, ${y + h / 2 - PIECE / 2}px) ${
      uniform ? `scale(${w / PIECE})` : `scale(${w / PIECE}, ${h / PIECE})`
    }`;
  const left = -width / 2;
  const right = width / 2 - diameter;
  const bottom = height - diameter;
  return [
    box(left, 0, diameter, diameter, true),
    box(right, 0, diameter, diameter, true),
    box(left, bottom, diameter, diameter, true),
    box(right, bottom, diameter, diameter, true),
    box(left, radius, width, height - diameter, false),
    box(left + radius, 0, width - diameter, height, false),
  ];
}

const beyond = (from: Geometry, to: Geometry, amount: number): Geometry => ({
  width: to.width + (to.width - from.width) * amount,
  height: to.height + (to.height - from.height) * amount,
});

/** Freezes running animations where they are, so the next motion starts from there. */
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

function useIslandShape() {
  const pieces = useRef<(HTMLDivElement | null)[]>([]);
  const frame = useRef<HTMLDivElement>(null);
  const current = useRef<Geometry | null>(null);

  useLayoutEffect(() => {
    const element = frame.current;
    if (!element) {
      return undefined;
    }
    const observer = new ResizeObserver(([entry]) => {
      const size = entry?.borderBoxSize[0];
      if (!size) {
        return;
      }
      const next = { width: size.inlineSize, height: size.blockSize };
      const previous = current.current;
      current.current = next;
      const targets = pieceTransforms(next);
      const grows =
        previous !== null && next.width * next.height > previous.width * previous.height;
      const overshoot = previous ? pieceTransforms(beyond(previous, next, 0.06)) : targets;

      pieces.current.forEach((piece, index) => {
        if (!piece) {
          return;
        }
        settle(piece);
        const from = piece.style.transform;
        piece.style.transform = targets[index] ?? "";
        if (!previous || isReduced()) {
          return;
        }
        piece.animate(
          grows
            ? [
                { transform: from, easing: tokens.easings.decelerate },
                { transform: overshoot[index], offset: 0.55, easing: tokens.easings.standard },
                { transform: targets[index] },
              ]
            : [{ transform: from }, { transform: targets[index] }],
          {
            duration: ms(grows ? tokens.durations.slower : tokens.durations.slow),
            easing: tokens.easings.standard,
          },
        );
      });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { pieces, frame };
}

interface Island {
  mode: "rest" | "banner" | "card";
  current: Payment | null;
  queue: readonly Payment[];
}

type IslandAction =
  | { type: "arrive"; payment: Payment }
  | { type: "open" }
  | { type: "next" }
  | { type: "refund"; id: number };

function reduce(state: Island, action: IslandAction): Island {
  switch (action.type) {
    case "arrive":
      return state.current
        ? { ...state, queue: [...state.queue, action.payment] }
        : { mode: "banner", current: action.payment, queue: [] };
    case "open":
      return state.current ? { ...state, mode: "card" } : state;
    case "next": {
      const [first, ...rest] = state.queue;
      return first
        ? { mode: "banner", current: first, queue: rest }
        : { mode: "rest", current: null, queue: [] };
    }
    case "refund":
      return state.current?.id === action.id
        ? { ...state, current: { ...state.current, isRefunded: true } }
        : state;
  }
}

function PayerAvatar({ payment, size }: { payment: Payer; size: "sm" | "md" }) {
  return (
    <Avatar size={size}>
      {payment.photo ? (
        <Avatar.Image alt="" src={`https://i.pravatar.cc/80?img=${payment.photo}`} />
      ) : null}
      <Avatar.Fallback>{payment.initials}</Avatar.Fallback>
    </Avatar>
  );
}

function StatusIcons() {
  return (
    <Box alignItems="center" gap="xs" aria-hidden>
      <svg width={17} height={11} viewBox="0 0 17 11" fill="currentColor">
        <rect x={0} y={7} width={3} height={4} rx={1} />
        <rect x={4.5} y={5} width={3} height={6} rx={1} />
        <rect x={9} y={2.5} width={3} height={8.5} rx={1} />
        <rect x={13.5} y={0} width={3} height={11} rx={1} />
      </svg>
      <svg
        width={16}
        height={12}
        viewBox="0 0 16 12"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
      >
        <path d="M1.6 4.6a9 9 0 0 1 12.8 0" />
        <path d="M3.8 6.8a6 6 0 0 1 8.4 0" />
        <circle cx={8} cy={9.8} r={1.4} fill="currentColor" stroke="none" />
      </svg>
      <svg width={25} height={12} viewBox="0 0 25 12" fill="currentColor">
        <rect x={0.5} y={0.5} width={21} height={11} rx={3} fill="none" stroke="currentColor" />
        <rect x={2} y={2} width={15} height={8} rx={1.5} />
        <rect x={22.5} y={4} width={1.5} height={4} rx={0.75} />
      </svg>
    </Box>
  );
}

function Amount({ payment }: { payment: Payment }) {
  return (
    <Text variant="title" tabularNums wrap="nowrap" lineThrough={payment.isRefunded}>
      +{formatMoney(payment.amount)}
    </Text>
  );
}

function Countdown({ onExpire }: { onExpire: () => void }) {
  const bar = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const animation = bar.current?.animate(
      [{ transform: "scaleX(1)" }, { transform: "scaleX(0)" }],
      // A timer runs at an even pace: no easing curve here.
      { duration: SHOWN_FOR, easing: "linear", fill: "forwards" },
    );
    if (animation) {
      animation.onfinish = onExpire;
    }
    const banner = bar.current?.closest("[data-banner]");
    const pause = () => animation?.pause();
    const resume = () => {
      if (!banner?.matches(":hover, :focus-within")) {
        animation?.play();
      }
    };
    banner?.addEventListener("pointerenter", pause);
    banner?.addEventListener("pointerleave", resume);
    banner?.addEventListener("focusin", pause);
    banner?.addEventListener("focusout", resume);
    return () => {
      animation?.cancel();
      banner?.removeEventListener("pointerenter", pause);
      banner?.removeEventListener("pointerleave", resume);
      banner?.removeEventListener("focusin", pause);
      banner?.removeEventListener("focusout", resume);
    };
  }, [onExpire]);

  return (
    <Box
      ref={bar}
      position="absolute"
      left={28}
      right={28}
      bottom={5}
      height={2}
      backgroundColor="background-emphasis"
      borderRadius="full"
      transform="scaleX(1)"
      aria-hidden
    />
  );
}

export function PaymentIslandBlock() {
  const [island, dispatch] = useReducer(reduce, { mode: "rest", current: null, queue: [] });
  const [history, setHistory] = useState<readonly Payment[]>(earlier);
  const [total, setTotal] = useState(2_160);
  const [count, setCount] = useState(14);
  const [refunds, setRefunds] = useState(0);
  const [isConfirming, setIsConfirming] = useState(false);
  const { pieces, frame } = useIslandShape();
  const root = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const isLeaving = useRef(false);
  const nextPayer = useRef(0);
  const nextId = useRef(2187);
  const rows = useRef(new Map<number, HTMLElement>());
  const rowTops = useRef(new Map<number, number>());
  const queueLength = useRef(0);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const { mode, current, queue } = island;
  const contentKey = current ? `${mode}-${current.id}` : "rest";

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  // New content shows once the shape has started to grow.
  useLayoutEffect(() => {
    isLeaving.current = false;
    const element = content.current;
    if (!element || contentKey === "rest") {
      return;
    }
    element.animate(
      isReduced()
        ? [{ opacity: 0 }, { opacity: 1 }]
        : [
            { opacity: 0, transform: "scale(0.96)" },
            { opacity: 1, transform: "none" },
          ],
      {
        duration: ms(tokens.durations.base),
        delay: ms(tokens.durations.fast),
        easing: tokens.easings.decelerate,
        fill: "backwards",
      },
    );
  }, [contentKey]);

  // A payment that joins the queue nudges the island.
  useLayoutEffect(() => {
    if (queue.length > queueLength.current && !isReduced()) {
      root.current?.animate(
        [{ transform: "scale(1)" }, { transform: "scale(1.03)" }, { transform: "scale(1)" }],
        { duration: ms(tokens.durations.slow), easing: tokens.easings.standard },
      );
    }
    queueLength.current = queue.length;
  }, [queue.length]);

  // Rows already in the list slide down to make room for the new one.
  useLayoutEffect(() => {
    const tops = new Map<number, number>();
    for (const [id, row] of rows.current) {
      const top = row.offsetTop;
      tops.set(id, top);
      const before = rowTops.current.get(id);
      if (before !== undefined && before !== top && !isReduced()) {
        row.animate([{ transform: `translateY(${before - top}px)` }, { transform: "none" }], {
          duration: ms(tokens.durations.slow),
          easing: tokens.easings.standard,
        });
      }
    }
    rowTops.current = tops;
  }, [history]);

  /** Content fades first, then the shape follows the new state. Uses only refs, so it is stable. */
  const leave = useCallback(() => {
    if (isLeaving.current) {
      return;
    }
    isLeaving.current = true;
    clearTimeout(closeTimer.current);
    const finish = () => {
      setIsConfirming(false);
      dispatch({ type: "next" });
    };
    const element = content.current;
    if (!element) {
      finish();
      return;
    }
    element
      .animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: ms(tokens.durations.fast),
        easing: tokens.easings.accelerate,
        fill: "forwards",
      })
      .finished.then(finish, finish);
  }, []);

  async function receive() {
    await simulateRequest(500);
    const payer = payers[nextPayer.current % payers.length] ?? payers[0];
    nextPayer.current += 1;
    const id = nextId.current;
    nextId.current += 1;
    const payment: Payment = {
      ...payer,
      id,
      invoice: `#${id}`,
      time: "9:41 AM",
      isLive: true,
      isRefunded: false,
    };
    setTotal((sum) => sum + payment.amount);
    setCount((value) => value + 1);
    setHistory((list) => [payment, ...list].slice(0, VISIBLE_ROWS + 1));
    dispatch({ type: "arrive", payment });
  }

  function open() {
    dispatch({ type: "open" });
  }

  function sendReceipt(payment: Payment) {
    toast(`Receipt ${payment.invoice} sent to ${payment.email}`);
    leave();
  }

  async function refund(payment: Payment) {
    if (!isConfirming) {
      setIsConfirming(true);
      return;
    }
    await simulateRequest(1000);
    dispatch({ type: "refund", id: payment.id });
    setTotal((sum) => sum - payment.amount);
    setRefunds((value) => value + 1);
    setHistory((list) =>
      list.map((item) => (item.id === payment.id ? { ...item, isRefunded: true } : item)),
    );
    closeTimer.current = setTimeout(leave, tokens.timings.confirmation);
  }

  function onCardKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      leave();
    }
  }

  const waiting = queue.length > 0 ? `${queue.length} more` : null;

  return (
    <Box flexDirection="column" alignItems="center" gap="xl" width="100%" maxWidth={300}>
      <Box
        position="relative"
        flexDirection="column"
        width="100%"
        paddingHorizontal="xl"
        paddingBottom="xl"
        backgroundColor="background-primary"
        color="text-primary"
        borderRadius="xl"
        boxShadow="l"
      >
        <Box alignItems="center" justifyContent="between" height={44} paddingHorizontal="xs">
          <Text variant="title" weight="semibold" tabularNums>
            9:41
          </Text>
          <StatusIcons />
        </Box>

        <Box
          ref={root}
          position="absolute"
          top={8}
          left={8}
          right={8}
          zIndex={2}
          flexDirection="column"
          alignItems="center"
          pointerEvents="none"
          aria-live="polite"
        >
          <Box position="absolute" top={0} left="50%" width={0} height={0} aria-hidden>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <Box
                key={index}
                ref={(element: HTMLDivElement | null) => {
                  pieces.current[index] = element;
                }}
                position="absolute"
                top={0}
                left={0}
                width={PIECE}
                height={PIECE}
                backgroundColor="background-inverse"
                borderRadius={index < 4 ? "full" : "none"}
                transform="scale(0)"
              />
            ))}
          </Box>

          <Box
            ref={frame}
            position="relative"
            flexDirection="column"
            width={mode === "rest" ? 92 : "100%"}
            minHeight={mode === "rest" ? 28 : undefined}
            color="text-inverse"
            pointerEvents={mode === "rest" ? "none" : "auto"}
          >
            {current && mode === "banner" ? (
              <Box key={contentKey} ref={content} data-banner position="relative" display="block">
                <button
                  aria-expanded={false}
                  aria-label={`${current.name}, +${formatMoney(current.amount)}. Details`}
                  className="w-full"
                  type="button"
                  onClick={open}
                >
                  <Box
                    alignItems="center"
                    gap="m"
                    height={56}
                    paddingLeft="m"
                    paddingRight="l"
                    textAlign="left"
                    cursor="pointer"
                  >
                    <PayerAvatar payment={current} size="sm" />
                    <Box flexDirection="column" flex={1} minWidth={0}>
                      <Text variant="title" truncate>
                        {current.name}
                      </Text>
                      <Text variant="caption" truncate>
                        {current.purpose}
                      </Text>
                    </Box>
                    <Box flexDirection="column" alignItems="end" flexShrink={0}>
                      <Amount payment={current} />
                      {waiting ? (
                        <Text variant="caption" tabularNums wrap="nowrap">
                          {waiting}
                        </Text>
                      ) : null}
                    </Box>
                  </Box>
                </button>
                <Countdown onExpire={leave} />
              </Box>
            ) : null}

            {current && mode === "card" ? (
              <Box
                key={contentKey}
                ref={content}
                flexDirection="column"
                gap="l"
                padding="l"
                onKeyDown={onCardKey}
              >
                <button aria-expanded className="w-full" type="button" onClick={leave}>
                  <Box alignItems="center" gap="m" textAlign="left" cursor="pointer">
                    <PayerAvatar payment={current} size="md" />
                    <Box flexDirection="column" flex={1} minWidth={0}>
                      <Text variant="title" truncate>
                        {current.name}
                      </Text>
                      <Text variant="caption" truncate>
                        {current.purpose}
                      </Text>
                    </Box>
                    <Box flexDirection="column" alignItems="end" flexShrink={0}>
                      <Amount payment={current} />
                      {waiting ? (
                        <Text variant="caption" tabularNums wrap="nowrap">
                          {waiting}
                        </Text>
                      ) : null}
                    </Box>
                  </Box>
                </button>

                <Box flexDirection="column" gap="2xs">
                  {[
                    ["Invoice", current.invoice],
                    ["Paid with", current.method],
                    ["Time", `Today, ${current.time}`],
                  ].map(([label, value]) => (
                    <Box key={label} justifyContent="between" gap="m">
                      <Text variant="caption">{label}</Text>
                      <Text variant="caption" weight="medium" tabularNums wrap="nowrap">
                        {value}
                      </Text>
                    </Box>
                  ))}
                </Box>

                {current.isRefunded ? (
                  <Box alignItems="center" gap="s" minHeight={32} motion="enter">
                    <ArrowUturnCcwLeft aria-hidden />
                    <Box flexDirection="column" minWidth={0}>
                      <Text variant="title">Refund issued</Text>
                      <Text variant="caption">
                        {current.method === "Apple Pay"
                          ? "The money arrives instantly"
                          : "The money arrives in 1–3 days"}
                      </Text>
                    </Box>
                  </Box>
                ) : (
                  <Box display="grid" gridTemplateColumns="repeat(2, minmax(0, 1fr))" gap="s">
                    <Button
                      className="w-full"
                      size="sm"
                      variant="secondary"
                      onPress={() => sendReceipt(current)}
                    >
                      Send receipt
                    </Button>
                    <Button
                      className="w-full"
                      size="sm"
                      variant={isConfirming ? "danger" : "secondary"}
                      onPress={() => refund(current)}
                    >
                      <TextSwap text={isConfirming ? "Confirm refund" : "Refund"} />
                    </Button>
                  </Box>
                )}
              </Box>
            ) : null}
          </Box>
        </Box>

        <Box flexDirection="column" gap="2xs" paddingTop="xl" paddingHorizontal="xs">
          <Text variant="caption" color="muted">
            Today
          </Text>
          <Text variant="heading-m" tabularNums wrap="nowrap">
            <TextSwap text={formatMoney(total)} />
          </Text>
          <Text variant="caption" color="muted" tabularNums>
            {counted(count, paymentWords)}
            {refunds > 0 ? `, ${counted(refunds, refundWords)}` : ""}
          </Text>
        </Box>

        <Box
          position="relative"
          flexDirection="column"
          gap="m"
          paddingTop="xl"
          paddingHorizontal="xs"
        >
          {history.slice(0, VISIBLE_ROWS).map((payment) => (
            <Box
              key={payment.id}
              ref={(element: HTMLDivElement | null) => {
                if (element) {
                  rows.current.set(payment.id, element);
                }
                return () => {
                  rows.current.delete(payment.id);
                };
              }}
              alignItems="center"
              gap="m"
              motion={payment.isLive ? "enter" : undefined}
            >
              <PayerAvatar payment={payment} size="sm" />
              <Box flexDirection="column" flex={1} minWidth={0}>
                <Text variant="title" truncate>
                  {payment.name}
                </Text>
                <Text variant="caption" color="muted" tabularNums truncate>
                  {payment.time}, {payment.purpose}
                </Text>
              </Box>
              <Text
                tabularNums
                wrap="nowrap"
                color={payment.isRefunded ? "muted" : "default"}
                lineThrough={payment.isRefunded}
              >
                +{formatMoney(payment.amount)}
              </Text>
            </Box>
          ))}
        </Box>
      </Box>

      <Button size="sm" variant="secondary" onPress={receive}>
        Run a test payment
      </Button>
    </Box>
  );
}

PaymentIslandBlock.displayName = "Payment island";

import { Box, Button, Popover, Text, TextSwap, tokens } from "@anyglade/kit";
import { memo, useEffect, useRef, useState } from "react";
import { simulateRequest } from "../../simulate.ts";
import { formatRubles } from "../format.ts";

type Phase = "idle" | "running" | "done";
type DotState = "waiting" | "matched" | "mismatch" | "resolved";

interface Mismatch {
  /** Place of the payment in October, in time order: the matrix reads like a page. */
  index: number;
  place: string;
  difference: number;
  detail: string;
  action: string;
  resolution: string;
  resolvedLabel: string;
}

const COLUMNS = 12;
const ROWS = 8;
const PAYMENTS = COLUMNS * ROWS;
const LAST_DIAGONAL = COLUMNS + ROWS - 2;
const CASH_TOTAL = 1_286_400;

const MISMATCHES: readonly Mismatch[] = [
  {
    index: 37,
    place: "Студия «Север»",
    difference: 147,
    detail: `В кассе ${formatRubles(4900)}, в банке ${formatRubles(4753)}, разница ${formatRubles(147)} — комиссия эквайринга.`,
    action: "Учесть комиссию",
    resolution: `Комиссия ${formatRubles(147)} учтена в расходах октября.`,
    resolvedLabel: "Учтено",
  },
  {
    index: 95,
    place: "Кофейня «Зерно»",
    difference: 2300,
    detail: `В кассе ${formatRubles(2300)} 31 октября в 23:52, а банк зачислил платёж 1 ноября.`,
    action: "Перенести в ноябрь",
    resolution: `Платёж ${formatRubles(2300)} перенесён в сверку ноября.`,
    resolvedLabel: "В ноябре",
  },
];
const BANK_TOTAL = MISMATCHES.reduce((total, item) => total - item.difference, CASH_TOTAL);
const mismatchAt = new Map(MISMATCHES.map((item) => [item.index, item]));

/** Payments on one diagonal are checked together, so the wave runs corner to corner. */
const diagonalOf = (index: number) => Math.floor(index / COLUMNS) + (index % COLUMNS);
const payments = Array.from({ length: PAYMENTS }, (_, index) => index);
const checkedBy = (front: number) => payments.filter((index) => diagonalOf(index) <= front).length;

const ms = (duration: keyof typeof tokens.durations) =>
  Number.parseFloat(tokens.durations[duration]);
const isReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const WAVE_STEP = ms("stagger") * 1.5;
const SETTLE_STEPS = 3;

function mismatchCount(count: number) {
  if (count === 1) {
    return "1 расхождение";
  }
  return `${count} расхождения`;
}

interface DotProps {
  state: DotState;
  isCrest: boolean;
  isPointed: boolean;
}

/** One payment. A mismatch is a ring, not only another colour, and breathes until settled. */
const Dot = memo(function Dot({ state, isCrest, isPointed }: DotProps) {
  const dot = useRef<HTMLDivElement>(null);
  const isPulsing = state === "mismatch" && !isPointed;

  useEffect(() => {
    if (!isPulsing) {
      return undefined;
    }
    const pulse = dot.current?.animate([{ opacity: 1 }, { opacity: 0.35 }, { opacity: 1 }], {
      duration: ms("drift") / 2,
      easing: tokens.easings.standard,
      iterations: Number.POSITIVE_INFINITY,
    });
    return () => pulse?.cancel();
  }, [isPulsing]);

  useEffect(() => {
    if (state !== "resolved") {
      return;
    }
    dot.current?.animate(
      isReducedMotion()
        ? [{ opacity: 0 }, { opacity: 1 }]
        : [{ transform: "scale(0.4)" }, { transform: "scale(1)" }],
      { duration: ms("slow"), easing: tokens.easings.decelerate },
    );
  }, [state]);

  const scale = isPointed ? 1.8 : isCrest && !isReducedMotion() ? 1.35 : 1;
  const isMismatch = state === "mismatch";

  return (
    <Box alignItems="center" justifyContent="center" aspectRatio="1">
      <Box
        ref={dot}
        width="64%"
        height="64%"
        borderRadius="full"
        backgroundColor={
          isMismatch ? undefined : state === "waiting" ? "background-panel" : "background-inverse"
        }
        borderWidth={isMismatch ? 2 : 0}
        borderStyle="solid"
        borderColor="border-warning"
        transform={scale === 1 ? "none" : `scale(${scale})`}
        transitionProperty="common"
        transitionDuration={isCrest ? "fast" : "slow"}
        ease="standard"
      />
    </Box>
  );
});

function Marker({ isResolved }: { isResolved: boolean }) {
  return (
    <Box
      as="span"
      display="inline-block"
      width={10}
      height={10}
      flexShrink={0}
      borderRadius="full"
      backgroundColor={isResolved ? "background-inverse" : undefined}
      borderWidth={isResolved ? 0 : 2}
      borderStyle="solid"
      borderColor="border-warning"
    />
  );
}

interface MismatchRowProps {
  item: Mismatch;
  isResolved: boolean;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onPoint: (isPointed: boolean) => void;
  onResolve: () => Promise<void>;
  onReopen: () => void;
}

/** Hover or focus lights the payment in the matrix; press opens what happened to it. */
function MismatchRow({
  item,
  isResolved,
  isOpen,
  onOpenChange,
  onPoint,
  onResolve,
  onReopen,
}: MismatchRowProps) {
  return (
    <Popover isOpen={isOpen} onOpenChange={onOpenChange}>
      <Button fullWidth size="sm" variant="ghost" onFocusChange={onPoint} onHoverChange={onPoint}>
        <Box
          as="span"
          display="flex"
          alignItems="center"
          justifyContent="between"
          gap="s"
          width="100%"
        >
          <Box as="span" display="flex" alignItems="center" gap="s" minWidth={0}>
            <Marker isResolved={isResolved} />
            <Text as="span" truncate>
              {item.place}
            </Text>
          </Box>
          <Text as="span" color={isResolved ? "muted" : "default"} tabularNums wrap="nowrap">
            {isResolved ? item.resolvedLabel : formatRubles(item.difference)}
          </Text>
        </Box>
      </Button>
      <Popover.Content className="max-w-64" placement="top">
        <Popover.Dialog>
          <Popover.Heading>{item.place}</Popover.Heading>
          <Box display="block" marginTop="xs">
            <Text color="muted" wrap="pretty" tabularNums>
              {isResolved ? item.resolution : item.detail}
            </Text>
          </Box>
          <Box display="block" marginTop="m">
            {isResolved ? (
              <Button size="sm" variant="secondary" onPress={onReopen}>
                Вернуть в расхождения
              </Button>
            ) : (
              <Button size="sm" onPress={onResolve}>
                {item.action}
              </Button>
            )}
          </Box>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );
}

function TotalRow({ label, amount }: { label: string; amount: number }) {
  return (
    <Box
      alignItems="center"
      justifyContent="between"
      gap="s"
      height={32}
      paddingHorizontal="m"
      motion="fade"
    >
      <Text color="muted">{label}</Text>
      <Text tabularNums wrap="nowrap">
        {formatRubles(amount)}
      </Text>
    </Box>
  );
}

export function ReconcileBlock() {
  const [isStarted, setIsStarted] = useState(false);
  const [front, setFront] = useState(-1);
  const [resolved, setResolved] = useState<ReadonlySet<number>>(new Set());
  const [open, setOpen] = useState<number | null>(null);
  const [pointed, setPointed] = useState<number | null>(null);

  // A short beat after the last diagonal, so the finished matrix is seen before the verdict.
  const isDone = isStarted && front >= LAST_DIAGONAL + SETTLE_STEPS;
  const phase: Phase = isDone ? "done" : isStarted ? "running" : "idle";

  useEffect(() => {
    if (phase !== "running") {
      return undefined;
    }
    const timer = setInterval(() => setFront((current) => current + 1), WAVE_STEP);
    return () => clearInterval(timer);
  }, [phase]);

  function start() {
    setResolved(new Set());
    setOpen(null);
    setFront(-1);
    setIsStarted(true);
  }

  async function resolve(index: number) {
    await simulateRequest(700);
    setResolved((current) => new Set(current).add(index));
    setOpen(null);
  }

  function reopen(index: number) {
    setResolved((current) => {
      const next = new Set(current);
      next.delete(index);
      return next;
    });
    setOpen(null);
  }

  const checked = checkedBy(front);
  const openCount = MISMATCHES.length - resolved.size;
  const lit = open ?? pointed;
  const status =
    phase === "idle"
      ? "Ждёт сверки"
      : phase === "running"
        ? "Сверяю с выпиской"
        : openCount > 0
          ? mismatchCount(openCount)
          : "Всё сошлось";
  const counter =
    phase === "idle"
      ? `${PAYMENTS} платежей за октябрь`
      : phase === "running"
        ? `${checked} из ${PAYMENTS}`
        : `${PAYMENTS - openCount} из ${PAYMENTS} сошлись`;

  function dotState(index: number): DotState {
    if (diagonalOf(index) > front) {
      return "waiting";
    }
    if (!mismatchAt.has(index)) {
      return "matched";
    }
    return resolved.has(index) ? "resolved" : "mismatch";
  }

  return (
    <Box flexDirection="column" gap="l" width="100%" maxWidth={300} marginHorizontal="auto">
      <Box alignItems="baseline" justifyContent="between" gap="s">
        <Box aria-live="polite" display="block" minWidth={0}>
          <Text
            variant="title"
            wrap="nowrap"
            color={phase !== "done" ? "default" : openCount > 0 ? "warning" : "success"}
          >
            <TextSwap isShimmering={phase === "running"} text={status} />
          </Text>
        </Box>
        <Text variant="caption" color="muted" tabularNums wrap="nowrap">
          {counter}
        </Text>
      </Box>

      <Box
        aria-hidden
        display="grid"
        gridTemplateColumns={`repeat(${COLUMNS}, minmax(0, 1fr))`}
        gap="xs"
        width="100%"
      >
        {payments.map((index) => (
          <Dot
            key={index}
            isCrest={phase === "running" && diagonalOf(index) === front}
            isPointed={phase === "done" && lit === index}
            state={dotState(index)}
          />
        ))}
      </Box>

      <Box flexDirection="column" gap="2xs">
        {phase === "done"
          ? MISMATCHES.map((item) => (
              <Box key={item.index} display="block" motion="fade">
                <MismatchRow
                  isOpen={open === item.index}
                  isResolved={resolved.has(item.index)}
                  item={item}
                  onOpenChange={(isOpen) => setOpen(isOpen ? item.index : null)}
                  onPoint={(isPointed) =>
                    setPointed((current) =>
                      isPointed ? item.index : current === item.index ? null : current,
                    )
                  }
                  onReopen={() => reopen(item.index)}
                  onResolve={() => resolve(item.index)}
                />
              </Box>
            ))
          : [
              <TotalRow key="cash" amount={CASH_TOTAL} label="Касса" />,
              <TotalRow key="bank" amount={BANK_TOTAL} label="Выписка банка" />,
            ]}
      </Box>

      <Button isDisabled={phase === "running"} variant="secondary" onPress={start}>
        {phase === "done" ? "Сверить снова" : "Сверить"}
      </Button>
    </Box>
  );
}

ReconcileBlock.displayName = "Сверка";

import { Box, Button, Input, Label, Text, TextField, tokens } from "@anyglade/kit";
import { Fragment, useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { simulateRequest } from "../../simulate.ts";

type Face = "front" | "back";
type Field = "number" | "expiry" | "cvc";
type Brand = "VISA" | "Mastercard";

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Valid by Luhn, a Visa range: lets the whole path be walked without a real card. */
const TEST_NUMBER = "4242424242424242";
/** Today is November 2026: a card expiring this month still works until its end. */
const NOW = { year: 26, month: 11 };
const BRANDS: Record<string, Brand> = { "2": "Mastercard", "4": "VISA", "5": "Mastercard" };

/** Size of a frame corner, equal to the `s` radius, and the stroke of the frame. */
const CORNER = 8;
const STROKE = 1.5;
const PERSPECTIVE = "perspective(900px)";
const LINKED_SCALE = 0.84;

const ms = (duration: keyof typeof tokens.durations) =>
  Number.parseFloat(tokens.durations[duration]);
const isReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const digits = (value: string, limit: number) => value.replaceAll(/\D/g, "").slice(0, limit);
const formatNumber = (number: string) => number.replaceAll(/(\d{4})(?=\d)/g, "$1 ");
const formatExpiry = (expiry: string) =>
  expiry.length > 2 ? `${expiry.slice(0, 2)}/${expiry.slice(2)}` : expiry;

function passesLuhn(number: string) {
  let sum = 0;
  for (let index = 0; index < number.length; index += 1) {
    let digit = Number(number[number.length - 1 - index]);
    if (index % 2 === 1) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
  }
  return sum % 10 === 0;
}

function expiryError(expiry: string) {
  const month = Number(expiry.slice(0, 2));
  if (expiry.length >= 2 && (month < 1 || month > 12)) {
    return "No such month";
  }
  const year = Number(expiry.slice(2));
  if (expiry.length === 4 && (year < NOW.year || (year === NOW.year && month < NOW.month))) {
    return "This card has expired";
  }
  return null;
}

/** Position inside the card by layout, so a card caught mid-turn still measures true. */
function offsetWithin(element: HTMLElement, root: HTMLElement): Rect {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = element;
  while (node && node !== root) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x: x - 6, y: y - 4, width: element.offsetWidth + 12, height: element.offsetHeight + 8 };
}

/** Typed digits pop in one by one; the rest of the places hold a dot. */
function Slots({ value, length, from = 0, hidden = 0 }: SlotsProps) {
  return Array.from({ length }, (_, offset) => {
    const index = from + offset;
    const digit = value[index];
    if (digit === undefined) {
      return <Fragment key={`empty-${index}`}>•</Fragment>;
    }
    const isHidden = index < hidden;
    return (
      <Box
        key={isHidden ? `hidden-${index}` : `digit-${index}-${digit}`}
        as="span"
        display="inline-block"
        motion="pop"
      >
        {isHidden ? "•" : digit}
      </Box>
    );
  });
}

interface SlotsProps {
  value: string;
  length: number;
  from?: number;
  /** Places before this one show a dot even when typed: the card is saved and masked. */
  hidden?: number;
}

/** A rectangle with its own radius at each corner: top left, top right, bottom right, bottom left. */
function roundedRect(x: number, y: number, width: number, height: number, radii: number[]) {
  const [tl = 0, tr = 0, br = 0, bl = 0] = radii;
  const arc = (radius: number, toX: number, toY: number) =>
    `A${radius} ${radius} 0 0 1 ${toX} ${toY}`;
  return [
    `M${x + tl} ${y}H${x + width - tr}`,
    arc(tr, x + width, y + tr),
    `V${y + height - br}`,
    arc(br, x + width - br, y + height),
    `H${x + bl}`,
    arc(bl, x, y + height - bl),
    `V${y + tl}`,
    arc(tl, x + tl, y),
    "Z",
  ].join("");
}

const CHIP_OUTER = 4;
const CHIP_INNER = 1;
/** Contact pads: three on each side, two in the middle. Outer corners follow the chip. */
const CHIP_PADS = [0, 1, 2].flatMap((row) => {
  const y = row * 9.5;
  const top = row === 0 ? CHIP_OUTER : CHIP_INNER;
  const bottom = row === 2 ? CHIP_OUTER : CHIP_INNER;
  return [
    roundedRect(0, y, 11, 8, [top, CHIP_INNER, CHIP_INNER, bottom]),
    roundedRect(25, y, 11, 8, [CHIP_INNER, top, bottom, CHIP_INNER]),
  ];
});
CHIP_PADS.push(
  roundedRect(12.5, 0, 11, 12.75, [CHIP_INNER, CHIP_INNER, CHIP_INNER, CHIP_INNER]),
  roundedRect(12.5, 14.25, 11, 12.75, [CHIP_INNER, CHIP_INNER, CHIP_INNER, CHIP_INNER]),
);

function Chip() {
  // The gaps between the pads show the card through, so the chip follows its tone.
  return (
    <svg aria-hidden height="27" viewBox="0 0 36 27" width="36">
      {CHIP_PADS.map((path) => (
        <path key={path} d={path} fill="var(--ag-background-emphasis)" />
      ))}
    </svg>
  );
}

/** Three arcs widening from one point, at 45 degrees either side. */
function Contactless() {
  const point = { x: 3, y: 10 };
  const half = Math.SQRT1_2;
  return (
    <svg aria-hidden fill="none" height="20" viewBox="0 0 20 20" width="20">
      {[4, 8.5, 13].map((radius) => (
        <path
          key={radius}
          d={`M${point.x + radius * half} ${point.y - radius * half}A${radius} ${radius} 0 0 1 ${point.x + radius * half} ${point.y + radius * half}`}
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
      ))}
    </svg>
  );
}

/**
 * A rounded frame around the field in focus, drawn as one outline so its stroke has no seams.
 * Moving to another field it appears there afresh: a frame cut into pieces showed its joins.
 */
function FocusFrame({ rect }: { rect: Rect | null }) {
  if (!rect) {
    return null;
  }
  const inset = STROKE / 2;
  return (
    <Box
      key={`${rect.x}-${rect.y}-${rect.width}-${rect.height}`}
      aria-hidden
      position="absolute"
      top={rect.y}
      left={rect.x}
      display="block"
      pointerEvents="none"
      motion="fade"
    >
      <svg
        aria-hidden
        fill="none"
        height={rect.height}
        viewBox={`0 0 ${rect.width} ${rect.height}`}
        width={rect.width}
      >
        <rect
          height={rect.height - STROKE}
          rx={CORNER - inset}
          stroke="currentColor"
          strokeWidth={STROKE}
          width={rect.width - STROKE}
          x={inset}
          y={inset}
        />
      </svg>
    </Box>
  );
}

interface CardProps {
  brand: Brand | null;
  number: string;
  expiry: string;
  cvc: string;
  face: Face;
  isMasked: boolean;
  numberRef: RefObject<HTMLParagraphElement | null>;
  expiryRef: RefObject<HTMLDivElement | null>;
  cvcRef: RefObject<HTMLDivElement | null>;
}

function BrandMark({ brand }: { brand: Brand | null }) {
  return (
    <Box minHeight={21} alignItems="end">
      {brand ? (
        <Box key={brand} display="block" motion="enter">
          <Text variant="title" weight="semibold" wrap="nowrap">
            {brand}
          </Text>
        </Box>
      ) : null}
    </Box>
  );
}

function CardFace({
  brand,
  number,
  expiry,
  cvc,
  face,
  isMasked,
  numberRef,
  expiryRef,
  cvcRef,
}: CardProps) {
  if (face === "back") {
    return (
      <Box flexDirection="column" justifyContent="between" flexGrow={1} gap="m">
        <Box
          height={36}
          marginTop="-s"
          marginHorizontal="-l"
          backgroundColor="background-emphasis"
        />
        <Box
          alignItems="center"
          justifyContent="end"
          height={32}
          paddingHorizontal="s"
          backgroundColor="background-card"
          color="text-primary"
          borderRadius="s"
        >
          <Box ref={cvcRef}>
            <Text variant="title" monospace tabularNums wrap="nowrap">
              <Slots length={3} value={cvc} />
            </Text>
          </Box>
        </Box>
        <Box justifyContent="end" width="100%">
          <BrandMark brand={brand} />
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" justifyContent="between" alignItems="start" flexGrow={1}>
      <Box justifyContent="between" alignItems="center" width="100%">
        <Text variant="label" weight="semibold">
          anyglade
        </Text>
        <Contactless />
      </Box>
      <Chip />
      <Text ref={numberRef} variant="heading-xxs" monospace tabularNums wrap="nowrap">
        {[0, 4, 8, 12].map((from) => (
          <Fragment key={from}>
            {from > 0 ? " " : null}
            <Slots from={from} hidden={isMasked ? 12 : 0} length={4} value={number} />
          </Fragment>
        ))}
      </Text>
      <Box justifyContent="between" alignItems="end" width="100%">
        <Box ref={expiryRef} flexDirection="column">
          <Text variant="caption">Expires</Text>
          <Text variant="title" monospace tabularNums wrap="nowrap">
            <Slots length={2} value={expiry} />/<Slots from={2} length={2} value={expiry} />
          </Text>
        </Box>
        <BrandMark brand={brand} />
      </Box>
    </Box>
  );
}

export function CardFormBlock() {
  const root = useRef<HTMLDivElement>(null);
  const shaker = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const success = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLParagraphElement>(null);
  const expiryRef = useRef<HTMLDivElement>(null);
  const cvcRef = useRef<HTMLDivElement>(null);
  const numberInput = useRef<HTMLInputElement>(null);
  const expiryInput = useRef<HTMLInputElement>(null);
  const cvcInput = useRef<HTMLInputElement>(null);

  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [focused, setFocused] = useState<Field | null>(null);
  const [face, setFace] = useState<Face>("front");
  const [linked, setLinked] = useState<string | null>(null);
  const [frame, setFrame] = useState<{ rect: Rect | null }>({ rect: null });
  const [layout, setLayout] = useState({ cardShift: 0, successTop: 0 });
  const [resizes, setResizes] = useState(0);

  const shownFace = useRef<Face>("front");
  const wantedFace = useRef<Face>("front");
  const isTurning = useRef(false);
  const filling = useRef<number | undefined>(undefined);

  const brand = BRANDS[number[0] ?? ""] ?? null;
  const isNumberWrong = number.length === 16 && !passesLuhn(number);
  const dateError = expiryError(expiry);
  const error = isNumberWrong ? "Check the number" : dateError;
  const canLink =
    number.length === 16 && !isNumberWrong && expiry.length === 4 && !dateError && cvc.length === 3;

  /** Turns edge-on with a slight lift, swaps the face out of sight, lands on the other. */
  function turn(next: Face) {
    wantedFace.current = next;
    const element = card.current;
    if (isTurning.current || next === shownFace.current || !element) {
      return;
    }
    isTurning.current = true;
    const direction = next === "back" ? 1 : -1;
    const reduced = isReducedMotion();
    const away = element.animate(
      reduced
        ? [{ opacity: 1 }, { opacity: 0 }]
        : [
            { transform: `${PERSPECTIVE} rotateY(0deg) scale(1)` },
            { transform: `${PERSPECTIVE} rotateY(${90 * direction}deg) scale(1.04)` },
          ],
      { duration: ms("base"), easing: tokens.easings.accelerate, fill: "forwards" },
    );
    void away.finished
      .then(() => {
        shownFace.current = next;
        setFace(next);
        const back = element.animate(
          reduced
            ? [{ opacity: 0 }, { opacity: 1 }]
            : [
                { transform: `${PERSPECTIVE} rotateY(${-90 * direction}deg) scale(1.04)` },
                { transform: `${PERSPECTIVE} rotateY(0deg) scale(1)` },
              ],
          { duration: ms("slow"), easing: tokens.easings.decelerate },
        );
        away.cancel();
        return back.finished;
      })
      .catch(() => undefined)
      .finally(() => {
        isTurning.current = false;
        if (wantedFace.current !== shownFace.current) {
          turn(wantedFace.current);
        }
      });
  }

  function shake() {
    if (isReducedMotion()) {
      return;
    }
    shaker.current?.animate(
      [0, -8, 7, -5, 3, 0].map((x) => ({ transform: `translateX(${x}px)` })),
      { duration: ms("slower"), easing: tokens.easings.standard },
    );
  }

  useEffect(() => {
    turn(focused === "cvc" ? "back" : "front");
  }, [focused]);

  useEffect(() => () => clearInterval(filling.current), []);

  useEffect(() => {
    const element = card.current;
    if (!element) {
      return undefined;
    }
    const observer = new ResizeObserver(() => setResizes((count) => count + 1));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // The frame follows the field in focus and is measured again when the card resizes.
  useLayoutEffect(() => {
    const targets: Record<Field, HTMLElement | null> = {
      number: numberRef.current,
      expiry: expiryRef.current,
      cvc: cvcRef.current,
    };
    const target = focused ? targets[focused] : null;
    if (!target || !card.current) {
      setFrame({ rect: null });
      return;
    }
    setFrame({ rect: offsetWithin(target, card.current) });
  }, [focused, face, resizes]);

  // The saved card shrinks and settles with the confirmation under it, centred in the block.
  useLayoutEffect(() => {
    if (!linked || !root.current || !card.current || !success.current) {
      setLayout({ cardShift: 0, successTop: 0 });
      return;
    }
    const scale = LINKED_SCALE;
    const cardHeight = card.current.offsetHeight;
    const gap = Number.parseFloat(tokens.spacing.l);
    const composition = cardHeight * scale + gap + success.current.offsetHeight;
    const top = Math.max((root.current.offsetHeight - composition) / 2, 0);
    setLayout({
      cardShift: top - (cardHeight * (1 - scale)) / 2,
      successTop: top + cardHeight * scale + gap,
    });
  }, [linked]);

  function blurField(field: Field) {
    // Focus moving between fields blurs one before it focuses the next: wait for it.
    setTimeout(() => {
      const fields = [numberInput.current, expiryInput.current, cvcInput.current];
      if (!fields.includes(document.activeElement as HTMLInputElement)) {
        setFocused((current) => (current === field ? null : current));
      }
    });
  }

  function changeNumber(value: string) {
    clearInterval(filling.current);
    const next = digits(value, 16);
    setNumber(next);
    if (next.length === 16 && number.length < 16) {
      if (passesLuhn(next)) {
        expiryInput.current?.focus();
      } else {
        shake();
      }
    }
  }

  function changeExpiry(value: string) {
    const next = digits(value, 4);
    setExpiry(next);
    if (next.length === 4 && expiry.length < 4 && !expiryError(next)) {
      cvcInput.current?.focus();
    }
  }

  /** Types the test card in, so each digit lands on the card as if by hand. */
  function fillTestNumber() {
    clearInterval(filling.current);
    numberInput.current?.focus();
    if (isReducedMotion()) {
      setNumber(TEST_NUMBER);
      expiryInput.current?.focus();
      return;
    }
    let length = 0;
    setNumber("");
    filling.current = window.setInterval(
      () => {
        length += 1;
        setNumber(TEST_NUMBER.slice(0, length));
        if (length === TEST_NUMBER.length) {
          clearInterval(filling.current);
          expiryInput.current?.focus();
        }
      },
      ms("stagger") / 2,
    );
  }

  async function link() {
    await simulateRequest(1100);
    setLinked(number.slice(-4));
  }

  function reset() {
    setNumber("");
    setExpiry("");
    setCvc("");
    setLinked(null);
    setTimeout(() => numberInput.current?.focus());
  }

  const transition = isReducedMotion() ? "instant" : "slower";

  return (
    <Box
      ref={root}
      position="relative"
      flexDirection="column"
      gap="xl"
      width="100%"
      maxWidth={300}
      marginHorizontal="auto"
    >
      <Box
        display="block"
        width="100%"
        transform={linked ? `translateY(${layout.cardShift}px) scale(${LINKED_SCALE})` : "none"}
        transitionProperty="transform"
        transitionDuration={transition}
        ease="standard"
      >
        <Box ref={shaker} display="block" width="100%">
          <Box
            ref={card}
            aria-hidden
            position="relative"
            flexDirection="column"
            width="100%"
            aspectRatio="1.586 / 1"
            padding="l"
            overflow="hidden"
            borderRadius="l"
            borderWidth={1}
            borderStyle="solid"
            borderColor="border-primary"
            backgroundColor={brand ? "background-inverse" : "background-panel"}
            color={brand ? "text-inverse" : "text-primary"}
            transitionProperty="colors"
            transitionDuration="slow"
            ease="standard"
          >
            <CardFace
              brand={brand}
              cvc={cvc}
              cvcRef={cvcRef}
              expiry={expiry}
              expiryRef={expiryRef}
              face={face}
              isMasked={linked !== null}
              number={number}
              numberRef={numberRef}
            />
            <FocusFrame rect={frame.rect} />
          </Box>
        </Box>
      </Box>

      <Box
        flexDirection="column"
        gap="m"
        width="100%"
        inert={linked !== null}
        opacity={linked ? 0 : 1}
        transitionProperty="opacity"
        transitionDuration="fast"
      >
        <Box flexDirection="column" gap="2xs">
          <TextField isInvalid={isNumberWrong} value={formatNumber(number)} onChange={changeNumber}>
            <Label>Card number</Label>
            <Input
              ref={numberInput}
              autoComplete="cc-number"
              inputMode="numeric"
              placeholder="0000 0000 0000 0000"
              onBlur={() => blurField("number")}
              onFocus={() => setFocused("number")}
            />
          </TextField>
          <Box alignItems="center" justifyContent="between" gap="s" minHeight={32}>
            <Box aria-live="polite" display="block" minWidth={0}>
              <Box key={error ?? "hint"} display="block" motion="fade">
                <Text variant="caption" color={error ? "danger" : "muted"} tabularNums truncate>
                  {error ?? `Test card ${formatNumber(TEST_NUMBER)}`}
                </Text>
              </Box>
            </Box>
            <Button
              isDisabled={number === TEST_NUMBER}
              size="sm"
              variant="ghost"
              onPress={fillTestNumber}
            >
              Paste
            </Button>
          </Box>
        </Box>
        <Box display="grid" gridTemplateColumns="repeat(2, minmax(0, 1fr))" gap="m">
          <TextField
            isInvalid={dateError !== null}
            value={formatExpiry(expiry)}
            onChange={changeExpiry}
          >
            <Label>Expiry</Label>
            <Input
              ref={expiryInput}
              autoComplete="cc-exp"
              inputMode="numeric"
              placeholder="MM/YY"
              onBlur={() => blurField("expiry")}
              onFocus={() => setFocused("expiry")}
            />
          </TextField>
          <TextField value={cvc} onChange={(value) => setCvc(digits(value, 3))}>
            <Label>CVC</Label>
            <Input
              ref={cvcInput}
              autoComplete="cc-csc"
              inputMode="numeric"
              placeholder="000"
              onBlur={() => blurField("cvc")}
              onFocus={() => setFocused("cvc")}
            />
          </TextField>
        </Box>
        <Button fullWidth isDisabled={!canLink} onPress={link}>
          Link card
        </Button>
      </Box>

      {linked ? (
        <Box position="absolute" top={layout.successTop} left={0} width="100%" display="block">
          <Box ref={success} flexDirection="column" alignItems="center" gap="xs" motion="enter">
            <Text color="success" tabularNums>
              Card •• {linked} linked
            </Text>
            <Text variant="caption" color="muted" tabularNums>
              {brand}, valid through {formatExpiry(expiry)}
            </Text>
            <Box display="block" marginTop="s">
              <Button size="sm" variant="ghost" onPress={reset}>
                Link another card
              </Button>
            </Box>
          </Box>
        </Box>
      ) : null}
    </Box>
  );
}

CardFormBlock.displayName = "Card details";

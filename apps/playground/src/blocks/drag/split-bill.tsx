import {
  Avatar,
  Box,
  Button,
  SegmentedControl,
  Text,
  TextSwap,
  ToggleButton,
  tokens,
} from "@anyglade/kit";
import { CircleCheckFill } from "@anyglade/kit/icons";
import { useEffect, useRef, useState } from "react";
import { simulateRequest } from "../../simulate.ts";
import { formatMoney } from "../format.ts";

const people = [
  { id: "me", name: "You", initials: "You", photo: 12 },
  { id: "olya", name: "Emma", initials: "E", photo: 5 },
  { id: "katya", name: "Kate", initials: "K", photo: 32 },
  { id: "dima", name: "Dan", initials: "D", photo: 53 },
] as const;

type PersonId = (typeof people)[number]["id"];
type Person = (typeof people)[number];

const dishes = [
  { id: "khachapuri", name: "Adjarian khachapuri", price: 16 },
  { id: "khinkali", name: "Khinkali, 12 pcs", price: 24 },
  { id: "shashlik", name: "Lamb shashlik", price: 28 },
  { id: "saperavi", name: "Saperavi, bottle", price: 52 },
  { id: "tarkhun", name: "Tarragon soda, jug", price: 14 },
] as const;

type DishId = (typeof dishes)[number]["id"];
type Shares = Record<DishId, readonly PersonId[]>;

/** Who shared what, as the table remembers it: Dan drove, so no wine. */
const initialShares: Shares = {
  khachapuri: ["me", "olya", "katya", "dima"],
  khinkali: ["me", "olya", "dima"],
  shashlik: ["me", "dima"],
  saperavi: ["me", "olya", "katya"],
  tarkhun: ["katya", "dima"],
};

const tipOptions = [
  { id: "0", label: "0%" },
  { id: "5", label: "5%" },
  { id: "10", label: "10%" },
] as const;

type Tip = (typeof tipOptions)[number]["id"];

/** The size of one face on the receipt and of its empty seat. */
/** A seat fills its toggle, so the pressed state shows as the face itself. */
const SEAT = 28;

const ms = (duration: string) => Number.parseFloat(duration);
const isReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const photo = (person: Person) => `https://i.pravatar.cc/80?img=${person.photo}`;

/**
 * Splits every dish between those who shared it, adds the tip in proportion and rounds
 * to whole dollars. The cents lost in rounding stay with the one who pays the restaurant.
 */
function settle(shares: Shares, tip: number) {
  const exact = new Map<PersonId, number>(people.map((person) => [person.id, 0]));
  let subtotal = 0;
  for (const dish of dishes) {
    subtotal += dish.price;
    const eaters = shares[dish.id];
    for (const id of eaters) {
      exact.set(id, (exact.get(id) ?? 0) + dish.price / eaters.length);
    }
  }
  const factor = 1 + tip / 100;
  const total = Math.round(subtotal * factor);
  const owed = new Map<PersonId, number>();
  let friends = 0;
  for (const person of people) {
    if (person.id !== "me") {
      const amount = Math.round((exact.get(person.id) ?? 0) * factor);
      owed.set(person.id, amount);
      friends += amount;
    }
  }
  owed.set("me", total - friends);
  return { total, tipAmount: total - subtotal, owed };
}

function Face({ person, className }: { person: Person; className?: string }) {
  return (
    <Avatar className={className} size="sm">
      <Avatar.Image alt="" src={photo(person)} />
      <Avatar.Fallback>{person.initials}</Avatar.Fallback>
    </Avatar>
  );
}

/** A seat at the dish: a face when the person shared it, an empty dashed place when not. */
function Seat({ person, isTaken }: { person: Person; isTaken: boolean }) {
  return isTaken ? (
    <Box key="taken" display="inline-flex" motion="pop">
      <Face className="size-7" person={person} />
    </Box>
  ) : (
    <Box
      key="empty"
      alignItems="center"
      justifyContent="center"
      width={SEAT}
      height={SEAT}
      borderRadius="full"
      borderWidth={1}
      borderStyle="dashed"
      borderColor="border-control"
      motion="fade"
    >
      <Text variant="caption" color="subtle">
        {person.initials}
      </Text>
    </Box>
  );
}

function DishRow({
  dish,
  eaters,
  isSettled,
  onToggle,
}: {
  dish: (typeof dishes)[number];
  eaters: readonly PersonId[];
  isSettled: boolean;
  onToggle: (person: PersonId) => void;
}) {
  const note =
    eaters.length === 0
      ? { text: "no one marked", color: "warning" as const }
      : eaters.length === 1
        ? { text: "not shared", color: "subtle" as const }
        : {
            text: `${formatMoney(Math.round(dish.price / eaters.length))} each`,
            color: "muted" as const,
          };

  return (
    <Box as="li" display="flex" flexDirection="column" gap="2xs">
      <Box alignItems="baseline" justifyContent="between" gap="m">
        <Text truncate>{dish.name}</Text>
        <Text tabularNums wrap="nowrap">
          {formatMoney(dish.price)}
        </Text>
      </Box>
      <Box alignItems="center" justifyContent="between" gap="m">
        <Box as="fieldset" aria-label={`Who shared: ${dish.name}`} gap="xs">
          {people.map((person) => {
            const isTaken = eaters.includes(person.id);
            return isSettled ? (
              <Box
                key={person.id}
                alignItems="center"
                justifyContent="center"
                width={28}
                height={28}
              >
                {isTaken ? <Face className="size-7" person={person} /> : null}
              </Box>
            ) : (
              <ToggleButton
                key={person.id}
                aria-label={person.name}
                className="size-7"
                isIconOnly
                isSelected={isTaken}
                size="sm"
                variant="ghost"
                onChange={() => onToggle(person.id)}
              >
                <Seat isTaken={isTaken} person={person} />
              </ToggleButton>
            );
          })}
        </Box>
        <Text variant="caption" color={note.color} tabularNums wrap="nowrap">
          {note.text}
        </Text>
      </Box>
    </Box>
  );
}

/** One friend under the receipt: what they owe, and a check once the request is out. */
function Debtor({
  person,
  amount,
  sentOrder,
}: {
  person: Person;
  amount: number;
  sentOrder: number | null;
}) {
  const face = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sentOrder === null) {
      return;
    }
    const timing = {
      duration: ms(tokens.durations.slow),
      delay: sentOrder * ms(tokens.durations.base),
      easing: tokens.easings.decelerate,
      fill: "backwards" as const,
    };
    if (isReducedMotion()) {
      mark.current?.animate([{ opacity: 0 }, { opacity: 1 }], timing);
      return;
    }
    mark.current?.animate(
      [
        { opacity: 0, transform: "scale(0.6)" },
        { opacity: 1, transform: "scale(1.12)", offset: 0.6 },
        { opacity: 1, transform: "scale(1)" },
      ],
      timing,
    );
    face.current?.animate(
      [
        { transform: "translateY(0)" },
        { transform: "translateY(-4px)", offset: 0.4 },
        { transform: "translateY(0)" },
      ],
      { ...timing, fill: "none" },
    );
  }, [sentOrder]);

  return (
    <Box flexDirection="column" alignItems="center" gap="xs" minWidth={0}>
      <Box ref={face} position="relative" display="inline-flex">
        <Face person={person} />
        {sentOrder === null ? null : (
          <Box
            ref={mark}
            position="absolute"
            right={-4}
            bottom={-4}
            display="inline-flex"
            padding="2xs"
            borderRadius="full"
            backgroundColor="background-card"
            color="text-success"
          >
            <CircleCheckFill aria-hidden height={12} width={12} />
          </Box>
        )}
      </Box>
      <Box flexDirection="column" alignItems="center">
        <Text variant="caption" color="muted">
          {person.name}
        </Text>
        <Text variant="title" tabularNums wrap="nowrap">
          {formatMoney(amount)}
        </Text>
      </Box>
    </Box>
  );
}

export function SplitBillBlock() {
  const [shares, setShares] = useState<Shares>(initialShares);
  const [tip, setTip] = useState<Tip>("10");
  const [isSent, setIsSent] = useState(false);
  const { total, tipAmount, owed } = settle(shares, Number(tip));

  const unclaimed = dishes.filter((dish) => shares[dish.id].length === 0);
  const debtors = people.filter((person) => person.id !== "me" && (owed.get(person.id) ?? 0) > 0);
  const canSend = unclaimed.length === 0 && debtors.length > 0;

  function toggle(dish: DishId, person: PersonId) {
    const eaters = shares[dish];
    setShares({
      ...shares,
      [dish]: eaters.includes(person)
        ? eaters.filter((id) => id !== person)
        : people.map((p) => p.id).filter((id) => id === person || eaters.includes(id)),
    });
  }

  async function send() {
    await simulateRequest();
    setIsSent(true);
  }

  function restart() {
    setShares(initialShares);
    setTip("10");
    setIsSent(false);
  }

  const status = isSent
    ? { text: "Requests sent", color: "success" as const }
    : unclaimed.length > 0
      ? { text: "Some items are not marked", color: "warning" as const }
      : debtors.length === 0
        ? { text: "The whole bill is on you", color: "muted" as const }
        : { text: "You pay the restaurant", color: "muted" as const };

  return (
    <Box flexDirection="column" alignItems="center" gap="xl" width="100%" maxWidth={300}>
      <Box
        flexDirection="column"
        gap="l"
        width="100%"
        padding="l"
        backgroundColor="background-panel"
        borderRadius="l"
        boxShadow="l"
      >
        <Box alignItems="baseline" justifyContent="between" gap="m">
          <Text variant="title">Suluguni</Text>
          <Text variant="caption" color="muted" tabularNums>
            Table 7, check #2184
          </Text>
        </Box>

        <Box as="ul" flexDirection="column" gap="m">
          {dishes.map((dish) => (
            <DishRow
              key={dish.id}
              dish={dish}
              eaters={shares[dish.id]}
              isSettled={isSent}
              onToggle={(person) => toggle(dish.id, person)}
            />
          ))}
        </Box>

        <Box
          flexDirection="column"
          gap="s"
          paddingTop="m"
          borderTopWidth={1}
          borderStyle="dashed"
          borderColor="border-control"
        >
          <Box alignItems="center" justifyContent="between" gap="m" minHeight={36}>
            <Text color="muted">Tip</Text>
            {isSent ? (
              <Box display="block" motion="fade">
                <Text color="muted" tabularNums>
                  {tip}%, {formatMoney(tipAmount)}
                </Text>
              </Box>
            ) : (
              <SegmentedControl label="Tip" options={tipOptions} value={tip} onChange={setTip} />
            )}
          </Box>
          <Box alignItems="baseline" justifyContent="between" gap="m">
            <Text variant="title">Total</Text>
            <Text variant="title" tabularNums wrap="nowrap">
              {formatMoney(total)}
            </Text>
          </Box>
        </Box>
      </Box>

      <Box display="grid" gridTemplateColumns="repeat(4, minmax(0, 1fr))" gap="s" width="100%">
        {people.map((person) => {
          const order = debtors.findIndex((debtor) => debtor.id === person.id);
          return (
            <Debtor
              key={person.id}
              amount={owed.get(person.id) ?? 0}
              person={person}
              sentOrder={isSent && order >= 0 ? order : null}
            />
          );
        })}
      </Box>

      <Box flexDirection="column" alignItems="center" gap="m" width="100%">
        <Text aria-live="polite" color={status.color}>
          <TextSwap text={status.text} />
        </Text>
        <Box justifyContent="center" width="100%" minHeight={40}>
          {isSent ? (
            <Box display="block" motion="fade">
              <Button variant="ghost" onPress={restart}>
                Split again
              </Button>
            </Box>
          ) : (
            <Button fullWidth isDisabled={!canSend} onPress={send}>
              Send requests
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}

SplitBillBlock.displayName = "Split the bill";

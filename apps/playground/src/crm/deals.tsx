import {
  Box,
  Button,
  Dropdown,
  Input,
  Label,
  ListBox,
  SegmentedControl,
  Select,
  Text,
  withTransition,
} from "@anyglade/kit";
import { EllipsisVertical } from "@anyglade/kit/icons";
import { useMemo, useState } from "react";
import { formatMoney } from "../blocks/format.ts";
import { STALLED_AFTER_DAYS, stages, type Deal, type StageId } from "./data.ts";
import { formatCompactMoney, pluralize } from "./format.ts";

export type DealsView = "all" | "stalled";
type DealsOrder = "amount" | "idle";

const ALL_OWNERS = "all";

const views: { id: DealsView; label: string }[] = [
  { id: "all", label: "All" },
  { id: "stalled", label: "Stalled" },
];

const orders: { id: DealsOrder; label: string }[] = [
  { id: "amount", label: "By amount" },
  { id: "idle", label: "By idle time" },
];

const isStalled = (deal: Deal) => deal.stage !== "won" && deal.daysInStage >= STALLED_AFTER_DAYS;

interface DealCardProps {
  deal: Deal;
  onMove: (id: string, stage: StageId) => void;
}

function DealCard({ deal, onMove }: DealCardProps) {
  return (
    <Box
      as="li"
      display="flex"
      flexDirection="column"
      gap="s"
      padding="m"
      backgroundColor="background-panel"
      borderRadius="m"
      viewTransitionName={`deal-${deal.id}`}
    >
      <Box alignItems="start" justifyContent="between" gap="xs">
        <Box flexDirection="column" minWidth={0}>
          <Text variant="title">{deal.title}</Text>
          <Text variant="caption" color="muted">
            {deal.company}
          </Text>
        </Box>
        <Dropdown>
          <Button isIconOnly aria-label={`Move ${deal.title}`} size="sm" variant="ghost">
            <EllipsisVertical />
          </Button>
          <Dropdown.Popover>
            <Dropdown.Menu
              aria-label="Deal stage"
              onAction={(key) => onMove(deal.id, key as StageId)}
            >
              {stages
                .filter((stage) => stage.id !== deal.stage)
                .map((stage) => (
                  <Dropdown.Item key={stage.id} id={stage.id} textValue={stage.label}>
                    <Label>{stage.label}</Label>
                  </Dropdown.Item>
                ))}
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      </Box>
      <Box alignItems="baseline" justifyContent="between" gap="s">
        <Text as="span" tabularNums>
          {formatMoney(deal.amount)}
        </Text>
        <Text as="span" variant="caption" color="muted">
          {deal.owner}
        </Text>
      </Box>
      {isStalled(deal) ? (
        <Text variant="caption" color="warning">
          {deal.daysInStage} {pluralize(deal.daysInStage, "day", "days")} idle
        </Text>
      ) : null}
    </Box>
  );
}

interface DealsProps {
  deals: Deal[];
  view: DealsView;
  onViewChange: (view: DealsView) => void;
  onMove: (id: string, stage: StageId) => void;
}

export function Deals({ deals, view, onViewChange, onMove }: DealsProps) {
  const [query, setQuery] = useState("");
  const [owner, setOwner] = useState(ALL_OWNERS);
  const [order, setOrder] = useState<DealsOrder>("amount");

  const owners = useMemo(() => [...new Set(deals.map((deal) => deal.owner))].toSorted(), [deals]);
  const normalized = query.trim().toLowerCase();
  const found = deals
    .filter(
      (deal) =>
        (view === "all" || isStalled(deal)) &&
        (owner === ALL_OWNERS || deal.owner === owner) &&
        `${deal.title} ${deal.company} ${deal.owner}`.toLowerCase().includes(normalized),
    )
    .toSorted((a, b) => (order === "amount" ? b.amount - a.amount : b.daysInStage - a.daysInStage));

  function reset() {
    setQuery("");
    withTransition(() => {
      setOwner(ALL_OWNERS);
      onViewChange("all");
    });
  }

  return (
    <Box flexDirection="column" gap="xl">
      <Box
        flexDirection={{ base: "column", md: "row" }}
        alignItems={{ base: "stretch", md: "center" }}
        justifyContent="between"
        gap="m"
      >
        <Text as="h1" variant="heading-xs" weight="medium">
          Deals
        </Text>
        <Input
          aria-label="Search deals"
          className="w-full md:w-64"
          placeholder="Deal, company or owner"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </Box>
      <Box alignItems="center" flexWrap="wrap" gap="m">
        <SegmentedControl
          label="Deals to show"
          options={views}
          value={view}
          onChange={(next) => withTransition(() => onViewChange(next))}
        />
        <SegmentedControl
          label="Sort deals"
          options={orders}
          value={order}
          onChange={(next) => withTransition(() => setOrder(next))}
        />
        <Select
          aria-label="Owner"
          className="w-48"
          value={owner}
          onChange={(key) => withTransition(() => setOwner(String(key)))}
        >
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              <ListBox.Item id={ALL_OWNERS} textValue="All owners">
                All owners
                <ListBox.ItemIndicator />
              </ListBox.Item>
              {owners.map((name) => (
                <ListBox.Item key={name} id={name} textValue={name}>
                  {name}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
      </Box>
      {found.length === 0 ? (
        <Box flexDirection="column" alignItems="center" gap="m" padding="3xl" textAlign="center">
          <Text color="muted">No matching deals</Text>
          <Button size="sm" variant="secondary" onPress={reset}>
            Reset filters
          </Button>
        </Box>
      ) : (
        <Box
          display="grid"
          gridTemplateColumns="repeat(5, minmax(11.5rem, 1fr))"
          gap="s"
          overflowX="auto"
          paddingBottom="s"
        >
          {stages.map((stage) => {
            const items = found.filter((deal) => deal.stage === stage.id);
            const total = items.reduce((sum, deal) => sum + deal.amount, 0);

            return (
              <Box
                as="section"
                key={stage.id}
                aria-label={stage.label}
                flexDirection="column"
                gap="s"
                padding="s"
                backgroundColor="background-canvas"
                borderRadius="l"
              >
                <Box justifyContent="between" gap="s" paddingHorizontal="xs">
                  <Text as="h2" variant="title">
                    {stage.label}
                  </Text>
                  <Text as="span" variant="caption" color="muted" tabularNums>
                    {formatCompactMoney(total)}
                  </Text>
                </Box>
                <Box as="ul" flexDirection="column" gap="s" minHeight={64}>
                  {items.map((deal) => (
                    <DealCard key={deal.id} deal={deal} onMove={onMove} />
                  ))}
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}

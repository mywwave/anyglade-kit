import { Box, Button, Dropdown, Input, Label, Text } from "@anyglade/kit";
import { EllipsisVertical } from "@anyglade/kit/icons";
import { useState } from "react";
import { STALLED_AFTER_DAYS, stages, type Deal, type StageId } from "./data.ts";
import { formatCompactRubles, pluralize } from "./format.ts";
import { formatRubles } from "../blocks/format.ts";

interface DealCardProps {
  deal: Deal;
  onMove: (id: string, stage: StageId) => void;
}

function DealCard({ deal, onMove }: DealCardProps) {
  const isStalled = deal.stage !== "won" && deal.daysInStage >= STALLED_AFTER_DAYS;

  return (
    <Box
      as="li"
      display="flex"
      flexDirection="column"
      gap="s"
      padding="m"
      backgroundColor="background-panel"
      borderRadius="m"
    >
      <Box alignItems="start" justifyContent="between" gap="xs">
        <Box flexDirection="column" minWidth={0}>
          <Text variant="title">{deal.title}</Text>
          <Text variant="caption" color="muted">
            {deal.company}
          </Text>
        </Box>
        <Dropdown>
          <Button isIconOnly aria-label={`Переместить ${deal.title}`} size="sm" variant="ghost">
            <EllipsisVertical />
          </Button>
          <Dropdown.Popover>
            <Dropdown.Menu
              aria-label="Этап сделки"
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
          {formatRubles(deal.amount)}
        </Text>
        <Text as="span" variant="caption" color="muted">
          {deal.owner}
        </Text>
      </Box>
      {isStalled ? (
        <Text variant="caption" color="warning">
          {deal.daysInStage} {pluralize(deal.daysInStage, "день", "дня", "дней")} без движения
        </Text>
      ) : null}
    </Box>
  );
}

interface DealsProps {
  deals: Deal[];
  onMove: (id: string, stage: StageId) => void;
}

export function Deals({ deals, onMove }: DealsProps) {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const found = deals.filter((deal) =>
    `${deal.title} ${deal.company} ${deal.owner}`.toLowerCase().includes(normalized),
  );

  return (
    <Box flexDirection="column" gap="xl">
      <Box
        flexDirection={{ base: "column", md: "row" }}
        alignItems={{ base: "stretch", md: "center" }}
        justifyContent="between"
        gap="m"
      >
        <Text as="h1" variant="heading-xs" weight="medium">
          Сделки
        </Text>
        <Input
          aria-label="Поиск по сделкам"
          className="w-full md:w-64"
          placeholder="Сделка, компания или менеджер"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </Box>
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
                  {formatCompactRubles(total)}
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
    </Box>
  );
}

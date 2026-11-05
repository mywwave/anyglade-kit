import { Box, Button, Checkbox, Stat, Text, ToggleButton, ToggleButtonGroup } from "@anyglade/kit";
import { DonutChart, LineChart, Sparkline } from "@anyglade/kit/charts";
import { useState } from "react";
import { formatRubles } from "../blocks/format.ts";
import {
  STALLED_AFTER_DAYS,
  revenueByMonth,
  sources,
  stages,
  trends,
  type Deal,
  type Task,
} from "./data.ts";
import { formatCompactRubles, pluralize } from "./format.ts";

const periods = {
  half: { label: "6 месяцев", months: 6 },
  year: { label: "12 месяцев", months: 12 },
};

type Period = keyof typeof periods;

const periodNames = Object.keys(periods) as Period[];

interface OverviewProps {
  deals: Deal[];
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onOpenDeals: () => void;
}

export function Overview({ deals, tasks, onToggleTask, onOpenDeals }: OverviewProps) {
  const [period, setPeriod] = useState<Period>("half");

  const open = deals.filter((deal) => deal.stage !== "won");
  const won = deals.filter((deal) => deal.stage === "won");
  const stalled = open.filter((deal) => deal.daysInStage >= STALLED_AFTER_DAYS);
  const atRisk = stalled.reduce((sum, deal) => sum + deal.amount, 0);
  const wonTotal = won.reduce((sum, deal) => sum + deal.amount, 0);
  const openTotal = open.reduce((sum, deal) => sum + deal.amount, 0);
  const today = tasks.filter((task) => task.group === "today");

  const funnel = stages.map((stage) => {
    const items = deals.filter((deal) => deal.stage === stage.id);
    return {
      ...stage,
      count: items.length,
      total: items.reduce((sum, deal) => sum + deal.amount, 0),
    };
  });
  const maxStage = Math.max(...funnel.map((stage) => stage.total), 1);

  return (
    <Box flexDirection="column" gap="3xl">
      <Box
        flexDirection={{ base: "column", lg: "row" }}
        alignItems={{ base: "start", lg: "end" }}
        justifyContent="between"
        gap="l"
      >
        <Box display="block" maxWidth={640}>
          <Text as="h1" variant="heading-m">
            {stalled.length === 0
              ? "Все сделки движутся"
              : `${stalled.length} ${pluralize(stalled.length, "сделка застряла", "сделки застряли", "сделок застряло")}`}
          </Text>
          <Text as="p" variant="heading-m" color="muted">
            {stalled.length === 0
              ? "Рисков на сегодня нет"
              : `${formatCompactRubles(atRisk)} под риском`}
          </Text>
        </Box>
        {stalled.length > 0 ? (
          <Button variant="secondary" onPress={onOpenDeals}>
            Открыть сделки
          </Button>
        ) : null}
      </Box>

      <Box
        display="grid"
        gridTemplateColumns={{ base: "repeat(2, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))" }}
        gap="xl"
      >
        <Box flexDirection="column" gap="s" minWidth={0}>
          <Stat label="Выиграно" value={formatCompactRubles(wonTotal)} />
          <Sparkline label="Динамика выигранных сделок" values={trends.revenue} />
        </Box>
        <Box flexDirection="column" gap="s" minWidth={0}>
          <Stat label="В работе" value={formatCompactRubles(openTotal)} />
          <Sparkline label="Динамика сделок в работе" values={trends.deals} />
        </Box>
        <Box flexDirection="column" gap="s" minWidth={0}>
          <Stat label="Конверсия" value="31%" />
          <Sparkline label="Динамика конверсии" values={trends.conversion} />
        </Box>
        <Box flexDirection="column" gap="s" minWidth={0}>
          <Stat label="Цикл сделки" value="26 дней" />
          <Sparkline label="Динамика цикла сделки" values={trends.cycle} />
        </Box>
      </Box>

      <Box
        display="grid"
        gridTemplateColumns={{ base: "minmax(0, 1fr)", lg: "minmax(0, 2fr) minmax(0, 1fr)" }}
        gap="2xl"
      >
        <Box flexDirection="column" gap="l" minWidth={0}>
          <Box alignItems="center" justifyContent="between" gap="m" flexWrap="wrap">
            <Text as="h2" variant="heading-xxs">
              Выручка и план
            </Text>
            <ToggleButtonGroup
              aria-label="Период"
              disallowEmptySelection
              selectedKeys={new Set([period])}
              selectionMode="single"
              size="sm"
              onSelectionChange={(keys) => {
                const [key] = keys;
                setPeriod(key as Period);
              }}
            >
              {periodNames.map((name) => (
                <ToggleButton key={name} id={name}>
                  {periods[name].label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
          <LineChart
            label="Выручка и план по месяцам"
            data={revenueByMonth.slice(-periods[period].months)}
            format={formatRubles}
            height={260}
            series={[
              { dataKey: "revenue", label: "Выручка" },
              { dataKey: "plan", label: "План" },
            ]}
            xKey="month"
          />
        </Box>
        <Box flexDirection="column" gap="l" minWidth={0}>
          <Text as="h2" variant="heading-xxs">
            Воронка
          </Text>
          <Box as="ul" flexDirection="column" gap="m">
            {funnel.map((stage) => (
              <Box as="li" key={stage.id} display="flex" flexDirection="column" gap="xs">
                <Box justifyContent="between" gap="m">
                  <Text as="span" color="muted">
                    {stage.label}, {stage.count}
                  </Text>
                  <Text as="span" tabularNums>
                    {formatCompactRubles(stage.total)}
                  </Text>
                </Box>
                <Box
                  height={4}
                  width={`${Math.max((stage.total / maxStage) * 100, 2)}%`}
                  backgroundColor="background-inverse"
                  borderRadius="full"
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <Box
        display="grid"
        gridTemplateColumns={{ base: "minmax(0, 1fr)", lg: "minmax(0, 2fr) minmax(0, 1fr)" }}
        gap="2xl"
      >
        <Box flexDirection="column" gap="l" minWidth={0}>
          <Text as="h2" variant="heading-xxs">
            Задачи на сегодня
          </Text>
          <Box flexDirection="column" gap="m">
            {today.map((task) => (
              <Checkbox
                key={task.id}
                isSelected={task.isDone}
                name={task.id}
                onChange={() => onToggleTask(task.id)}
              >
                <Checkbox.Content>
                  <Checkbox.Control>
                    <Checkbox.Indicator />
                  </Checkbox.Control>
                  <Text
                    as="span"
                    lineThrough={task.isDone}
                    color={task.isDone ? "muted" : "inherit"}
                  >
                    {task.title}, {task.company}
                  </Text>
                </Checkbox.Content>
              </Checkbox>
            ))}
          </Box>
        </Box>
        <Box flexDirection="column" gap="l" minWidth={0}>
          <Text as="h2" variant="heading-xxs">
            Источники
          </Text>
          <DonutChart
            label="Источники сделок"
            center={`${sources[0].value}%`}
            data={sources}
            format={(value) => `${value}%`}
            height={160}
          />
        </Box>
      </Box>
    </Box>
  );
}

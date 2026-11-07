import { Box, Button, Checkbox, SegmentedControl, Stat, Text } from "@anyglade/kit";
import { DonutChart, LineChart, Sparkline } from "@anyglade/kit/charts";
import { useState } from "react";
import { formatMoney } from "../blocks/format.ts";
import {
  STALLED_AFTER_DAYS,
  revenueByMonth,
  sources,
  stages,
  trends,
  type Deal,
  type Task,
} from "./data.ts";
import { formatCompactMoney, pluralize } from "./format.ts";

const periods = [
  { id: "half", label: "6 months" },
  { id: "year", label: "12 months" },
] as const;

type Period = (typeof periods)[number]["id"];

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
  const months = period === "half" ? 6 : 12;
  const conversion = deals.length === 0 ? 0 : Math.round((won.length / deals.length) * 100);

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
              ? "Every deal is moving"
              : `${stalled.length} ${pluralize(stalled.length, "deal is stalled", "deals are stalled")}`}
          </Text>
          <Text as="p" variant="heading-m" color="muted">
            {stalled.length === 0 ? "No risks today" : `${formatCompactMoney(atRisk)} at risk`}
          </Text>
        </Box>
        {stalled.length > 0 ? <Button onPress={onOpenDeals}>Open deals</Button> : null}
      </Box>

      <Box
        display="grid"
        gridTemplateColumns={{ base: "repeat(2, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))" }}
        gap="xl"
      >
        <Box flexDirection="column" gap="s" minWidth={0}>
          <Stat label="Won" value={formatCompactMoney(wonTotal)} />
          <Sparkline label="Won deals trend" values={trends.revenue} />
        </Box>
        <Box flexDirection="column" gap="s" minWidth={0}>
          <Stat label="In progress" value={formatCompactMoney(openTotal)} />
          <Sparkline label="Deals in progress trend" values={trends.deals} />
        </Box>
        <Box flexDirection="column" gap="s" minWidth={0}>
          <Stat label="Conversion" value={`${conversion}%`} />
          <Sparkline label="Conversion trend" values={trends.conversion} />
        </Box>
        <Box flexDirection="column" gap="s" minWidth={0}>
          <Stat label="Sales cycle" value="26 days" />
          <Sparkline label="Sales cycle trend" values={trends.cycle} />
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
              Revenue vs. target
            </Text>
            <SegmentedControl
              label="Period"
              options={periods}
              value={period}
              onChange={setPeriod}
            />
          </Box>
          <LineChart
            label="Monthly revenue vs. target"
            data={revenueByMonth.slice(-months)}
            format={formatMoney}
            height={260}
            series={[
              { dataKey: "revenue", label: "Revenue" },
              { dataKey: "plan", label: "Target" },
            ]}
            xKey="month"
          />
        </Box>
        <Box flexDirection="column" gap="l" minWidth={0}>
          <Text as="h2" variant="heading-xxs">
            Pipeline
          </Text>
          <Box as="ul" flexDirection="column" gap="m">
            {funnel.map((stage) => (
              <Box as="li" key={stage.id} display="flex" flexDirection="column" gap="xs">
                <Box justifyContent="between" gap="m">
                  <Text as="span" color="muted">
                    {stage.label}, {stage.count}
                  </Text>
                  <Text as="span" tabularNums>
                    {formatCompactMoney(stage.total)}
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
            Tasks for today
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
            Sources
          </Text>
          <DonutChart
            label="Deal sources"
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

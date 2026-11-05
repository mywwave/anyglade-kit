import {
  Avatar,
  Box,
  SegmentedControl,
  SortableColumn,
  Table,
  Text,
  useTableSort,
  type SortAccessors,
} from "@anyglade/kit";
import { AreaChart, BarChart } from "@anyglade/kit/charts";
import { useState } from "react";
import { formatRubles } from "../blocks/format.ts";
import { activityByWeekday, dealsByMonth, managers, pipelineByWeek, weekdays } from "./data.ts";

type Manager = (typeof managers)[number];
type Period = "quarter" | "half";

const periods: { id: Period; label: string }[] = [
  { id: "quarter", label: "3 месяца" },
  { id: "half", label: "6 месяцев" },
];

const managerAccessors: SortAccessors<Manager> = {
  name: (manager) => manager.name,
  won: (manager) => manager.won,
  conversion: (manager) => manager.conversion,
};

const twoColumns = { base: "minmax(0, 1fr)", lg: "repeat(2, minmax(0, 1fr))" };

function activityColor(level: number) {
  if (level >= 5) return "background-inverse";
  if (level >= 3) return "background-emphasis";
  return "background-card";
}

export function Analytics() {
  const [period, setPeriod] = useState<Period>("half");
  const span = period === "quarter" ? -3 : 0;
  const { sorted, tableProps } = useTableSort(managers, managerAccessors, {
    column: "won",
    direction: "descending",
  });

  return (
    <Box flexDirection="column" gap="3xl">
      <Box alignItems="center" justifyContent="between" flexWrap="wrap" gap="m">
        <Text as="h1" variant="heading-xs" weight="medium">
          Аналитика
        </Text>
        <SegmentedControl label="Период" options={periods} value={period} onChange={setPeriod} />
      </Box>
      <Box display="grid" gridTemplateColumns={twoColumns} gap="2xl">
        <Box flexDirection="column" gap="l" minWidth={0}>
          <Text as="h2" variant="heading-xxs">
            Исход сделок
          </Text>
          <BarChart
            stacked
            data={dealsByMonth.slice(span)}
            label="Выигранные и проигранные сделки по месяцам"
            series={[
              { dataKey: "won", label: "Выиграно" },
              { dataKey: "lost", label: "Проиграно" },
            ]}
            xKey="month"
          />
        </Box>
        <Box flexDirection="column" gap="l" minWidth={0}>
          <Text as="h2" variant="heading-xxs">
            Входящие заявки
          </Text>
          <AreaChart
            data={pipelineByWeek.slice(span)}
            label="Входящие и квалифицированные заявки по неделям"
            series={[
              { dataKey: "qualified", label: "Квалифицировано" },
              { dataKey: "incoming", label: "Остальные" },
            ]}
            xKey="week"
          />
        </Box>
      </Box>
      <Box display="grid" gridTemplateColumns={twoColumns} gap="2xl">
        <Box flexDirection="column" gap="l" minWidth={0}>
          <Text as="h2" variant="heading-xxs">
            Менеджеры
          </Text>
          <Table>
            <Table.ScrollContainer>
              <Table.Content
                aria-label="Результаты менеджеров"
                className="min-w-100"
                {...tableProps}
              >
                <Table.Header>
                  <SortableColumn isRowHeader id="name">
                    Менеджер
                  </SortableColumn>
                  <SortableColumn id="won">Выиграно</SortableColumn>
                  <SortableColumn id="conversion">Конверсия</SortableColumn>
                </Table.Header>
                <Table.Body>
                  {sorted.map((manager) => (
                    <Table.Row
                      key={manager.name}
                      id={manager.name}
                      style={{ viewTransitionName: `manager-${manager.name}` }}
                    >
                      <Table.Cell>
                        <Box alignItems="center" gap="s">
                          <Avatar size="sm">
                            <Avatar.Image alt={manager.name} src={manager.image} />
                            <Avatar.Fallback>{manager.name.charAt(0)}</Avatar.Fallback>
                          </Avatar>
                          <Text as="span">{manager.name}</Text>
                        </Box>
                      </Table.Cell>
                      <Table.Cell>
                        <Text as="span" tabularNums>
                          {formatRubles(manager.won)}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text as="span" tabularNums>
                          {manager.conversion}%
                        </Text>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
        </Box>
        <Box flexDirection="column" gap="l" minWidth={0}>
          <Text as="h2" variant="heading-xxs">
            Активность команды
          </Text>
          <Box
            as="figure"
            margin="none"
            aria-label="Активность команды по дням недели за шесть недель"
            display="grid"
            gridTemplateColumns="repeat(7, minmax(0, 1fr))"
            gap="xs"
          >
            {weekdays.map((day) => (
              <Text key={day} as="span" variant="caption" color="muted" align="center">
                {day}
              </Text>
            ))}
            {activityByWeekday.flatMap((week, weekIndex) =>
              week.map((level, dayIndex) => (
                <Box
                  key={`${weekIndex}-${dayIndex}`}
                  aspectRatio="2 / 1"
                  backgroundColor={activityColor(level)}
                  borderRadius="s"
                />
              )),
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

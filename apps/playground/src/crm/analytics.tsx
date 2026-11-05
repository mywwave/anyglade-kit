import { Avatar, Box, Table, Text } from "@anyglade/kit";
import { AreaChart, BarChart } from "@anyglade/kit/charts";
import { formatRubles } from "../blocks/format.ts";
import { activityByWeekday, dealsByMonth, managers, pipelineByWeek, weekdays } from "./data.ts";

const twoColumns = { base: "minmax(0, 1fr)", lg: "repeat(2, minmax(0, 1fr))" };

function activityColor(level: number) {
  if (level >= 5) return "background-inverse";
  if (level >= 3) return "background-emphasis";
  return "background-card";
}

export function Analytics() {
  return (
    <Box flexDirection="column" gap="3xl">
      <Text as="h1" variant="heading-xs" weight="medium">
        Аналитика
      </Text>
      <Box display="grid" gridTemplateColumns={twoColumns} gap="2xl">
        <Box flexDirection="column" gap="l" minWidth={0}>
          <Text as="h2" variant="heading-xxs">
            Исход сделок
          </Text>
          <BarChart
            stacked
            data={dealsByMonth}
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
            data={pipelineByWeek}
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
              <Table.Content aria-label="Результаты менеджеров" className="min-w-100">
                <Table.Header>
                  <Table.Column isRowHeader>Менеджер</Table.Column>
                  <Table.Column>Выиграно</Table.Column>
                  <Table.Column>Конверсия</Table.Column>
                </Table.Header>
                <Table.Body>
                  {managers.map((manager) => (
                    <Table.Row key={manager.name}>
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

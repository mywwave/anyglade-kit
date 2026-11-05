/* oxlint-disable jsx-a11y/prefer-tag-over-role -- an inline SVG chart needs role="img" to expose its label */
import { Box, ListBox, Text } from "@anyglade/kit";
import { useState } from "react";
import { formatRubles } from "../format.ts";

const metrics = [
  {
    id: "revenue",
    label: "Выручка",
    value: formatRubles(1848885),
    note: "На 18% больше прошлого месяца",
    series: [212, 228, 219, 246, 261, 254, 280, 296, 288, 312, 330, 322, 351, 374, 366, 398],
  },
  {
    id: "customers",
    label: "Новые клиенты",
    value: "1 204",
    note: "На 6% больше прошлого месяца",
    series: [31, 34, 33, 36, 35, 38, 37, 41, 40, 39, 43, 42, 44, 46, 45, 47],
  },
  {
    id: "churn",
    label: "Отток",
    value: "2,1%",
    note: "На 0,4 пункта меньше прошлого месяца",
    series: [3.1, 3, 3, 2.9, 2.8, 2.8, 2.7, 2.6, 2.6, 2.5, 2.4, 2.4, 2.3, 2.2, 2.2, 2.1],
  },
];

const CHART_WIDTH = 640;
const CHART_HEIGHT = 200;
const CHART_INSET = 8;

function linePath(values: number[]) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const step = CHART_WIDTH / (values.length - 1);
  const drawable = CHART_HEIGHT - CHART_INSET * 2;
  const points = values.map((value, index) => {
    const y = CHART_HEIGHT - CHART_INSET - ((value - min) / (max - min)) * drawable;
    return `${index * step},${y.toFixed(1)}`;
  });
  return `M${points.join(" L")}`;
}

export function MetricsBlock() {
  const [selectedId, setSelectedId] = useState("revenue");
  const selected = metrics.find((metric) => metric.id === selectedId) ?? metrics[0];

  if (!selected) {
    return null;
  }

  return (
    <Box
      display="grid"
      gridTemplateColumns={{ base: "minmax(0, 1fr)", md: "minmax(0, 5fr) minmax(0, 2fr)" }}
      gap="2xl"
      padding={{ base: "l", md: "2xl" }}
    >
      <Box flexDirection="column" gap="xl" minWidth={0}>
        <Box flexDirection="column" gap="xs">
          <Text color="muted">{selected.label} за 30 дней</Text>
          <Text as="p" variant="heading-l" tabularNums>
            {selected.value}
          </Text>
          <Text color="muted">{selected.note}</Text>
        </Box>
        <Box display="block" color="text-primary">
          <svg
            role="img"
            aria-label={`${selected.label} за 30 дней`}
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            width="100%"
            height={CHART_HEIGHT}
            preserveAspectRatio="none"
          >
            <path
              d={linePath(selected.series)}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </Box>
      </Box>
      <ListBox
        aria-label="Показатель"
        disallowEmptySelection
        selectedKeys={new Set([selectedId])}
        selectionMode="single"
        onSelectionChange={(keys) => {
          const [key] = keys === "all" ? [] : keys;
          if (typeof key === "string") {
            setSelectedId(key);
          }
        }}
      >
        {metrics.map((metric) => (
          <ListBox.Item key={metric.id} id={metric.id} textValue={metric.label}>
            <Box flexDirection="column" minWidth={0}>
              <Text as="span" variant="caption" color="muted">
                {metric.label}
              </Text>
              <Text as="span" variant="title" tabularNums>
                {metric.value}
              </Text>
            </Box>
          </ListBox.Item>
        ))}
      </ListBox>
    </Box>
  );
}

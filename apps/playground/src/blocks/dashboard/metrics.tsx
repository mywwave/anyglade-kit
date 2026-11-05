import { Box, Frame, FrameTile, Stat } from "@anyglade/kit";
import { AreaChart } from "../area-chart.tsx";
import { formatRubles, revenueByDay } from "../format.ts";

const stats = [
  { label: "Выручка", value: formatRubles(1848885), note: "+18% за месяц" },
  { label: "Новые клиенты", value: "1 204", note: "+6% за месяц" },
  { label: "Отток", value: "2,1%", note: "−0,4 п.п. за месяц" },
  { label: "Средний чек", value: formatRubles(1996), note: "Без изменений" },
];

export function MetricsBlock() {
  return (
    <Box flexDirection="column" gap="xs" padding={{ base: "l", md: "xl" }}>
      <Frame title="Сводка" meta="Последние 30 дней">
        <Box
          display="grid"
          gridTemplateColumns={{
            base: "repeat(2, minmax(0, 1fr))",
            md: "repeat(4, minmax(0, 1fr))",
          }}
          gap="xs"
        >
          {stats.map((stat) => (
            <FrameTile key={stat.label}>
              <Stat label={stat.label} value={stat.value} note={stat.note} />
            </FrameTile>
          ))}
        </Box>
        <FrameTile>
          <Stat label="Выручка по дням" value={formatRubles(46800)} note="Сегодня" />
          <AreaChart label="Выручка по дням за 20 дней" values={revenueByDay} height={160} />
        </FrameTile>
      </Frame>
    </Box>
  );
}

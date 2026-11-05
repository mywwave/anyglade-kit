import { Box } from "@anyglade/kit";
import { AreaChart, BarChart, DonutChart, LineChart, Sparkline } from "@anyglade/kit/charts";

const data = [
  { month: "Июн", won: 12, lost: 4, plan: 14 },
  { month: "Июл", won: 16, lost: 5, plan: 15 },
  { month: "Авг", won: 14, lost: 7, plan: 16 },
  { month: "Сен", won: 21, lost: 6, plan: 18 },
  { month: "Окт", won: 24, lost: 5, plan: 20 },
];

export function ChartsDemo() {
  return (
    <Box
      display="grid"
      gridTemplateColumns={{ base: "minmax(0, 1fr)", md: "repeat(2, minmax(0, 1fr))" }}
      gap="2xl"
    >
      <LineChart
        label="Сделки и план по месяцам"
        data={data}
        xKey="month"
        series={[
          { dataKey: "won", label: "Выиграно" },
          { dataKey: "plan", label: "План" },
        ]}
      />
      <BarChart
        stacked
        label="Выигранные и проигранные сделки"
        data={data}
        xKey="month"
        series={[
          { dataKey: "won", label: "Выиграно" },
          { dataKey: "lost", label: "Проиграно" },
        ]}
      />
      <AreaChart
        label="Выигранные сделки"
        data={data}
        xKey="month"
        series={[{ dataKey: "won", label: "Выиграно" }]}
      />
      <DonutChart
        label="Источники сделок"
        center="48%"
        data={[
          { label: "Сайт", value: 48 },
          { label: "Рекомендации", value: 32 },
          { label: "Реклама", value: 20 },
        ]}
      />
      <Sparkline label="Тренд сделок" values={data.map((item) => item.won)} />
    </Box>
  );
}

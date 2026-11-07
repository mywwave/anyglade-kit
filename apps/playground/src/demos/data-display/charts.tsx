import { Box } from "@anyglade/kit";
import { AreaChart, BarChart, DonutChart, LineChart, Sparkline } from "@anyglade/kit/charts";

const data = [
  { month: "Jun", won: 12, lost: 4, plan: 14 },
  { month: "Jul", won: 16, lost: 5, plan: 15 },
  { month: "Aug", won: 14, lost: 7, plan: 16 },
  { month: "Sep", won: 21, lost: 6, plan: 18 },
  { month: "Oct", won: 24, lost: 5, plan: 20 },
];

export function ChartsDemo() {
  return (
    <Box
      display="grid"
      gridTemplateColumns={{ base: "minmax(0, 1fr)", md: "repeat(2, minmax(0, 1fr))" }}
      gap="2xl"
    >
      <LineChart
        label="Monthly deals vs. target"
        data={data}
        xKey="month"
        series={[
          { dataKey: "won", label: "Won" },
          { dataKey: "plan", label: "Target" },
        ]}
      />
      <BarChart
        stacked
        label="Won and lost deals"
        data={data}
        xKey="month"
        series={[
          { dataKey: "won", label: "Won" },
          { dataKey: "lost", label: "Lost" },
        ]}
      />
      <AreaChart
        label="Won deals"
        data={data}
        xKey="month"
        series={[{ dataKey: "won", label: "Won" }]}
      />
      <DonutChart
        label="Deal sources"
        center="48%"
        data={[
          { label: "Website", value: 48 },
          { label: "Referrals", value: 32 },
          { label: "Ads", value: 20 },
        ]}
      />
      <Sparkline label="Deals trend" values={data.map((item) => item.won)} />
    </Box>
  );
}

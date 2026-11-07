import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vite-plus/test";
import { DonutChart, LineChart, Sparkline } from "../src/charts.ts";

const data = [
  { month: "Jan", revenue: 10, plan: 12 },
  { month: "Feb", revenue: 14, plan: 13 },
];

test("LineChart labels the figure and shows a legend for several series", () => {
  const html = renderToStaticMarkup(
    <LineChart
      label="Revenue"
      data={data}
      xKey="month"
      series={[
        { dataKey: "revenue", label: "Actual" },
        { dataKey: "plan", label: "Target" },
      ]}
    />,
  );

  expect(html).toContain('aria-label="Revenue"');
  expect(html).toContain("Actual");
  expect(html).toContain("Target");
});

test("LineChart hides the legend for a single series", () => {
  const html = renderToStaticMarkup(
    <LineChart
      label="Revenue"
      data={data}
      xKey="month"
      series={[{ dataKey: "revenue", label: "Actual" }]}
    />,
  );

  expect(html).not.toContain("Actual");
});

test("DonutChart renders the center and every slice in the legend", () => {
  const html = renderToStaticMarkup(
    <DonutChart
      label="Channels"
      center="48%"
      data={[
        { label: "Website", value: 48 },
        { label: "Referrals", value: 32 },
      ]}
    />,
  );

  expect(html).toContain("48%");
  expect(html).toContain("Referrals");
});

test("Sparkline labels the figure", () => {
  expect(renderToStaticMarkup(<Sparkline label="Trend" values={[1, 2, 3]} />)).toContain(
    'aria-label="Trend"',
  );
});

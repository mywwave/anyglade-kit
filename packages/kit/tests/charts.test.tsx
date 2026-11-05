import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vite-plus/test";
import { DonutChart, LineChart, Sparkline } from "../src/charts.ts";

const data = [
  { month: "Янв", revenue: 10, plan: 12 },
  { month: "Фев", revenue: 14, plan: 13 },
];

test("LineChart labels the figure and shows a legend for several series", () => {
  const html = renderToStaticMarkup(
    <LineChart
      label="Выручка"
      data={data}
      xKey="month"
      series={[
        { dataKey: "revenue", label: "Факт" },
        { dataKey: "plan", label: "План" },
      ]}
    />,
  );

  expect(html).toContain('aria-label="Выручка"');
  expect(html).toContain("Факт");
  expect(html).toContain("План");
});

test("LineChart hides the legend for a single series", () => {
  const html = renderToStaticMarkup(
    <LineChart
      label="Выручка"
      data={data}
      xKey="month"
      series={[{ dataKey: "revenue", label: "Факт" }]}
    />,
  );

  expect(html).not.toContain("Факт");
});

test("DonutChart renders the center and every slice in the legend", () => {
  const html = renderToStaticMarkup(
    <DonutChart
      label="Источники"
      center="48%"
      data={[
        { label: "Сайт", value: 48 },
        { label: "Рекомендации", value: 32 },
      ]}
    />,
  );

  expect(html).toContain("48%");
  expect(html).toContain("Рекомендации");
});

test("Sparkline labels the figure", () => {
  expect(renderToStaticMarkup(<Sparkline label="Тренд" values={[1, 2, 3]} />)).toContain(
    'aria-label="Тренд"',
  );
});

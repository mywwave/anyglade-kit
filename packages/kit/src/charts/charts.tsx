"use client";

import type { ReactNode } from "react";
import {
  Area,
  AreaChart as RechartsAreaChart,
  Bar,
  BarChart as RechartsBarChart,
  Cell,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";
import { Box } from "../box/box.tsx";
import { Text } from "../text/text.tsx";

const SPARKLINE_COLOR = "var(--ag-text-secondary)";

const SERIES_COLORS = [
  "var(--ag-chart-primary)",
  "var(--ag-chart-secondary)",
  "var(--ag-chart-tertiary)",
];

const AXIS_TICK = { fill: "var(--ag-text-secondary)", fontSize: 12 };
const CHART_MARGIN = { top: 8, right: 8, bottom: 0, left: 8 };

type ChartValue = string | number;
type ChartDatum = Record<string, ChartValue>;
type Formatter = (value: number) => string;

export interface ChartSeries {
  /** Field of each data item that holds the value. */
  dataKey: string;
  label: string;
}

/** Limited to three series: more cannot be told apart in a monochrome palette. */
type SeriesList = readonly [ChartSeries, ChartSeries?, ChartSeries?];

interface CartesianChartProps {
  /** Accessible description of what the chart shows. */
  label: string;
  data: readonly ChartDatum[];
  /** Field of each data item used for the horizontal axis. */
  xKey: string;
  series: SeriesList;
  format?: Formatter;
  height?: number;
}

const defined = (series: SeriesList) => series.filter((item) => item !== undefined);

function asNumber(value: unknown) {
  return typeof value === "number" ? value : Number(value);
}

function ChartTooltip({
  active,
  payload,
  label,
  format,
}: TooltipContentProps & { format: Formatter }) {
  if (!active || payload.length === 0) {
    return null;
  }

  return (
    <Box
      flexDirection="column"
      gap="xs"
      paddingHorizontal="m"
      paddingVertical="s"
      backgroundColor="background-card"
      borderRadius="s"
      boxShadow="m"
    >
      {label === undefined ? null : (
        <Text variant="caption" color="muted">
          {String(label)}
        </Text>
      )}
      {payload.map((item) => (
        <Box key={String(item.dataKey)} justifyContent="between" gap="l">
          <Text as="span" variant="caption">
            {item.name}
          </Text>
          <Text as="span" variant="caption" tabularNums>
            {format(asNumber(item.value))}
          </Text>
        </Box>
      ))}
    </Box>
  );
}

function ChartLegend({ series }: { series: SeriesList }) {
  const items = defined(series);

  if (items.length < 2) {
    return null;
  }

  return (
    <Box flexWrap="wrap" columnGap="l" rowGap="xs">
      {items.map((item, index) => (
        <Box key={item.dataKey} alignItems="center" gap="s">
          <svg aria-hidden width={8} height={8}>
            <circle cx={4} cy={4} r={4} fill={SERIES_COLORS[index]} />
          </svg>
          <Text as="span" variant="caption" color="muted">
            {item.label}
          </Text>
        </Box>
      ))}
    </Box>
  );
}

interface ChartFrameProps {
  label: string;
  height: number;
  series?: SeriesList;
  children: ReactNode;
}

function ChartFrame({ label, height, series, children }: ChartFrameProps) {
  return (
    <Box flexDirection="column" gap="m" minWidth={0} width="100%">
      <Box
        as="figure"
        display="block"
        aria-label={label}
        margin="none"
        width="100%"
        height={height}
      >
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </Box>
      {series ? <ChartLegend series={series} /> : null}
    </Box>
  );
}

const defaultFormat: Formatter = (value) => value.toLocaleString("ru-RU");

function axes(xKey: string) {
  return [
    <XAxis
      key="x"
      axisLine={false}
      dataKey={xKey}
      interval="preserveStartEnd"
      minTickGap={24}
      tick={AXIS_TICK}
      tickLine={false}
      tickMargin={8}
    />,
    <YAxis key="y" hide domain={["auto", "auto"]} />,
  ];
}

/** Trends over time. The first series is the main one, the rest are comparisons. */
export function LineChart({
  label,
  data,
  xKey,
  series,
  format = defaultFormat,
  height = 240,
}: CartesianChartProps) {
  const [main, ...comparisons] = defined(series);

  return (
    <ChartFrame label={label} height={height} series={series}>
      <RechartsLineChart data={[...data]} margin={CHART_MARGIN}>
        {axes(xKey)}
        <Tooltip
          content={(props) => <ChartTooltip {...props} format={format} />}
          cursor={{ stroke: "var(--ag-border-primary)" }}
        />
        {comparisons.map(
          (item, index) =>
            item && (
              <Line
                key={item.dataKey}
                dataKey={item.dataKey}
                dot={false}
                isAnimationActive={false}
                name={item.label}
                stroke={SERIES_COLORS[index + 1]}
                strokeDasharray="4 4"
                strokeWidth={1.5}
                type="monotone"
              />
            ),
        )}
        {main ? (
          <Line
            dataKey={main.dataKey}
            dot={false}
            isAnimationActive={false}
            name={main.label}
            stroke={SERIES_COLORS[0]}
            strokeWidth={2}
            type="monotone"
          />
        ) : null}
      </RechartsLineChart>
    </ChartFrame>
  );
}

/** Accumulated volume over time. */
export function AreaChart({
  label,
  data,
  xKey,
  series,
  format = defaultFormat,
  height = 240,
}: CartesianChartProps) {
  return (
    <ChartFrame label={label} height={height} series={series}>
      <RechartsAreaChart data={[...data]} margin={CHART_MARGIN}>
        {axes(xKey)}
        <Tooltip
          content={(props) => <ChartTooltip {...props} format={format} />}
          cursor={{ stroke: "var(--ag-border-primary)" }}
        />
        {defined(series).map((item, index) => (
          <Area
            key={item.dataKey}
            dataKey={item.dataKey}
            fill={SERIES_COLORS[index]}
            fillOpacity={0.12}
            isAnimationActive={false}
            name={item.label}
            stackId="stack"
            stroke={SERIES_COLORS[index]}
            strokeWidth={1.5}
            type="monotone"
          />
        ))}
      </RechartsAreaChart>
    </ChartFrame>
  );
}

export interface BarChartProps extends CartesianChartProps {
  stacked?: boolean;
}

/** Comparison between categories. */
export function BarChart({
  label,
  data,
  xKey,
  series,
  stacked = false,
  format = defaultFormat,
  height = 240,
}: BarChartProps) {
  const items = defined(series);

  return (
    <ChartFrame label={label} height={height} series={series}>
      <RechartsBarChart barCategoryGap="32%" data={[...data]} margin={CHART_MARGIN}>
        {axes(xKey)}
        <Tooltip
          content={(props) => <ChartTooltip {...props} format={format} />}
          cursor={{ fill: "var(--ag-background-card)" }}
        />
        {items.map((item, index) => (
          <Bar
            key={item.dataKey}
            dataKey={item.dataKey}
            fill={SERIES_COLORS[index]}
            isAnimationActive={false}
            name={item.label}
            radius={stacked && index < items.length - 1 ? 0 : [4, 4, 0, 0]}
            stackId={stacked ? "stack" : undefined}
          />
        ))}
      </RechartsBarChart>
    </ChartFrame>
  );
}

export interface DonutSlice {
  label: string;
  value: number;
}

export interface DonutChartProps {
  label: string;
  /** Limited to three slices, group the rest into one. */
  data: readonly [DonutSlice, DonutSlice?, DonutSlice?];
  /** Main figure shown in the middle. */
  center?: ReactNode;
  format?: Formatter;
  height?: number;
}

/** Share of a whole. */
export function DonutChart({
  label,
  data,
  center,
  format = defaultFormat,
  height = 200,
}: DonutChartProps) {
  const slices = data.filter((slice) => slice !== undefined);

  return (
    <Box flexDirection="column" gap="m" minWidth={0} width="100%">
      <Box
        as="figure"
        display="block"
        aria-label={label}
        margin="none"
        position="relative"
        height={height}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={(props) => <ChartTooltip {...props} format={format} />} />
            <Pie
              data={[...slices]}
              dataKey="value"
              innerRadius="72%"
              isAnimationActive={false}
              nameKey="label"
              outerRadius="100%"
              paddingAngle={2}
              stroke="none"
            >
              {slices.map((slice, index) => (
                <Cell key={slice.label} fill={SERIES_COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {center ? (
          <Box
            position="absolute"
            inset={0}
            alignItems="center"
            justifyContent="center"
            pointerEvents="none"
          >
            <Text as="span" variant="heading-xs" tabularNums>
              {center}
            </Text>
          </Box>
        ) : null}
      </Box>
      <Box flexDirection="column" gap="xs">
        {slices.map((slice, index) => (
          <Box key={slice.label} alignItems="center" justifyContent="between" gap="m">
            <Box alignItems="center" gap="s" minWidth={0}>
              <svg aria-hidden width={8} height={8}>
                <circle cx={4} cy={4} r={4} fill={SERIES_COLORS[index]} />
              </svg>
              <Text as="span" variant="caption" color="muted" truncate>
                {slice.label}
              </Text>
            </Box>
            <Text as="span" variant="caption" tabularNums>
              {format(slice.value)}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export interface SparklineProps {
  label: string;
  values: readonly number[];
  height?: number;
}

/** A compact trend next to a number, without axes or tooltip. */
export function Sparkline({ label, values, height = 32 }: SparklineProps) {
  const data = values.map((value, index) => ({ index, value }));

  return (
    <Box as="figure" display="block" aria-label={label} margin="none" width="100%" height={height}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <YAxis hide domain={["auto", "auto"]} />
          <Line
            dataKey="value"
            dot={false}
            isAnimationActive={false}
            stroke={SPARKLINE_COLOR}
            strokeWidth={1.5}
            type="monotone"
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </Box>
  );
}

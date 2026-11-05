/* oxlint-disable jsx-a11y/prefer-tag-over-role -- an inline SVG chart needs role="img" to expose its label */
import { Box } from "@anyglade/kit";

interface AreaChartProps {
  label: string;
  values: number[];
  height?: number;
}

const WIDTH = 640;

export function AreaChart({ label, values, height = 200 }: AreaChartProps) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const step = WIDTH / (values.length - 1);
  const inset = 8;
  const toY = (value: number) =>
    height - inset - ((value - min) / (max - min)) * (height - inset * 2);
  const points = values.map((value, index) => `${index * step},${toY(value).toFixed(1)}`);
  const line = `M${points.join(" L")}`;

  return (
    <Box display="block" width="100%" color="text-primary">
      <svg
        role="img"
        aria-label={label}
        viewBox={`0 0 ${WIDTH} ${height}`}
        width="100%"
        height={height}
        preserveAspectRatio="none"
      >
        <path d={`${line} L${WIDTH},${height} L0,${height} Z`} fill="currentColor" opacity={0.06} />
        <path
          d={line}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </Box>
  );
}

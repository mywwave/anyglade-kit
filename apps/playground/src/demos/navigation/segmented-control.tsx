import { SegmentedControl } from "@anyglade/kit";
import { useState } from "react";

const periods = [
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
  { id: "year", label: "Year" },
] as const;

export function SegmentedControlDemo() {
  const [period, setPeriod] = useState<(typeof periods)[number]["id"]>("month");

  return <SegmentedControl label="Period" options={periods} value={period} onChange={setPeriod} />;
}

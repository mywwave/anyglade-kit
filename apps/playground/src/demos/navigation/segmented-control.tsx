import { SegmentedControl } from "@anyglade/kit";
import { useState } from "react";

const periods = [
  { id: "week", label: "Неделя" },
  { id: "month", label: "Месяц" },
  { id: "year", label: "Год" },
] as const;

export function SegmentedControlDemo() {
  const [period, setPeriod] = useState<(typeof periods)[number]["id"]>("month");

  return <SegmentedControl label="Период" options={periods} value={period} onChange={setPeriod} />;
}

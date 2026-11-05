const compact = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  notation: "compact",
  maximumFractionDigits: 1,
});

export const formatCompactRubles = (value: number) => compact.format(value);

export function downloadCsv(fileName: string, rows: string[][]) {
  const lines = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(";"));
  const url = URL.createObjectURL(
    new Blob([`\uFEFF${lines.join("\n")}`], { type: "text/csv;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

export function pluralize(count: number, one: string, few: string, many: string) {
  const lastTwo = Math.abs(count) % 100;
  const last = lastTwo % 10;
  if (lastTwo > 10 && lastTwo < 20) return many;
  if (last === 1) return one;
  if (last > 1 && last < 5) return few;
  return many;
}

const compact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

export const formatCompactMoney = (value: number) => compact.format(value);

export function downloadCsv(fileName: string, rows: string[][]) {
  const lines = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(","));
  const url = URL.createObjectURL(
    new Blob([`\uFEFF${lines.join("\n")}`], { type: "text/csv;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

/** English nouns have two forms: one item, any other count. */
export function pluralize(count: number, one: string, other: string) {
  return Math.abs(count) === 1 ? one : other;
}

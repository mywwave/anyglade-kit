const compact = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  notation: "compact",
  maximumFractionDigits: 1,
});

export const formatCompactRubles = (value: number) => compact.format(value);

export function pluralize(count: number, one: string, few: string, many: string) {
  const lastTwo = Math.abs(count) % 100;
  const last = lastTwo % 10;
  if (lastTwo > 10 && lastTwo < 20) return many;
  if (last === 1) return one;
  if (last > 1 && last < 5) return few;
  return many;
}

const rubles = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

export const formatRubles = (value: number) => rubles.format(value);

export const revenueByDay = [
  212, 228, 219, 246, 261, 254, 280, 296, 288, 312, 330, 322, 351, 374, 366, 398, 421, 412, 447,
  468,
];

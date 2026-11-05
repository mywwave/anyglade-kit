import { Box, Button, Frame, FrameTile, Separator, Text } from "@anyglade/kit";
import { Check } from "@anyglade/kit/icons";
import { formatRubles } from "../format.ts";

const plans = [
  {
    name: "Старт",
    note: "Для проверки идеи",
    price: 0,
    fee: "5% + 30 ₽",
    features: ["Все функции продаж", "Поддержка по почте"],
  },
  {
    name: "Рост",
    note: "Для первых клиентов",
    price: 1900,
    fee: "3,8% + 20 ₽",
    features: ["Ранний доступ к новому", "Приоритетная поддержка"],
  },
  {
    name: "Масштаб",
    note: "Для растущего бизнеса",
    price: 9900,
    fee: "3,4% + 15 ₽",
    features: ["Ранний доступ к новому", "Выделенный чат", "Единый вход"],
  },
];

export function PricingBlock() {
  return (
    <Box as="section" flexDirection="column" gap="2xl" padding={{ base: "xl", md: "3xl" }}>
      <Box flexDirection="column" gap="s" alignItems="center" textAlign="center">
        <Text as="h2" variant="heading-m">
          Цена растёт вместе с вами
        </Text>
        <Text variant="body" color="muted">
          Начните бесплатно и платите, только когда появятся продажи
        </Text>
      </Box>
      <Frame title="Тарифы" meta="Можно сменить в любой момент">
        <Box
          display="grid"
          gridTemplateColumns={{ base: "minmax(0, 1fr)", md: "repeat(3, minmax(0, 1fr))" }}
          gap="xs"
        >
          {plans.map((plan) => (
            <FrameTile key={plan.name}>
              <Box flexDirection="column" gap="2xs">
                <Text as="h3" variant="heading-xxs">
                  {plan.name}
                </Text>
                <Text color="muted">{plan.note}</Text>
              </Box>
              <Box alignItems="baseline" gap="xs">
                <Text as="span" variant="heading-m" tabularNums>
                  {plan.price === 0 ? "Бесплатно" : formatRubles(plan.price)}
                </Text>
                {plan.price === 0 ? null : (
                  <Text as="span" color="muted">
                    в месяц
                  </Text>
                )}
              </Box>
              <Box justifyContent="between" gap="s">
                <Text as="span" color="muted">
                  Комиссия
                </Text>
                <Text as="span" tabularNums>
                  {plan.fee}
                </Text>
              </Box>
              <Button fullWidth variant={plan.name === "Рост" ? "primary" : "secondary"}>
                Выбрать
              </Button>
              <Separator />
              <Box as="ul" flexDirection="column" gap="s">
                {plan.features.map((feature) => (
                  <Box as="li" key={feature} display="flex" alignItems="center" gap="s">
                    <Check />
                    <Text as="span">{feature}</Text>
                  </Box>
                ))}
              </Box>
            </FrameTile>
          ))}
        </Box>
      </Frame>
    </Box>
  );
}

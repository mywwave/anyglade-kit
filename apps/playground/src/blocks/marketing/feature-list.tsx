import { Box, Text } from "@anyglade/kit";

const features = [
  {
    title: "Подключение за день",
    text: "API и готовые страницы оплаты закрывают основной сценарий.",
  },
  { title: "Точный учёт", text: "События превращаются в начисления без ручной сверки." },
  { title: "Понятные отчёты", text: "Выручка и маржа видны в реальном времени." },
];

export function FeatureListBlock() {
  return (
    <Box
      as="section"
      display="grid"
      gridTemplateColumns={{ base: "minmax(0, 1fr)", md: "minmax(0, 3fr) minmax(0, 2fr)" }}
      gap="3xl"
      padding={{ base: "xl", md: "3xl" }}
    >
      <Box display="block">
        <Text as="h2" variant="heading-m">
          Запускайте продажи сегодня.
        </Text>
        <Text as="p" variant="heading-m" color="muted">
          Оплата, подписки и закрывающие документы уже встроены.
        </Text>
      </Box>
      <Box as="ul" flexDirection="column" gap="xl">
        {features.map((feature) => (
          <Box as="li" key={feature.title} display="flex" flexDirection="column" gap="xs">
            <Text as="h3" variant="body" weight="medium">
              {feature.title}
            </Text>
            <Text color="muted">{feature.text}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

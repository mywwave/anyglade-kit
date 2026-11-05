import { Box, Button, Text } from "@anyglade/kit";

export function FeatureListBlock() {
  return (
    <Box
      as="section"
      flexDirection="column"
      alignItems="start"
      gap="2xl"
      paddingHorizontal={{ base: "xl", md: "3xl" }}
      paddingVertical={{ base: "3xl", md: "4xl" }}
    >
      <Box display="block" maxWidth={880}>
        <Text as="h2" variant="heading-l" wrap="pretty">
          Подключите оплату за день.{" "}
          <Text as="span" variant="heading-l" color="muted">
            Начисления сходятся без ручной сверки.
          </Text>{" "}
          Отчёт готов к понедельнику.{" "}
          <Text as="span" variant="heading-l" color="muted">
            Закрывающие документы уходят сами.
          </Text>
        </Text>
      </Box>
      <Button variant="secondary">Как это устроено</Button>
    </Box>
  );
}

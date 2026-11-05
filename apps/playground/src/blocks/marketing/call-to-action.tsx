import { Box, Button, Text } from "@anyglade/kit";
import { ChevronRight } from "@anyglade/kit/icons";

export function CallToActionBlock() {
  return (
    <Box
      as="section"
      flexDirection="column"
      alignItems="center"
      gap="xl"
      textAlign="center"
      paddingHorizontal="xl"
      paddingVertical="4xl"
      backgroundColor="background-canvas"
    >
      <Box display="block" maxWidth={640}>
        <Text as="h2" variant="heading-l">
          От первой оплаты до отчётности
        </Text>
        <Text as="p" variant="heading-l" color="muted">
          Первый год бесплатно
        </Text>
      </Box>
      <Button size="lg">
        Начать
        <ChevronRight />
      </Button>
    </Box>
  );
}

import { Box, Button, EmptyPanel, Text } from "@anyglade/kit";
import { Magnifier, Plus, Receipt } from "@anyglade/kit/icons";

export function EmptyStatesBlock() {
  return (
    <Box
      display="grid"
      gridTemplateColumns={{ base: "minmax(0, 1fr)", md: "repeat(2, minmax(0, 1fr))" }}
      gap="l"
      padding={{ base: "l", md: "xl" }}
    >
      <EmptyPanel
        icon={<Receipt />}
        title="Заказов пока нет"
        description="Создайте первый заказ или подключите оплату на сайте."
        actions={
          <Button size="sm">
            <Plus />
            Создать заказ
          </Button>
        }
      />
      <Box
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap="m"
        padding="2xl"
        textAlign="center"
      >
        <Box color="text-secondary">
          <Magnifier />
        </Box>
        <Box flexDirection="column" gap="xs">
          <Text>Ничего не найдено</Text>
          <Text variant="caption" color="muted">
            Попробуйте изменить запрос или фильтры.
          </Text>
        </Box>
        <Button size="sm" variant="secondary">
          Сбросить фильтры
        </Button>
      </Box>
    </Box>
  );
}

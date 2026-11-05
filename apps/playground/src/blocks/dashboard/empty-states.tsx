import { Box, Button, Checkbox, Description, EmptyPanel, Text, tokens } from "@anyglade/kit";
import { Magnifier } from "@anyglade/kit/icons";
import { useState } from "react";

const steps = [
  { id: "product", title: "Добавьте товар", note: "Название и цена, остальное позже" },
  { id: "payment", title: "Подключите оплату", note: "Ссылка на оплату появится сразу" },
  { id: "order", title: "Примите первый заказ", note: "Он появится в этом списке" },
];

export function EmptyStatesBlock() {
  const [done, setDone] = useState<string[]>([]);

  function toggle(id: string, isDone: boolean) {
    setDone((list) => (isDone ? [...list, id] : list.filter((item) => item !== id)));
  }

  return (
    <Box
      display="grid"
      gridTemplateColumns={{ base: "minmax(0, 1fr)", md: "minmax(0, 3fr) minmax(0, 2fr)" }}
      gap="2xl"
      width="100%"
      maxWidth={tokens.widths.wide}
      marginHorizontal="auto"
      padding={{ base: "l", md: "2xl" }}
    >
      <Box flexDirection="column" gap="xl">
        <Box flexDirection="column" gap="xs">
          <Text as="h2" variant="heading-xs">
            {done.length === steps.length ? "Магазин готов" : "Заказов пока нет"}
          </Text>
          <Text color="muted">
            Выполнено {done.length} из {steps.length}
          </Text>
        </Box>
        <Box flexDirection="column" gap="l">
          {steps.map((step) => (
            <Checkbox
              key={step.id}
              isSelected={done.includes(step.id)}
              name={step.id}
              onChange={(isDone) => toggle(step.id, isDone)}
            >
              <Checkbox.Content>
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                {step.title}
              </Checkbox.Content>
              <Description>{step.note}</Description>
            </Checkbox>
          ))}
        </Box>
      </Box>
      <EmptyPanel
        icon={<Magnifier />}
        title="Ничего не найдено"
        description="Измените запрос или фильтры."
        actions={
          <Button size="sm" variant="secondary">
            Сбросить фильтры
          </Button>
        }
      />
    </Box>
  );
}

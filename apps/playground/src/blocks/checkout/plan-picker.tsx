import { Box, Button, Description, Radio, RadioGroup, Text } from "@anyglade/kit";
import { useState } from "react";
import { formatRubles } from "../format.ts";

const plans = [
  { id: "month", name: "Помесячно", note: "Без обязательств", price: 1900 },
  { id: "year", name: "На год", note: "Экономия 20%", price: 1520 },
];

export function PlanPickerBlock() {
  const [selected, setSelected] = useState("year");
  const price = plans.find((plan) => plan.id === selected)?.price ?? 0;

  return (
    <Box justifyContent="center" padding={{ base: "l", md: "2xl" }}>
      <Box flexDirection="column" gap="xl" width="100%" maxWidth={440}>
        <Text as="h2" variant="heading-xs">
          Выберите период
        </Text>
        <RadioGroup
          aria-label="Период оплаты"
          name="period"
          value={selected}
          onChange={setSelected}
        >
          {plans.map((plan) => (
            <Radio key={plan.id} value={plan.id}>
              <Radio.Content>
                <Radio.Control>
                  <Radio.Indicator />
                </Radio.Control>
                {plan.name}
              </Radio.Content>
              <Description>
                {plan.note}, {formatRubles(plan.price)} в месяц
              </Description>
            </Radio>
          ))}
        </RadioGroup>
        <Button fullWidth>Продолжить за {formatRubles(price)} в месяц</Button>
      </Box>
    </Box>
  );
}

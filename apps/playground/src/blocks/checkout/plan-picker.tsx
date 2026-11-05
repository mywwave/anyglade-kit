import { Box, Button, Radio, RadioGroup, Text, TextSwap, toast, tokens } from "@anyglade/kit";
import { useState } from "react";
import { simulateRequest } from "../../simulate.ts";
import { formatRubles } from "../format.ts";

const MONTHS = 12;

const plans = [
  { id: "month", name: "Каждый месяц", monthly: 1900 },
  { id: "year", name: "Сразу за год", monthly: 1520 },
];

const [monthPlan] = plans;

export function PlanPickerBlock() {
  const [selected, setSelected] = useState("year");
  const [connected, setConnected] = useState<string | null>(null);
  const plan = plans.find((item) => item.id === selected) ?? monthPlan;

  if (!plan || !monthPlan) {
    return null;
  }

  const saving = (monthPlan.monthly - plan.monthly) * MONTHS;
  const planName = plan.name;

  async function connect() {
    await simulateRequest();
    setConnected(selected);
    toast(`Подключено: ${planName.toLowerCase()}`);
  }

  return (
    <Box
      display="grid"
      gridTemplateColumns={{ base: "minmax(0, 1fr)", md: "minmax(0, 1fr) minmax(0, 1fr)" }}
      alignItems="end"
      gap="2xl"
      width="100%"
      maxWidth={tokens.widths.content}
      marginHorizontal="auto"
      padding={{ base: "l", md: "2xl" }}
    >
      <Box flexDirection="column" gap="xs">
        <Text color="muted">{saving > 0 ? "Экономия за год" : "Без обязательств"}</Text>
        <Text as="p" variant="heading-l" tabularNums>
          {saving > 0 ? formatRubles(saving) : formatRubles(plan.monthly)}
        </Text>
      </Box>
      <Box flexDirection="column" gap="l">
        <RadioGroup
          aria-label="Период оплаты"
          className="w-full"
          name="period"
          value={selected}
          onChange={setSelected}
        >
          {plans.map((item) => (
            <Radio key={item.id} className="w-full" value={item.id}>
              <Radio.Content className="w-full">
                <Radio.Control>
                  <Radio.Indicator />
                </Radio.Control>
                <Box as="span" display="flex" flexGrow={1} justifyContent="between" gap="l">
                  <Text as="span">{item.name}</Text>
                  <Text as="span" tabularNums>
                    {formatRubles(item.monthly)} в месяц
                  </Text>
                </Box>
              </Radio.Content>
            </Radio>
          ))}
        </RadioGroup>
        <Button fullWidth isDisabled={connected === selected} onPress={connect}>
          <TextSwap text={connected === selected ? "Подключено" : "Продолжить"} />
        </Button>
      </Box>
    </Box>
  );
}

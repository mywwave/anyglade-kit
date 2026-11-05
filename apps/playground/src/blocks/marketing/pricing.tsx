import { Box, Button, Label, Slider, Text, TextSwap, toast } from "@anyglade/kit";
import { useState } from "react";
import { simulateRequest } from "../../simulate.ts";
import { formatRubles } from "../format.ts";

const plans = [
  { name: "Старт", monthly: 0, rate: 0.05 },
  { name: "Рост", monthly: 1900, rate: 0.038 },
  { name: "Масштаб", monthly: 9900, rate: 0.034 },
];

const rublesFormat = { style: "currency", currency: "RUB", maximumFractionDigits: 0 } as const;

const costOf = (plan: (typeof plans)[number], turnover: number) =>
  plan.monthly + plan.rate * turnover;

export function PricingBlock() {
  const [turnover, setTurnover] = useState(600000);
  const [chosenPlan, setChosenPlan] = useState<string | null>(null);
  const quotes = plans.map((plan) => ({ ...plan, cost: costOf(plan, turnover) }));
  const best = quotes.reduce((lowest, quote) => (quote.cost < lowest.cost ? quote : lowest));

  async function choose() {
    const name = best.name;
    await simulateRequest();
    setChosenPlan(name);
    toast(`Тариф «${name}» подключён`);
  }

  return (
    <Box
      as="section"
      display="grid"
      gridTemplateColumns={{ base: "minmax(0, 1fr)", md: "minmax(0, 2fr) minmax(0, 3fr)" }}
      gap="3xl"
      padding={{ base: "xl", md: "3xl" }}
    >
      <Box flexDirection="column" gap="2xl">
        <Box display="block">
          <Text as="h2" variant="heading-m">
            Цена растёт вместе с вами.
          </Text>
          <Text as="p" variant="heading-m" color="muted">
            Укажите оборот.
          </Text>
        </Box>
        <Slider
          aria-label="Оборот в месяц"
          className="w-full"
          formatOptions={rublesFormat}
          maxValue={5000000}
          minValue={100000}
          step={100000}
          value={turnover}
          onChange={(value) => setTurnover(value as number)}
        >
          <Label>Оборот в месяц</Label>
          <Slider.Output />
          <Slider.Track>
            <Slider.Fill />
            <Slider.Thumb />
          </Slider.Track>
        </Slider>
      </Box>
      <Box flexDirection="column" gap="2xl">
        <Box flexDirection="column" gap="xs">
          <Text color="muted">Вам подойдёт тариф «{best.name}»</Text>
          <Text as="p" variant="heading-xl" tabularNums wrap="nowrap">
            {formatRubles(best.cost)}
          </Text>
          <Text color="muted">в месяц вместе с комиссией</Text>
        </Box>
        <Box as="ul" flexDirection="column" gap="m">
          {quotes.map((quote) => {
            const isBest = quote.name === best.name;
            return (
              <Box as="li" key={quote.name} display="flex" justifyContent="between" gap="l">
                <Text as="span" color={isBest ? "default" : "muted"}>
                  {quote.name}, комиссия {(quote.rate * 100).toLocaleString("ru-RU")}%
                </Text>
                <Text as="span" tabularNums color={isBest ? "default" : "muted"}>
                  {formatRubles(quote.cost)}
                </Text>
              </Box>
            );
          })}
        </Box>
        <Box display="block">
          <Button isDisabled={chosenPlan === best.name} size="lg" onPress={choose}>
            <TextSwap
              text={
                chosenPlan === best.name
                  ? `Тариф «${best.name}» подключён`
                  : `Выбрать «${best.name}»`
              }
            />
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

import { Box, Button, Input, Label, NumberField, Text, TextField, tokens } from "@anyglade/kit";
import { useState } from "react";
import { simulateRequest } from "../../simulate.ts";
import { formatRubles } from "../format.ts";

const PLAN_PRICE = 1900;
const SEAT_PRICE = 300;

export function CheckoutFormBlock() {
  const [seats, setSeats] = useState(3);
  const [isPaid, setIsPaid] = useState(false);
  const total = PLAN_PRICE + seats * SEAT_PRICE;

  async function pay() {
    await simulateRequest(1400);
    setIsPaid(true);
  }

  return (
    <Box
      display="grid"
      gridTemplateColumns={{ base: "minmax(0, 1fr)", md: "minmax(0, 3fr) minmax(0, 2fr)" }}
    >
      {isPaid ? (
        <Box
          flexDirection="column"
          alignItems="start"
          justifyContent="center"
          gap="xl"
          width="100%"
          maxWidth={tokens.widths.form + 64}
          marginHorizontal="auto"
          motion="enter"
          padding={{ base: "l", md: "2xl" }}
        >
          <Box flexDirection="column" gap="xs">
            <Text as="h2" variant="heading-xs">
              Оплата прошла
            </Text>
            <Text color="muted">Чек отправлен на почту, списано {formatRubles(total)}</Text>
          </Box>
          <Button variant="secondary" onPress={() => setIsPaid(false)}>
            Новая оплата
          </Button>
        </Box>
      ) : (
        <Box
          as="form"
          flexDirection="column"
          gap="l"
          width="100%"
          maxWidth={tokens.widths.form + 64}
          marginHorizontal="auto"
          padding={{ base: "l", md: "2xl" }}
          action={pay}
        >
          <Text as="h2" variant="heading-xs">
            Оплата
          </Text>
          <TextField className="w-full" isRequired name="email" type="email">
            <Label>Почта</Label>
            <Input placeholder="you@example.com" />
          </TextField>
          <TextField className="w-full" isRequired name="card">
            <Label>Номер карты</Label>
            <Input inputMode="numeric" placeholder="0000 0000 0000 0000" />
          </TextField>
          <Box display="grid" gridTemplateColumns="repeat(2, minmax(0, 1fr))" gap="m">
            <TextField className="w-full" isRequired name="expiry">
              <Label>Срок</Label>
              <Input placeholder="ММ / ГГ" />
            </TextField>
            <TextField className="w-full" isRequired name="cvc">
              <Label>CVC</Label>
              <Input inputMode="numeric" placeholder="000" />
            </TextField>
          </Box>
          <Button fullWidth size="lg" type="submit">
            Оплатить {formatRubles(total)}
          </Button>
          <Text variant="caption" color="muted" align="center">
            Демонстрация: данные никуда не отправляются.
          </Text>
        </Box>
      )}
      <Box
        flexDirection="column"
        justifyContent="between"
        gap="2xl"
        padding={{ base: "l", md: "2xl" }}
        backgroundColor="background-canvas"
      >
        <Box flexDirection="column" gap="xl">
          <Box flexDirection="column" gap="xs">
            <Text as="h3" variant="body" weight="medium">
              Тариф «Рост»
            </Text>
            <Text color="muted">{formatRubles(PLAN_PRICE)} в месяц</Text>
          </Box>
          <NumberField maxValue={50} minValue={0} value={seats} onChange={setSeats}>
            <Label>Дополнительные места</Label>
            <NumberField.Group>
              <NumberField.DecrementButton />
              <NumberField.Input />
              <NumberField.IncrementButton />
            </NumberField.Group>
          </NumberField>
        </Box>
        <Box flexDirection="column" gap="xs">
          <Text color="muted">Итого в месяц</Text>
          <Text as="p" variant="heading-l" tabularNums>
            {formatRubles(total)}
          </Text>
        </Box>
      </Box>
    </Box>
  );
}

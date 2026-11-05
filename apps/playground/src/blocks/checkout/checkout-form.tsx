import {
  Box,
  Button,
  Frame,
  FrameTile,
  Input,
  Label,
  Separator,
  Text,
  TextField,
} from "@anyglade/kit";
import { formatRubles } from "../format.ts";

const lines = [
  { label: "Тариф «Рост», месяц", amount: 1900 },
  { label: "Дополнительные места, 3", amount: 900 },
];

const total = lines.reduce((sum, line) => sum + line.amount, 0);

export function CheckoutFormBlock() {
  return (
    <Box
      display="grid"
      gridTemplateColumns={{ base: "minmax(0, 1fr)", md: "minmax(0, 1fr) minmax(0, 1fr)" }}
      alignItems="start"
      gap="xl"
      padding={{ base: "l", md: "2xl" }}
    >
      <Frame title="Ваш заказ" meta="Отмена в любой момент">
        <FrameTile>
          {lines.map((line) => (
            <Box key={line.label} justifyContent="between" gap="l">
              <Text as="span" color="muted">
                {line.label}
              </Text>
              <Text as="span" tabularNums>
                {formatRubles(line.amount)}
              </Text>
            </Box>
          ))}
          <Separator />
          <Box alignItems="baseline" justifyContent="between" gap="l">
            <Text as="span" variant="title">
              Итого
            </Text>
            <Text as="span" variant="heading-s" tabularNums>
              {formatRubles(total)}
            </Text>
          </Box>
        </FrameTile>
      </Frame>
      <Box as="form" flexDirection="column" gap="l" onSubmit={(event) => event.preventDefault()}>
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
          Демонстрационная форма, данные никуда не отправляются.
        </Text>
      </Box>
    </Box>
  );
}

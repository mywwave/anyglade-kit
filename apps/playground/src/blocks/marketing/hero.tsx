import { Box, Button, Frame, FrameTile, Text, toast } from "@anyglade/kit";
import { ChevronRight } from "@anyglade/kit/icons";
import { useEffect, useRef, useState } from "react";
import { simulateRequest } from "../../simulate.ts";
import { formatRubles } from "../format.ts";

interface Payment {
  id: number;
  customer: string;
  amount: number;
}

const customers = [
  { customer: "Анна Смирнова", amount: 1900 },
  { customer: "ООО «Вектор»", amount: 9900 },
  { customer: "Илья Воронов", amount: 3400 },
  { customer: "Мария Ким", amount: 1900 },
  { customer: "ИП Лебедев", amount: 7800 },
  { customer: "Студия «Север»", amount: 4900 },
];

const VISIBLE_PAYMENTS = 4;
const TICK_MS = 2400;

function firstPayments(): Payment[] {
  return customers.slice(0, VISIBLE_PAYMENTS).map((payment, index) => ({ ...payment, id: index }));
}

export function HeroBlock() {
  const [total, setTotal] = useState(1848885);
  const [payments, setPayments] = useState(firstPayments);
  const nextId = useRef(VISIBLE_PAYMENTS);

  function receive(payment: Omit<Payment, "id">) {
    const id = nextId.current;
    nextId.current += 1;
    setTotal((value) => value + payment.amount);
    setPayments((list) => [{ ...payment, id }, ...list].slice(0, VISIBLE_PAYMENTS));
  }

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }
    const timer = setInterval(() => {
      const payment = customers[nextId.current % customers.length];
      if (payment) {
        receive(payment);
      }
    }, TICK_MS);
    return () => clearInterval(timer);
  }, []);

  async function start() {
    await simulateRequest();
    toast("Кабинет создан, письмо со входом отправлено");
  }

  async function sendTestPayment() {
    await simulateRequest(700);
    receive({ customer: "Тестовый платёж", amount: 1000 });
  }

  return (
    <Box
      as="section"
      display="grid"
      gridTemplateColumns={{ base: "minmax(0, 1fr)", md: "minmax(0, 7fr) minmax(0, 5fr)" }}
      alignItems="end"
      gap="3xl"
      padding={{ base: "xl", md: "3xl" }}
    >
      <Box flexDirection="column" alignItems="start" gap="3xl">
        <Box display="block">
          <Text as="h1" variant="heading-s">
            Биллинг, который считает сам
          </Text>
          <Text as="p" variant="heading-s" color="muted">
            Подписки, счета и отчёты в одном месте
          </Text>
        </Box>
        <Box flexDirection="column" gap="s">
          <Text color="muted">Выручка демо-магазина за сегодня</Text>
          <Text as="p" variant="heading-xl" tabularNums wrap="nowrap">
            {formatRubles(total)}
          </Text>
        </Box>
        <Box flexWrap="wrap" gap="s">
          <Button size="lg" onPress={start}>
            Начать бесплатно
            <ChevronRight />
          </Button>
          <Button size="lg" variant="ghost" onPress={sendTestPayment}>
            Провести тестовый платёж
          </Button>
        </Box>
      </Box>
      <Frame title="Поступления" meta="Сейчас">
        <FrameTile>
          <Box as="ul" flexDirection="column" gap="l" aria-live="polite">
            {payments.map((payment) => (
              <Box
                as="li"
                key={payment.id}
                display="flex"
                justifyContent="between"
                gap="l"
                motion={payment.id < VISIBLE_PAYMENTS ? undefined : "enter"}
              >
                <Text as="span" truncate>
                  {payment.customer}
                </Text>
                <Text as="span" tabularNums>
                  +{formatRubles(payment.amount)}
                </Text>
              </Box>
            ))}
          </Box>
        </FrameTile>
      </Frame>
    </Box>
  );
}

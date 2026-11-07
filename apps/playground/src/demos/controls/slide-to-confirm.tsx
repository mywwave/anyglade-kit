import { Box, Button, SlideToConfirm, Text } from "@anyglade/kit";
import { useState } from "react";
import { simulateRequest } from "../../simulate.ts";

export function SlideToConfirmDemo() {
  const [round, setRound] = useState(0);
  const [failNext, setFailNext] = useState(false);

  async function confirm() {
    await simulateRequest(1200);
    if (failNext) {
      setFailNext(false);
      throw new Error("Банк не ответил");
    }
  }

  return (
    <Box flexDirection="column" alignItems="start" gap="l" width="100%" maxWidth={320}>
      <SlideToConfirm
        key={round}
        doneLabel="Подписка отменена"
        label="Проведите, чтобы отменить"
        pendingLabel="Отменяем"
        onConfirm={confirm}
      />
      <Text variant="caption" color="muted">
        Отпустите раньше конца, и бегунок вернётся. Ошибка запроса тоже вернёт его.
      </Text>
      <Box gap="s" flexWrap="wrap">
        <Button size="sm" variant="secondary" onPress={() => setRound(round + 1)}>
          Сбросить
        </Button>
        <Button size="sm" variant="ghost" isDisabled={failNext} onPress={() => setFailNext(true)}>
          {failNext ? "Следующая попытка упадёт" : "Уронить следующую попытку"}
        </Button>
      </Box>
    </Box>
  );
}

import { Box, Button, toast } from "@anyglade/kit";
import { ArrowUpFromLine } from "@anyglade/kit/icons";
import { useState } from "react";

const wait = (milliseconds: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, milliseconds);
  });

export function ButtonLoadingDemo() {
  const [isPending, setIsPending] = useState(false);

  async function save() {
    await wait(1200);
    toast("Сохранено");
  }

  return (
    <Box flexWrap="wrap" alignItems="center" gap="m">
      <Button onPress={save}>Сохранить</Button>
      <Button variant="secondary" onPress={() => wait(1200)}>
        <ArrowUpFromLine />
        Выгрузить
      </Button>
      <Button variant="danger-soft" onPress={() => wait(1200)}>
        Удалить
      </Button>
      <Button onPress={() => wait(60)} variant="ghost">
        Быстрое действие
      </Button>
      <Button isPending={isPending} variant="outline" onPress={() => setIsPending(!isPending)}>
        Через isPending
      </Button>
    </Box>
  );
}

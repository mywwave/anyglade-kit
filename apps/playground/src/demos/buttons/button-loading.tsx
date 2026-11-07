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
    toast("Saved");
  }

  return (
    <Box flexWrap="wrap" alignItems="center" gap="m">
      <Button onPress={save}>Save</Button>
      <Button variant="secondary" onPress={() => wait(1200)}>
        <ArrowUpFromLine />
        Export
      </Button>
      <Button variant="danger-soft" onPress={() => wait(1200)}>
        Delete
      </Button>
      <Button onPress={() => wait(60)} variant="ghost">
        Quick action
      </Button>
      <Button isPending={isPending} variant="outline" onPress={() => setIsPending(!isPending)}>
        With isPending
      </Button>
    </Box>
  );
}

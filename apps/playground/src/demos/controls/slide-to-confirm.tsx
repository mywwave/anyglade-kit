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
      throw new Error("The bank did not respond");
    }
  }

  return (
    <Box flexDirection="column" alignItems="start" gap="l" width="100%" maxWidth={320}>
      <SlideToConfirm
        key={round}
        doneLabel="Subscription canceled"
        label="Slide to cancel"
        pendingLabel="Canceling"
        onConfirm={confirm}
      />
      <Text variant="caption" color="muted">
        Release before the end and the handle springs back. A failed request sends it back too.
      </Text>
      <Box gap="s" flexWrap="wrap">
        <Button size="sm" variant="secondary" onPress={() => setRound(round + 1)}>
          Reset
        </Button>
        <Button size="sm" variant="ghost" isDisabled={failNext} onPress={() => setFailNext(true)}>
          {failNext ? "Next attempt will fail" : "Fail the next attempt"}
        </Button>
      </Box>
    </Box>
  );
}

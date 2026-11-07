import { Avatar, Box, Button, SlideToConfirm, Text } from "@anyglade/kit";
import { useState } from "react";
import { simulateRequest } from "../../simulate.ts";
import { formatMoney } from "../format.ts";

const AMOUNT = 480;

export function SlideToPayBlock() {
  const [round, setRound] = useState(0);
  const [isSent, setIsSent] = useState(false);

  async function send() {
    await simulateRequest(1400);
    setIsSent(true);
  }

  function again() {
    setIsSent(false);
    setRound(round + 1);
  }

  return (
    <Box flexDirection="column" alignItems="center" gap="xl" width="100%">
      <Box flexDirection="column" alignItems="center" gap="s">
        <Avatar>
          <Avatar.Image alt="" src="https://i.pravatar.cc/96?img=5" />
          <Avatar.Fallback>OM</Avatar.Fallback>
        </Avatar>
        <Box flexDirection="column" alignItems="center">
          <Text variant="title">Olivia Moore</Text>
          <Text variant="caption" color="muted" tabularNums>
            Card •• 2291
          </Text>
        </Box>
      </Box>
      <Text as="p" variant="heading-m" tabularNums wrap="nowrap">
        {formatMoney(AMOUNT)}
      </Text>
      <SlideToConfirm
        key={round}
        doneLabel="Transfer sent"
        label="Slide to send"
        pendingLabel="Sending"
        onConfirm={send}
      />
      <Box minHeight={32}>
        {isSent ? (
          <Box display="block" motion="fade">
            <Button size="sm" variant="ghost" onPress={again}>
              New transfer
            </Button>
          </Box>
        ) : (
          <Text variant="caption" color="muted">
            No fee, arrives instantly
          </Text>
        )}
      </Box>
    </Box>
  );
}

SlideToPayBlock.displayName = "Transfer";

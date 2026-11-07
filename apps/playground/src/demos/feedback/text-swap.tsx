import { Box, Button, Text, TextSwap } from "@anyglade/kit";
import { useState } from "react";

const states = [
  "Reviewing the pipeline",
  "Looking for stalled deals",
  "Preparing",
  "Thought for 4s",
];

export function TextSwapDemo() {
  const [index, setIndex] = useState(0);

  return (
    <Box flexDirection="column" alignItems="start" gap="m">
      <Box alignItems="center" gap="s">
        <Text as="span" color="muted">
          <TextSwap text={states[index % states.length] ?? ""} />
        </Text>
        <Text as="span" variant="caption" color="subtle" tabularNums>
          {(index % states.length) + 1}/{states.length}
        </Text>
      </Box>
      <Button size="sm" variant="secondary" onPress={() => setIndex(index + 1)}>
        Next state
      </Button>
    </Box>
  );
}

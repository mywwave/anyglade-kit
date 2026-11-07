import { Box, Button, Shimmer, Text } from "@anyglade/kit";
import { useState } from "react";

export function ShimmerDemo() {
  const [isActive, setIsActive] = useState(true);

  return (
    <Box flexDirection="column" alignItems="start" gap="m">
      <Text as="p" variant="heading-xxs">
        <Shimmer isActive={isActive}>Gathering deal data</Shimmer>
      </Text>
      <Text color="muted">
        <Shimmer isActive={isActive}>Writing a reply</Shimmer>
      </Text>
      <Button size="sm" variant="secondary" onPress={() => setIsActive(!isActive)}>
        {isActive ? "Stop" : "Start"}
      </Button>
    </Box>
  );
}

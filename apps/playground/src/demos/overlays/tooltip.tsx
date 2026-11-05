import { CircleInfo } from "@anyglade/kit/icons";
import { Box, Button, Text, Tooltip } from "@anyglade/kit";

export function TooltipDemo() {
  return (
    <Box alignItems="center" gap="l">
      <Tooltip delay={0}>
        <Button variant="secondary">Hover me</Button>
        <Tooltip.Content>
          <Text as="p">This is a tooltip</Text>
        </Tooltip.Content>
      </Tooltip>

      <Tooltip delay={0}>
        <Button isIconOnly aria-label="More information" variant="tertiary">
          <CircleInfo />
        </Button>
        <Tooltip.Content>
          <Text as="p">More information</Text>
        </Tooltip.Content>
      </Tooltip>
    </Box>
  );
}

import { Heart } from "@anyglade/kit/icons";
import { Box, ToggleButton } from "@anyglade/kit";

export function ToggleButtonDemo() {
  return (
    <Box alignItems="center" gap="m">
      <ToggleButton>
        <Heart />
        Default
      </ToggleButton>
      <ToggleButton variant="ghost">
        <Heart />
        Ghost
      </ToggleButton>
    </Box>
  );
}

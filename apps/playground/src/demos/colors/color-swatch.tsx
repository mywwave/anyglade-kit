import { Box, ColorSwatch } from "@anyglade/kit";

export function ColorSwatchDemo() {
  return (
    <Box alignItems="center" gap="m">
      <ColorSwatch aria-label="Blue" color="#0485F7" />
      <ColorSwatch aria-label="Red" color="#EF4444" />
      <ColorSwatch aria-label="Amber" color="#F59E0B" />
      <ColorSwatch aria-label="Green" color="#10B981" />
      <ColorSwatch aria-label="Fuchsia" color="#D946EF" />
    </Box>
  );
}

import { Box, Separator } from "@anyglade/kit";

export function SeparatorDemo() {
  return (
    <Box maxWidth="28rem" flexDirection="column" alignItems="center" gap="m">
      <Box display="block">Default Variant</Box>
      <Separator variant="default" />
      <Box display="block">Secondary Variant</Box>
      <Separator variant="secondary" />
      <Box display="block">Tertiary Variant</Box>
      <Separator variant="tertiary" />
    </Box>
  );
}

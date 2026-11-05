import { Box, Input } from "@anyglade/kit";

export function InputDemo() {
  return (
    <Box width={240} flexDirection="column" gap="s">
      <Input fullWidth placeholder="Primary input" variant="primary" />
      <Input fullWidth placeholder="Secondary input" variant="secondary" />
    </Box>
  );
}

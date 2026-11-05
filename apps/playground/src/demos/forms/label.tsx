import { Box, Input, Label } from "@anyglade/kit";

export function LabelDemo() {
  return (
    <Box flexDirection="column" gap="xs">
      <Label htmlFor="name">Name</Label>
      <Input className="w-64" id="name" placeholder="Enter your name" type="text" />
    </Box>
  );
}

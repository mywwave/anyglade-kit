import { Box, Button } from "@anyglade/kit";

export function ButtonDemo() {
  return (
    <Box flexWrap="wrap" gap="m">
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="tertiary">Tertiary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="danger-soft">Danger Soft</Button>
    </Box>
  );
}

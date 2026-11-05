import { Box, Description, Input, Label } from "@anyglade/kit";

export function DescriptionDemo() {
  return (
    <Box flexDirection="column" gap="xs">
      <Label htmlFor="email">Email</Label>
      <Input
        aria-describedby="email-description"
        className="w-64"
        id="email"
        placeholder="you@example.com"
        type="email"
      />
      <Description id="email-description">
        We'll never share your email with anyone else.
      </Description>
    </Box>
  );
}

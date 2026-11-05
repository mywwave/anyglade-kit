import { Box, TextArea } from "@anyglade/kit";

export function TextAreaDemo() {
  return (
    <Box width={280} flexDirection="column" gap="s">
      <TextArea fullWidth placeholder="Primary textarea" variant="primary" />
      <TextArea fullWidth placeholder="Secondary textarea" variant="secondary" />
    </Box>
  );
}

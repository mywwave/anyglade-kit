import { Box, CopyButton } from "@anyglade/kit";

export function CopyButtonDemo() {
  return (
    <Box flexWrap="wrap" alignItems="center" gap="m">
      <CopyButton copiedLabel="ID copied" label="Copy ID" value="cus_8fK2mQ" />
      <CopyButton
        isLabelVisible
        copiedLabel="Copied"
        label="Copy link"
        value="https://example.com"
        variant="secondary"
      />
    </Box>
  );
}

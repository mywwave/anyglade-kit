import { Box, CopyButton } from "@anyglade/kit";

export function CopyButtonDemo() {
  return (
    <Box flexWrap="wrap" alignItems="center" gap="m">
      <CopyButton
        copiedLabel="Идентификатор скопирован"
        label="Скопировать идентификатор"
        value="cus_8fK2mQ"
      />
      <CopyButton
        isLabelVisible
        copiedLabel="Скопировано"
        label="Скопировать ссылку"
        value="https://example.com"
        variant="secondary"
      />
    </Box>
  );
}

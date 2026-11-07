import { Box, SignaturePad, Text } from "@anyglade/kit";
import { useState } from "react";

export function SignaturePadDemo() {
  const [signature, setSignature] = useState<string | null>(null);

  return (
    <Box flexDirection="column" gap="m" width="100%" maxWidth={400}>
      <SignaturePad
        clearLabel="Стереть подпись"
        label="Подпись под актом"
        placeholder="Подпишите здесь"
        onChange={setSignature}
      />
      <Text variant="caption" color="muted" tabularNums>
        {signature
          ? `Готово: PNG, ${Math.round(signature.length / 1024)} КБ в data URL`
          : "Подписи пока нет, onChange отдал null"}
      </Text>
    </Box>
  );
}

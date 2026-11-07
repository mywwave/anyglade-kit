import { Box, SignaturePad, Text } from "@anyglade/kit";
import { useState } from "react";

export function SignaturePadDemo() {
  const [signature, setSignature] = useState<string | null>(null);

  return (
    <Box flexDirection="column" gap="m" width="100%" maxWidth={400}>
      <SignaturePad
        clearLabel="Clear signature"
        label="Sign the acceptance form"
        placeholder="Sign here"
        onChange={setSignature}
      />
      <Text variant="caption" color="muted" tabularNums>
        {signature
          ? `Ready: PNG, ${Math.round(signature.length / 1024)} KB as a data URL`
          : "No signature yet, onChange returned null"}
      </Text>
    </Box>
  );
}

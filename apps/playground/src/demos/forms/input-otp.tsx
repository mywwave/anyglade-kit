import { Box, InputOTP, Label } from "@anyglade/kit";

export function InputOTPDemo() {
  return (
    <Box flexDirection="column" gap="xl">
      <Box flexDirection="column" gap="s">
        <Label>Primary variant</Label>
        <InputOTP maxLength={6} variant="primary">
          <InputOTP.Group>
            <InputOTP.Slot index={0} />
            <InputOTP.Slot index={1} />
            <InputOTP.Slot index={2} />
          </InputOTP.Group>
          <InputOTP.Separator />
          <InputOTP.Group>
            <InputOTP.Slot index={3} />
            <InputOTP.Slot index={4} />
            <InputOTP.Slot index={5} />
          </InputOTP.Group>
        </InputOTP>
      </Box>
      <Box flexDirection="column" gap="s">
        <Label>Secondary variant</Label>
        <InputOTP maxLength={6} variant="secondary">
          <InputOTP.Group>
            <InputOTP.Slot index={0} />
            <InputOTP.Slot index={1} />
            <InputOTP.Slot index={2} />
          </InputOTP.Group>
          <InputOTP.Separator />
          <InputOTP.Group>
            <InputOTP.Slot index={3} />
            <InputOTP.Slot index={4} />
            <InputOTP.Slot index={5} />
          </InputOTP.Group>
        </InputOTP>
      </Box>
    </Box>
  );
}

import { Envelope } from "@anyglade/kit/icons";
import { Box, InputGroup, Label, TextField } from "@anyglade/kit";

export function InputGroupDemo() {
  return (
    <Box flexDirection="column" gap="l">
      <TextField className="w-70" name="primary">
        <Label>Primary variant</Label>
        <InputGroup variant="primary">
          <InputGroup.Prefix>
            <Envelope className="size-4 text-muted" />
          </InputGroup.Prefix>
          <InputGroup.Input placeholder="name@email.com" />
        </InputGroup>
      </TextField>
      <TextField className="w-70" name="secondary">
        <Label>Secondary variant</Label>
        <InputGroup variant="secondary">
          <InputGroup.Prefix>
            <Envelope className="size-4 text-muted" />
          </InputGroup.Prefix>
          <InputGroup.Input placeholder="name@email.com" />
        </InputGroup>
      </TextField>
    </Box>
  );
}

import { Box, ColorField, Label } from "@anyglade/kit";

export function ColorFieldDemo() {
  return (
    <Box flexDirection="column" gap="l">
      <ColorField className="w-70" defaultValue="#0485F7" name="primary-color">
        <Label>Primary variant</Label>
        <ColorField.Group variant="primary">
          <ColorField.Input />
        </ColorField.Group>
      </ColorField>
      <ColorField className="w-70" defaultValue="#F43F5E" name="secondary-color">
        <Label>Secondary variant</Label>
        <ColorField.Group variant="secondary">
          <ColorField.Input />
        </ColorField.Group>
      </ColorField>
    </Box>
  );
}

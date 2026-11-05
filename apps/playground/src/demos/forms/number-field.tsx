import { Box, Label, NumberField } from "@anyglade/kit";

export function NumberFieldDemo() {
  return (
    <Box flexDirection="column" gap="l">
      <NumberField defaultValue={100} minValue={0} name="primary-width" variant="primary">
        <Label>Primary variant</Label>
        <NumberField.Group>
          <NumberField.DecrementButton />
          <NumberField.Input className="w-30" />
          <NumberField.IncrementButton />
        </NumberField.Group>
      </NumberField>
      <NumberField defaultValue={100} minValue={0} name="secondary-width" variant="secondary">
        <Label>Secondary variant</Label>
        <NumberField.Group>
          <NumberField.DecrementButton />
          <NumberField.Input className="w-30" />
          <NumberField.IncrementButton />
        </NumberField.Group>
      </NumberField>
    </Box>
  );
}

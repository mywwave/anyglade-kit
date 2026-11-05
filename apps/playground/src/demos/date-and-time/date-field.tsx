import { Box, DateField, Label } from "@anyglade/kit";

export function DateFieldDemo() {
  return (
    <Box flexDirection="column" gap="l">
      <DateField className="w-64" name="primary-date">
        <Label>Primary variant</Label>
        <DateField.Group variant="primary">
          <DateField.Input>{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
        </DateField.Group>
      </DateField>
      <DateField className="w-64" name="secondary-date">
        <Label>Secondary variant</Label>
        <DateField.Group variant="secondary">
          <DateField.Input>{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
        </DateField.Group>
      </DateField>
    </Box>
  );
}

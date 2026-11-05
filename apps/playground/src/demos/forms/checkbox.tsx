import { Box, Checkbox, Description, Text } from "@anyglade/kit";

export function CheckboxDemo() {
  return (
    <Box flexDirection="column" gap="l">
      <Box flexDirection="column" gap="s">
        <Text as="p" variant="default" weight="medium" color="muted">
          Primary variant
        </Text>
        <Checkbox id="primary" name="primary" variant="primary">
          <Checkbox.Content>
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            Primary checkbox
          </Checkbox.Content>
          <Description>Standard styling with default background</Description>
        </Checkbox>
      </Box>
      <Box flexDirection="column" gap="s">
        <Text as="p" variant="default" weight="medium" color="muted">
          Secondary variant
        </Text>
        <Checkbox id="secondary" name="secondary" variant="secondary">
          <Checkbox.Content>
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            Secondary checkbox
          </Checkbox.Content>
          <Description>Lower emphasis variant for use in surfaces</Description>
        </Checkbox>
      </Box>
    </Box>
  );
}

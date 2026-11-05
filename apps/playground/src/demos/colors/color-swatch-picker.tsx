import { Box, ColorSwatchPicker, Text } from "@anyglade/kit";

const colors = ["#F43F5E", "#D946EF", "#8B5CF6", "#3B82F6", "#06B6D4", "#10B981", "#84CC16"];

export function ColorSwatchPickerDemo() {
  return (
    <Box flexDirection="column" gap="xl">
      <Box flexDirection="column" gap="s">
        <Text as="span" variant="default" color="muted">
          Circle (default)
        </Text>
        <ColorSwatchPicker variant="circle">
          {colors.map((color) => (
            <ColorSwatchPicker.Item key={color} color={color}>
              <ColorSwatchPicker.Swatch />
              <ColorSwatchPicker.Indicator />
            </ColorSwatchPicker.Item>
          ))}
        </ColorSwatchPicker>
      </Box>
      <Box flexDirection="column" gap="s">
        <Text as="span" variant="default" color="muted">
          Square
        </Text>
        <ColorSwatchPicker variant="square">
          {colors.map((color) => (
            <ColorSwatchPicker.Item key={color} color={color}>
              <ColorSwatchPicker.Swatch />
              <ColorSwatchPicker.Indicator />
            </ColorSwatchPicker.Item>
          ))}
        </ColorSwatchPicker>
      </Box>
    </Box>
  );
}

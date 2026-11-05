import { Box, ColorArea, ColorPicker, ColorSlider, ColorSwatch, Label } from "@anyglade/kit";

export function ColorPickerDemo() {
  return (
    <ColorPicker defaultValue="#0485F7">
      <ColorPicker.Trigger>
        <ColorSwatch size="lg" />
        <Label>Pick a color</Label>
      </ColorPicker.Trigger>
      <ColorPicker.Popover>
        <ColorArea
          aria-label="Color area"
          className="max-w-full"
          colorSpace="hsb"
          xChannel="saturation"
          yChannel="brightness"
        >
          <ColorArea.Thumb />
        </ColorArea>
        <Box gap="xs" paddingHorizontal="xs" display="block">
          <ColorSlider channel="hue" colorSpace="hsb">
            <Label>Hue</Label>
            <ColorSlider.Output className="text-muted" />
            <ColorSlider.Track>
              <ColorSlider.Thumb />
            </ColorSlider.Track>
          </ColorSlider>
        </Box>
      </ColorPicker.Popover>
    </ColorPicker>
  );
}

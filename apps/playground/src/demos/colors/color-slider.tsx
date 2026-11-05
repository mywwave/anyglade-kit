import { ColorSlider, Label } from "@anyglade/kit";

export function ColorSliderDemo() {
  return (
    <ColorSlider channel="hue" className="w-full max-w-xs" defaultValue="hsl(0, 100%, 50%)">
      <Label>Hue</Label>
      <ColorSlider.Output />
      <ColorSlider.Track>
        <ColorSlider.Thumb />
      </ColorSlider.Track>
    </ColorSlider>
  );
}

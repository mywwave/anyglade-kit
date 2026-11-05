import { ProgressCircle } from "@anyglade/kit";

export function ProgressCircleDemo() {
  return (
    <ProgressCircle aria-label="Loading" value={60}>
      <ProgressCircle.Track>
        <ProgressCircle.TrackCircle />
        <ProgressCircle.FillCircle />
      </ProgressCircle.Track>
    </ProgressCircle>
  );
}

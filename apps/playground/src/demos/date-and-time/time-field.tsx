import { Label, TimeField } from "@anyglade/kit";

export function TimeFieldDemo() {
  return (
    <TimeField className="w-64" name="time">
      <Label>Time</Label>
      <TimeField.Group>
        <TimeField.Input>{(segment) => <TimeField.Segment segment={segment} />}</TimeField.Input>
      </TimeField.Group>
    </TimeField>
  );
}

import { Switch } from "@anyglade/kit";

export function SwitchDemo() {
  return (
    <Switch>
      <Switch.Content>
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
        Enable notifications
      </Switch.Content>
    </Switch>
  );
}

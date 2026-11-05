import { Box, Label, ListBox, Select } from "@anyglade/kit";

export function SelectDemo() {
  return (
    <Box flexDirection="column" gap="l">
      <Select className="w-64" placeholder="Select one" variant="primary">
        <Label>Primary variant</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            <ListBox.Item id="option1" textValue="Option 1">
              Option 1
              <ListBox.ItemIndicator />
            </ListBox.Item>
            <ListBox.Item id="option2" textValue="Option 2">
              Option 2
              <ListBox.ItemIndicator />
            </ListBox.Item>
          </ListBox>
        </Select.Popover>
      </Select>
      <Select className="w-64" placeholder="Select one" variant="secondary">
        <Label>Secondary variant</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            <ListBox.Item id="option1" textValue="Option 1">
              Option 1
              <ListBox.ItemIndicator />
            </ListBox.Item>
            <ListBox.Item id="option2" textValue="Option 2">
              Option 2
              <ListBox.ItemIndicator />
            </ListBox.Item>
          </ListBox>
        </Select.Popover>
      </Select>
    </Box>
  );
}

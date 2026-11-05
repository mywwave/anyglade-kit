import { Avatar, Box, Description, Label, ListBox } from "@anyglade/kit";

export function ListBoxDemo() {
  return (
    <ListBox aria-label="Users" className="w-55" selectionMode="single">
      <ListBox.Item id="1" textValue="Bob">
        <Avatar size="sm">
          <Avatar.Image
            alt="Bob"
            src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
          />
          <Avatar.Fallback>B</Avatar.Fallback>
        </Avatar>
        <Box flexDirection="column">
          <Label>Bob</Label>
          <Description>bob@heroui.com</Description>
        </Box>
        <ListBox.ItemIndicator />
      </ListBox.Item>
      <ListBox.Item id="2" textValue="Fred">
        <Avatar size="sm">
          <Avatar.Image
            alt="Fred"
            src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg"
          />
          <Avatar.Fallback>F</Avatar.Fallback>
        </Avatar>
        <Box flexDirection="column">
          <Label>Fred</Label>
          <Description>fred@heroui.com</Description>
        </Box>
        <ListBox.ItemIndicator />
      </ListBox.Item>
      <ListBox.Item id="3" textValue="Martha">
        <Avatar size="sm">
          <Avatar.Image
            alt="Martha"
            src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg"
          />
          <Avatar.Fallback>M</Avatar.Fallback>
        </Avatar>
        <Box flexDirection="column">
          <Label>Martha</Label>
          <Description>martha@heroui.com</Description>
        </Box>
        <ListBox.ItemIndicator />
      </ListBox.Item>
    </ListBox>
  );
}

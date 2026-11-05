import { Box, Button, Popover, Text } from "@anyglade/kit";

export function PopoverDemo() {
  return (
    <Box alignItems="center" gap="l">
      <Popover>
        <Button>Click me</Button>
        <Popover.Content className="max-w-64">
          <Popover.Dialog>
            <Popover.Heading>Popover Title</Popover.Heading>
            <Box display="block" marginTop="s">
              <Text color="muted">This is the popover content. You can put any content here.</Text>
            </Box>
          </Popover.Dialog>
        </Popover.Content>
      </Popover>
    </Box>
  );
}

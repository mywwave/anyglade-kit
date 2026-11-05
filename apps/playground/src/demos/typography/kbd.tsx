import { Box, Kbd } from "@anyglade/kit";

export function KbdDemo() {
  return (
    <Box flexDirection="column" gap="l">
      <Box alignItems="center" gap="s">
        <Box as="span">Copy:</Box>
        <Kbd>
          <Kbd.Abbr keyValue="command" />
          <Kbd.Content>C</Kbd.Content>
        </Kbd>
        <Kbd variant="light">
          <Kbd.Abbr keyValue="command" />
          <Kbd.Content>C</Kbd.Content>
        </Kbd>
      </Box>
      <Box alignItems="center" gap="s">
        <Box as="span">Paste:</Box>
        <Kbd>
          <Kbd.Abbr keyValue="command" />
          <Kbd.Content>V</Kbd.Content>
        </Kbd>
        <Kbd variant="light">
          <Kbd.Abbr keyValue="command" />
          <Kbd.Content>V</Kbd.Content>
        </Kbd>
      </Box>
      <Box alignItems="center" gap="s">
        <Box as="span">Cut:</Box>
        <Kbd>
          <Kbd.Abbr keyValue="command" />
          <Kbd.Content>X</Kbd.Content>
        </Kbd>
        <Kbd variant="light">
          <Kbd.Abbr keyValue="command" />
          <Kbd.Content>X</Kbd.Content>
        </Kbd>
      </Box>
      <Box alignItems="center" gap="s">
        <Box as="span">Undo:</Box>
        <Kbd>
          <Kbd.Abbr keyValue="command" />
          <Kbd.Content>Z</Kbd.Content>
        </Kbd>
        <Kbd variant="light">
          <Kbd.Abbr keyValue="command" />
          <Kbd.Content>Z</Kbd.Content>
        </Kbd>
      </Box>
      <Box alignItems="center" gap="s">
        <Box as="span">Redo:</Box>
        <Kbd>
          <Kbd.Abbr keyValue="command" />
          <Kbd.Abbr keyValue="shift" />
          <Kbd.Content>Z</Kbd.Content>
        </Kbd>
        <Kbd variant="light">
          <Kbd.Abbr keyValue="command" />
          <Kbd.Abbr keyValue="shift" />
          <Kbd.Content>Z</Kbd.Content>
        </Kbd>
      </Box>
    </Box>
  );
}

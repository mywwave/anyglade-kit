import { Box, Button, ButtonGroup, Text } from "@anyglade/kit";

export function ButtonGroupDemo() {
  return (
    <Box flexDirection="column" gap="xl">
      <Box flexDirection="column" gap="s">
        <Text as="p" variant="default" color="muted">
          Primary
        </Text>
        <ButtonGroup variant="primary">
          <Button>First</Button>
          <Button>
            <ButtonGroup.Separator />
            Second
          </Button>
          <Button>
            <ButtonGroup.Separator />
            Third
          </Button>
        </ButtonGroup>
      </Box>
      <Box flexDirection="column" gap="s">
        <Text as="p" variant="default" color="muted">
          Secondary
        </Text>
        <ButtonGroup variant="secondary">
          <Button>First</Button>
          <Button>
            <ButtonGroup.Separator />
            Second
          </Button>
          <Button>
            <ButtonGroup.Separator />
            Third
          </Button>
        </ButtonGroup>
      </Box>
      <Box flexDirection="column" gap="s">
        <Text as="p" variant="default" color="muted">
          Tertiary
        </Text>
        <ButtonGroup variant="tertiary">
          <Button>First</Button>
          <Button>
            <ButtonGroup.Separator />
            Second
          </Button>
          <Button>
            <ButtonGroup.Separator />
            Third
          </Button>
        </ButtonGroup>
      </Box>
      <Box flexDirection="column" gap="s">
        <Text as="p" variant="default" color="muted">
          Outline
        </Text>
        <ButtonGroup variant="outline">
          <Button>First</Button>
          <Button>
            <ButtonGroup.Separator />
            Second
          </Button>
          <Button>
            <ButtonGroup.Separator />
            Third
          </Button>
        </ButtonGroup>
      </Box>
      <Box flexDirection="column" gap="s">
        <Text as="p" variant="default" color="muted">
          Ghost
        </Text>
        <ButtonGroup variant="ghost">
          <Button>First</Button>
          <Button>
            <ButtonGroup.Separator />
            Second
          </Button>
          <Button>
            <ButtonGroup.Separator />
            Third
          </Button>
        </ButtonGroup>
      </Box>
      <Box flexDirection="column" gap="s">
        <Text as="p" variant="default" color="muted">
          Danger
        </Text>
        <ButtonGroup variant="danger">
          <Button>First</Button>
          <Button>
            <ButtonGroup.Separator />
            Second
          </Button>
          <Button>
            <ButtonGroup.Separator />
            Third
          </Button>
        </ButtonGroup>
      </Box>
    </Box>
  );
}

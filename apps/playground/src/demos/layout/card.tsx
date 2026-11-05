import { Box, Card, Text } from "@anyglade/kit";

export function CardDemo() {
  return (
    <Box flexDirection="column" gap="l">
      <Card className="w-80" variant="transparent">
        <Card.Header>
          <Card.Title>Transparent</Card.Title>
          <Card.Description>Minimal prominence with transparent background</Card.Description>
        </Card.Header>
        <Card.Content>
          <Text as="p">Use for less important content or nested cards</Text>
        </Card.Content>
      </Card>

      <Card className="w-80" variant="default">
        <Card.Header>
          <Card.Title>Default</Card.Title>
          <Card.Description>Standard card appearance (bg-surface)</Card.Description>
        </Card.Header>
        <Card.Content>
          <Text as="p">The default card variant for most use cases</Text>
        </Card.Content>
      </Card>

      <Card className="w-80" variant="secondary">
        <Card.Header>
          <Card.Title>Secondary</Card.Title>
          <Card.Description>Medium prominence (bg-surface-secondary)</Card.Description>
        </Card.Header>
        <Card.Content>
          <Text as="p">Use to draw moderate attention</Text>
        </Card.Content>
      </Card>

      <Card className="w-80" variant="tertiary">
        <Card.Header>
          <Card.Title>Tertiary</Card.Title>
          <Card.Description>Higher prominence (bg-surface-tertiary)</Card.Description>
        </Card.Header>
        <Card.Content>
          <Text as="p">Use for primary or featured content</Text>
        </Card.Content>
      </Card>
    </Box>
  );
}

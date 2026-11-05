import { Box, Surface, Text } from "@anyglade/kit";

export function SurfaceDemo() {
  return (
    <Box flexDirection="column" gap="l">
      <Box flexDirection="column" gap="s">
        <Text as="p" variant="default" weight="medium" color="muted">
          Default
        </Text>
        <Surface className="min-w-80 rounded-3xl" variant="default">
          <Box flexDirection="column" gap="m" padding="xl">
            <Text as="h3" variant="body" weight="strong" color="default">
              Surface Content
            </Text>
            <Text as="p" variant="default" color="muted">
              This is a default surface variant. It uses bg-surface styling.
            </Text>
          </Box>
        </Surface>
      </Box>

      <Box flexDirection="column" gap="s">
        <Text as="p" variant="default" weight="medium" color="muted">
          Secondary
        </Text>
        <Surface className="min-w-80 rounded-3xl" variant="secondary">
          <Box flexDirection="column" gap="m" padding="xl">
            <Text as="h3" variant="body" weight="strong" color="default">
              Surface Content
            </Text>
            <Text as="p" variant="default" color="muted">
              This is a secondary surface variant. It uses bg-surface-secondary styling.
            </Text>
          </Box>
        </Surface>
      </Box>

      <Box flexDirection="column" gap="s">
        <Text as="p" variant="default" weight="medium" color="muted">
          Tertiary
        </Text>
        <Surface className="min-w-80 rounded-3xl" variant="tertiary">
          <Box flexDirection="column" gap="m" padding="xl">
            <Text as="h3" variant="body" weight="strong" color="default">
              Surface Content
            </Text>
            <Text as="p" variant="default" color="muted">
              This is a tertiary surface variant. It uses bg-surface-tertiary styling.
            </Text>
          </Box>
        </Surface>
      </Box>

      <Box flexDirection="column" gap="s">
        <Text as="p" variant="default" weight="medium" color="muted">
          Transparent
        </Text>
        <Surface className="min-w-80 rounded-3xl border" variant="transparent">
          <Box flexDirection="column" gap="m" padding="xl">
            <Text as="h3" variant="body" weight="strong" color="default">
              Surface Content
            </Text>
            <Text as="p" variant="default" color="muted">
              This is a transparent surface variant. It has no background, suitable for overlays and
              cards with custom backgrounds.
            </Text>
          </Box>
        </Surface>
      </Box>
    </Box>
  );
}

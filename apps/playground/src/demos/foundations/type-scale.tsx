import { Box, Text, tokens, type TextVariant } from "@anyglade/kit";

const variants = Object.keys(tokens.textRoles) as TextVariant[];

export function TypeScaleDemo() {
  return (
    <Box flexDirection="column" gap="l">
      {variants.map((variant) => (
        <Box key={variant} flexDirection="column" gap="xs">
          <Text variant="caption" color="muted" monospace>
            {variant}
          </Text>
          <Text as="p" variant={variant}>
            The quick brown fox
          </Text>
        </Box>
      ))}
      <Box alignItems="baseline" gap="l">
        <Text variant="heading-xs" tabularNums formatter="number">
          {3290033}
        </Text>
        <Text variant="heading-xs" formatter="compact">
          {9260000}
        </Text>
        <Text monospace color="muted">
          tokens.out
        </Text>
      </Box>
    </Box>
  );
}

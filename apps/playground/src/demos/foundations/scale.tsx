import { Box, Text, tokens, type BoxStyleProps } from "@anyglade/kit";

type SpaceToken = Extract<BoxStyleProps["gap"], string>;
type RadiusToken = Extract<BoxStyleProps["borderRadius"], string>;

const spaces = Object.entries(tokens.spacing) as [SpaceToken, string][];
const radii = Object.entries(tokens.radii) as [RadiusToken, string][];

export function SpacingAndRadiusDemo() {
  return (
    <Box flexDirection="column" gap="2xl">
      <Box flexDirection="column" gap="s">
        {spaces.map(([name, value]) => (
          <Box key={name} alignItems="center" gap="l">
            <Box width={48}>
              <Text variant="caption" monospace>
                {name}
              </Text>
            </Box>
            <Box width={value} height={12} backgroundColor="background-inverse" />
          </Box>
        ))}
      </Box>
      <Box flexWrap="wrap" gap="l">
        {radii.map(([name]) => (
          <Box
            key={name}
            width={96}
            height={96}
            alignItems="center"
            justifyContent="center"
            backgroundColor="background-card"
            borderRadius={name}
          >
            <Text variant="caption" monospace>
              {name}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

import { Box, Text, tokens, type BoxStyleProps } from "@anyglade/kit";

type BackgroundToken = Extract<BoxStyleProps["backgroundColor"], string>;
type TextToken = Extract<BoxStyleProps["color"], string>;
type BorderToken = Extract<BoxStyleProps["borderColor"], string>;

const names = Object.keys(tokens.colors);
const group = <T extends string>(prefix: string) =>
  names.filter((name) => name.startsWith(prefix)) as T[];

const backgrounds = group<BackgroundToken>("background-");
const texts = group<TextToken>("text-");
const borders = group<BorderToken>("border-");

const grid = "repeat(auto-fill, minmax(11rem, 1fr))";

export function ColorsDemo() {
  return (
    <Box flexDirection="column" gap="2xl">
      <Box display="grid" gridTemplateColumns={grid} gap="l">
        {backgrounds.map((name) => (
          <Box key={name} flexDirection="column" gap="s">
            <Box
              height={64}
              backgroundColor={name}
              borderRadius="m"
              borderWidth={1}
              borderStyle="solid"
              borderColor="border-primary"
            />
            <Text variant="caption" monospace>
              {name}
            </Text>
          </Box>
        ))}
      </Box>
      <Box display="grid" gridTemplateColumns={grid} gap="l">
        {texts.map((name) => (
          <Box key={name} flexDirection="column" gap="xs" color={name}>
            <Text variant="heading-xs">Ag</Text>
            <Text variant="caption" monospace>
              {name}
            </Text>
          </Box>
        ))}
      </Box>
      <Box display="grid" gridTemplateColumns={grid} gap="l">
        {borders.map((name) => (
          <Box
            key={name}
            padding="m"
            borderRadius="m"
            borderWidth={1}
            borderStyle="solid"
            borderColor={name}
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

import { Box, ScrollShadow, Text } from "@anyglade/kit";

export function ScrollShadowDemo() {
  return (
    <Box display="block" width="100%" maxWidth={{ sm: "24rem" }}>
      <ScrollShadow className="max-h-60">
        <Box flexDirection="column" gap="l" padding="l">
          {Array.from({ length: 10 }).map((_, idx) => (
            <Text as="p" key={`scroll-shadow-lorem-content-${idx}`}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non
              risus hendrerit venenatis. Pellentesque sit amet hendrerit risus, sed porttitor quam.
              Morbi accumsan cursus enim, sed ultricies sapien.
            </Text>
          ))}
        </Box>
      </ScrollShadow>
    </Box>
  );
}

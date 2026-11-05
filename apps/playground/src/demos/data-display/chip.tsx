import { CircleDashed } from "@anyglade/kit/icons";
import { Box, Chip, Separator, Text } from "@anyglade/kit";
import React from "react";

export function ChipDemo() {
  const sizes = ["lg", "md", "sm"] as const;
  const variants = ["primary", "secondary", "tertiary", "soft"] as const;
  const colors = ["accent", "default", "success", "warning", "danger"] as const;

  return (
    <Box flexDirection="column" gap="2xl" overflowX="auto">
      {sizes.map((size, index) => (
        <React.Fragment key={size}>
          <Box flexDirection="column" gap="l">
            <Text as="h3" variant="default" weight="strong" color="muted">
              {size}
            </Text>
            {/* Color labels header */}
            <Box alignItems="center" gap="m">
              <Box width={96} flexShrink={0} display="block" />
              {colors.map((color) => (
                <Box
                  key={color}
                  width={130}
                  flexShrink={0}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text as="span" variant="caption" color="muted">
                    {color}
                  </Text>
                </Box>
              ))}
            </Box>
            <Box flexDirection="column" gap="m">
              {variants.map((variant) => (
                <Box alignItems="center" gap="m" key={variant}>
                  <Box width={96} flexShrink={0} color="text-secondary" display="block">
                    {variant}
                  </Box>
                  {colors.map((color) => (
                    <Box
                      key={color}
                      width={130}
                      flexShrink={0}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Chip color={color} size={size} variant={variant}>
                        <CircleDashed />
                        <Chip.Label>Label</Chip.Label>
                        <CircleDashed />
                      </Chip>
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          </Box>
          {index < sizes.length - 1 && <Separator />}
        </React.Fragment>
      ))}
    </Box>
  );
}

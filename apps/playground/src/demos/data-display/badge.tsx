import { Avatar, Badge, Box, Separator, Text } from "@anyglade/kit";
import React from "react";

const AVATAR_URL = "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg";

export function BadgeDemo() {
  const variants = ["primary", "secondary", "soft"] as const;
  const colors = ["accent", "default", "success", "warning", "danger"] as const;

  return (
    <Box flexDirection="column" gap="2xl">
      {variants.map((variant, index) => (
        <React.Fragment key={variant}>
          <Box flexDirection="column" gap="l">
            <Text as="h3" variant="default" weight="strong" color="muted">
              {variant}
            </Text>
            <Box alignItems="center" gap="xl">
              {colors.map((color) => (
                <Badge.Anchor key={color}>
                  <Avatar>
                    <Avatar.Image src={AVATAR_URL} />
                    <Avatar.Fallback>JD</Avatar.Fallback>
                  </Avatar>
                  <Badge color={color} size="sm" variant={variant}>
                    5
                  </Badge>
                </Badge.Anchor>
              ))}
            </Box>
          </Box>
          {index < variants.length - 1 && <Separator />}
        </React.Fragment>
      ))}
    </Box>
  );
}

import { Person } from "@anyglade/kit/icons";
import { Avatar, Box, Separator, Text } from "@anyglade/kit";

export function AvatarDemo() {
  const colors = ["accent", "default", "success", "warning", "danger"] as const;
  const variants = [
    { content: "AG", label: "letter", type: "letter" },
    { content: "AG", label: "letter soft", type: "letter-soft" },
    { content: <Person />, label: "icon", type: "icon" },
    { content: <Person />, label: "icon soft", type: "icon-soft" },
    {
      content: [
        "https://img.heroui.chat/image/avatar?w=400&h=400&u=3",
        "https://img.heroui.chat/image/avatar?w=400&h=400&u=4",
        "https://img.heroui.chat/image/avatar?w=400&h=400&u=5",
        "https://img.heroui.chat/image/avatar?w=400&h=400&u=8",
        "https://img.heroui.chat/image/avatar?w=400&h=400&u=16",
      ],
      label: "img",
      type: "img",
    },
  ] as const;

  return (
    <Box flexDirection="column" gap="l">
      {/* Color labels header */}
      <Box alignItems="center" gap="m">
        <Box width={96} flexShrink={0} display="block" />
        {colors.map((color) => (
          <Box width={80} flexShrink={0} alignItems="center" justifyContent="center" key={color}>
            <Text as="span" variant="caption" color="muted">
              {color}
            </Text>
          </Box>
        ))}
      </Box>

      <Separator />

      {/* Variant rows */}
      {variants.map((variant) => (
        <Box alignItems="center" gap="m" key={variant.label}>
          <Box width={96} flexShrink={0} color="text-secondary" display="block">
            {variant.label}
          </Box>
          {colors.map((color, colorIndex) => (
            <Box width={80} flexShrink={0} alignItems="center" justifyContent="center" key={color}>
              <Avatar color={color} variant={variant.type.includes("soft") ? "soft" : undefined}>
                {variant.type === "img" ? (
                  <>
                    <Avatar.Image
                      alt={`Avatar ${color}`}
                      src={Array.isArray(variant.content) ? variant.content[colorIndex] : ""}
                    />
                    <Avatar.Fallback>{color.charAt(0).toUpperCase()}</Avatar.Fallback>
                  </>
                ) : (
                  <Avatar.Fallback>{variant.content}</Avatar.Fallback>
                )}
              </Avatar>
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
}

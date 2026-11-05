import type { ReactNode } from "react";
import { Box } from "../box/box.tsx";
import { Text } from "../text/text.tsx";

export interface EmptyPanelProps {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}

export function EmptyPanel({ icon, title, description, actions }: EmptyPanelProps) {
  return (
    <Box
      flexDirection="column"
      alignItems="center"
      gap="m"
      padding="3xl"
      textAlign="center"
      borderRadius="m"
      borderWidth={1}
      borderStyle="solid"
      borderColor="border-primary"
    >
      {icon ? <Box color="text-secondary">{icon}</Box> : null}
      <Box flexDirection="column" gap="xs">
        <Text as="h3" variant="body">
          {title}
        </Text>
        {description ? <Text color="muted">{description}</Text> : null}
      </Box>
      {actions ? (
        <Box marginTop="s" gap="s">
          {actions}
        </Box>
      ) : null}
    </Box>
  );
}

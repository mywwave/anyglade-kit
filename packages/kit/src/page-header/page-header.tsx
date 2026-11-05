import type { ReactNode } from "react";
import { Box } from "../box/box.tsx";
import { Text } from "../text/text.tsx";

export interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <Box
      as="header"
      flexDirection={{ base: "column", md: "row" }}
      alignItems={{ base: "start", md: "center" }}
      justifyContent="between"
      gap="l"
    >
      <Box flexDirection="column" gap="xs" minWidth={0}>
        <Text as="h1" variant="heading-xs" weight="medium">
          {title}
        </Text>
        {description ? <Text color="muted">{description}</Text> : null}
      </Box>
      {actions ? (
        <Box flexShrink={0} alignItems="center" gap="s">
          {actions}
        </Box>
      ) : null}
    </Box>
  );
}

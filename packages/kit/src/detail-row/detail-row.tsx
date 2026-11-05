import type { ReactNode } from "react";
import { Box } from "../box/box.tsx";
import { Text } from "../text/text.tsx";

export interface DetailRowProps {
  label: ReactNode;
  value?: ReactNode;
  action?: ReactNode;
}

export function DetailRow({ label, value, action }: DetailRowProps) {
  return (
    <Box
      flexDirection={{ base: "column", md: "row" }}
      alignItems={{ base: "start", md: "center" }}
      columnGap="l"
      rowGap="2xs"
    >
      <Box display="block" flex="1" minWidth={0}>
        <Text color="muted" truncate>
          {label}
        </Text>
      </Box>
      <Box alignItems="center" justifyContent="between" gap="s" flex="1" minWidth={0}>
        <Text as="span" color={value ? "inherit" : "muted"}>
          {value ?? "—"}
        </Text>
        {action}
      </Box>
    </Box>
  );
}

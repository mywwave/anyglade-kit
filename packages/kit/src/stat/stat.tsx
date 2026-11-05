import type { ReactNode } from "react";
import { Box } from "../box/box.tsx";
import { Text } from "../text/text.tsx";

export interface StatProps {
  label: ReactNode;
  value: ReactNode;
  /** Context for the value, such as a change over the previous period. */
  note?: ReactNode;
}

export function Stat({ label, value, note }: StatProps) {
  return (
    <Box flexDirection="column" gap="xs" minWidth={0}>
      <Text variant="caption" color="muted">
        {label}
      </Text>
      <Text as="p" variant="heading-s" tabularNums>
        {value}
      </Text>
      {note ? (
        <Text variant="caption" color="muted">
          {note}
        </Text>
      ) : null}
    </Box>
  );
}

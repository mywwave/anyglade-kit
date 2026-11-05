import type { ReactNode } from "react";
import { Box } from "../box/box.tsx";
import { Text } from "../text/text.tsx";

export interface FrameProps {
  title?: ReactNode;
  meta?: ReactNode;
  children: ReactNode;
}

export function Frame({ title, meta, children }: FrameProps) {
  return (
    <Box
      as="section"
      flexDirection="column"
      gap="xs"
      padding="xs"
      minWidth={0}
      backgroundColor="background-canvas"
      borderRadius="frame"
    >
      {title || meta ? (
        <Box
          alignItems="center"
          justifyContent="between"
          gap="l"
          paddingHorizontal="l"
          paddingVertical="s"
        >
          <Text as="span" variant="title">
            {title}
          </Text>
          <Text as="span" variant="caption" color="muted">
            {meta}
          </Text>
        </Box>
      ) : null}
      {children}
    </Box>
  );
}

export interface FrameTileProps {
  children: ReactNode;
}

export function FrameTile({ children }: FrameTileProps) {
  return (
    <Box
      flexDirection="column"
      gap="l"
      flexGrow={1}
      minWidth={0}
      padding="xl"
      backgroundColor="background-panel"
      borderRadius="l"
    >
      {children}
    </Box>
  );
}

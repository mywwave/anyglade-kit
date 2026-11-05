"use client";

import type { ReactNode } from "react";
import { Box } from "../box/box.tsx";
import { TextSwap } from "../text-swap/text-swap.tsx";
import { Text } from "../text/text.tsx";
import { ActivityRow } from "./activity-row.tsx";

export interface ReasoningProps {
  /** What the agent is doing right now, then how long it took. */
  label: string;
  isStreaming: boolean;
  children: ReactNode;
}

export function Reasoning({ label, isStreaming, children }: ReasoningProps) {
  return (
    <ActivityRow title={<TextSwap isShimmering={isStreaming} text={label} />}>
      <Box display="block" paddingTop="xs">
        <Text color="muted">{children}</Text>
      </Box>
    </ActivityRow>
  );
}

"use client";

import type { ReactNode } from "react";
import { Box } from "../box/box.tsx";
import { Button } from "../button/button.tsx";
import { TextSwap } from "../text-swap/text-swap.tsx";
import { Text } from "../text/text.tsx";
import { ActivityRow } from "./activity-row.tsx";
import { StatusIcon, type AgentStatus, type StatusLabels } from "./status.tsx";

export interface ToolApproval {
  question: ReactNode;
  approveLabel: string;
  rejectLabel: string;
  onApprove: () => unknown;
  onReject: () => unknown;
}

export interface ToolCallProps {
  title: string;
  /** The real tool name, for those who want to know what actually ran. */
  name: string;
  status: AgentStatus;
  statusLabels: StatusLabels;
  /** Arguments and result. Usually `CodeOutput`. */
  children?: ReactNode;
  /** Shown only while `status` is `waiting`: the agent cannot go on without an answer. */
  approval?: ToolApproval;
}

export function ToolCall({ title, name, status, statusLabels, children, approval }: ToolCallProps) {
  const isWaiting = status === "waiting" && approval;

  return (
    <Box flexDirection="column" gap="s" minWidth={0}>
      <ActivityRow
        isDefaultExpanded={status === "failed"}
        leading={<StatusIcon labels={statusLabels} status={status} />}
        meta={
          <Text as="span" variant="caption" color="subtle" monospace>
            {name}
          </Text>
        }
        title={<TextSwap isShimmering={status === "running"} text={title} />}
      >
        {children ? (
          <Box flexDirection="column" gap="xs" paddingLeft="xl" paddingTop="xs">
            {children}
          </Box>
        ) : null}
      </ActivityRow>
      {isWaiting ? (
        <Box flexDirection="column" gap="s" paddingLeft="xl" motion="enter">
          <Text>{approval.question}</Text>
          <Box gap="xs">
            <Button size="sm" onPress={approval.onApprove}>
              {approval.approveLabel}
            </Button>
            <Button size="sm" variant="ghost" onPress={approval.onReject}>
              {approval.rejectLabel}
            </Button>
          </Box>
        </Box>
      ) : null}
    </Box>
  );
}

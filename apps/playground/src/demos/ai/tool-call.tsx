import { Box, Text } from "@anyglade/kit";
import { CodeOutput, ToolCall, type AgentStatus } from "@anyglade/kit/ai";
import { useState } from "react";

const statusLabels = {
  pending: "Pending",
  running: "Running",
  waiting: "Needs input",
  done: "Done",
  failed: "Canceled",
};

export function ToolCallDemo() {
  const [status, setStatus] = useState<AgentStatus>("waiting");

  return (
    <Box flexDirection="column" gap="s" width="100%" maxWidth={480}>
      <ToolCall
        approval={{
          question: "Send three emails to customers?",
          approveLabel: "Send",
          rejectLabel: "Cancel",
          onApprove: () => setStatus("done"),
          onReject: () => setStatus("failed"),
        }}
        name="send_email"
        status={status}
        statusLabels={statusLabels}
        title="Sending emails"
      >
        <CodeOutput
          copiedLabel="Copied"
          copyLabel="Copy"
          output={`{ "recipients": 3 }`}
          title="Input"
        />
      </ToolCall>
      <Text variant="caption" color="muted">
        The user's answer changes the call status.
      </Text>
    </Box>
  );
}

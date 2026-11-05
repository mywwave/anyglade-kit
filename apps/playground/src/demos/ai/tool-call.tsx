import { Box, Text } from "@anyglade/kit";
import { CodeOutput, ToolCall, type AgentStatus } from "@anyglade/kit/ai";
import { useState } from "react";

const statusLabels = {
  pending: "Ожидает",
  running: "Выполняется",
  waiting: "Нужен ответ",
  done: "Готово",
  failed: "Отменено",
};

export function ToolCallDemo() {
  const [status, setStatus] = useState<AgentStatus>("waiting");

  return (
    <Box flexDirection="column" gap="s" width="100%" maxWidth={480}>
      <ToolCall
        approval={{
          question: "Отправить три письма клиентам?",
          approveLabel: "Отправить",
          rejectLabel: "Отменить",
          onApprove: () => setStatus("done"),
          onReject: () => setStatus("failed"),
        }}
        name="send_email"
        status={status}
        statusLabels={statusLabels}
        title="Отправляю письма"
      >
        <CodeOutput
          copiedLabel="Скопировано"
          copyLabel="Скопировать"
          output={`{ "recipients": 3 }`}
          title="Вход"
        />
      </ToolCall>
      <Text variant="caption" color="muted">
        Ответ пользователя меняет статус вызова.
      </Text>
    </Box>
  );
}

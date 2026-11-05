import { Box } from "@anyglade/kit";
import { CodeOutput, Run, type StatusLabels } from "@anyglade/kit/ai";

const statusLabels: StatusLabels = {
  pending: "Ожидает",
  running: "Выполняется",
  waiting: "Нужен ответ",
  done: "Готово",
  failed: "Ошибка",
};

export function RunDemo() {
  return (
    <Box flexDirection="column" gap="l" width="100%" maxWidth={480}>
      <Run
        isDefaultExpanded
        statusLabels={statusLabels}
        summary="План"
        steps={[
          { id: "1", title: "Найти сделки", status: "done", note: "Нашлось три" },
          { id: "2", title: "Подготовить письма", status: "running" },
          { id: "3", title: "Дождаться ответа", status: "pending" },
        ]}
      />
      <Run
        isDefaultExpanded
        statusLabels={statusLabels}
        summary="Две проверки из трёх"
        steps={[
          { id: "1", title: "Валюты", status: "done" },
          {
            id: "2",
            title: "Сверка сумм",
            status: "failed",
            detail: (
              <CodeOutput
                copiedLabel="Скопировано"
                copyLabel="Скопировать"
                output={"ожидалось 3 710 000\nполучено  3 661 000"}
                title="AssertionError"
                tone="danger"
              />
            ),
          },
        ]}
      />
    </Box>
  );
}

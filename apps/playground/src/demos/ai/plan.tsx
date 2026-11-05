import { Box } from "@anyglade/kit";
import { Plan } from "@anyglade/kit/ai";

const statusLabels = {
  pending: "Ожидает",
  running: "Выполняется",
  waiting: "Нужен ответ",
  done: "Готово",
  failed: "Ошибка",
};

export function PlanDemo() {
  return (
    <Box display="block" width="100%" maxWidth={480}>
      <Plan
        formatProgress={(done, total) => `${done} из ${total} готово`}
        statusLabels={statusLabels}
        title="План: перенести диалоги"
        steps={[
          { id: "1", title: "Установить зависимость", status: "done" },
          { id: "2", title: "Заменить импорты", status: "done" },
          { id: "3", title: "Обновить типы", status: "running" },
          { id: "4", title: "Запустить проверку", status: "pending" },
        ]}
      />
    </Box>
  );
}

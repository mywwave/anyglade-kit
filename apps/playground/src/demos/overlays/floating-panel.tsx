import { Box, Button, FloatingPanel, Text } from "@anyglade/kit";
import { useRef, useState } from "react";

export function FloatingPanelDemo() {
  const trigger = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isWindowOpen, setIsWindowOpen] = useState(false);

  return (
    <Box gap="s">
      <Button variant="secondary" onPress={() => setIsWindowOpen(true)}>
        Открыть окно
      </Button>
      <FloatingPanel
        closeLabel="Закрыть окно"
        isOpen={isWindowOpen}
        moveLabel="Переместить окно"
        resize={{ label: "Изменить размер окна", defaultSize: { width: 360, height: 320 } }}
        title="Окно"
        onOpenChange={setIsWindowOpen}
      >
        <Text color="muted">
          Без кнопки-якоря панель сразу стоит на экране. Таких окон может быть много, размер
          меняется за край и за угол.
        </Text>
      </FloatingPanel>
      <Button
        ref={trigger}
        aria-expanded={isOpen}
        variant="secondary"
        onPress={() => setIsOpen(!isOpen)}
      >
        Открыть заметку
      </Button>
      <FloatingPanel
        closeLabel="Закрыть"
        isOpen={isOpen}
        moveLabel="Переместить заметку"
        pinLabel="Закрепить на экране"
        title="Заметка"
        triggerRef={trigger}
        unpinLabel="Вернуть к кнопке"
        onOpenChange={setIsOpen}
      >
        <Text color="muted">
          Потяните за заголовок или нажмите на булавку: панель останется на экране, пока вы
          работаете со страницей.
        </Text>
      </FloatingPanel>
    </Box>
  );
}

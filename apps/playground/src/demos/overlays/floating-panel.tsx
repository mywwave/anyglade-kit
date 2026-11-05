import { Box, Button, FloatingPanel, Text } from "@anyglade/kit";
import { useRef, useState } from "react";

export function FloatingPanelDemo() {
  const trigger = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box>
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

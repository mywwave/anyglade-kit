import { Box, Button, FloatingPanel, Text } from "@anyglade/kit";
import { useRef, useState } from "react";

export function FloatingPanelDemo() {
  const trigger = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isWindowOpen, setIsWindowOpen] = useState(false);

  return (
    <Box gap="s">
      <Button variant="secondary" onPress={() => setIsWindowOpen(true)}>
        Open window
      </Button>
      <FloatingPanel
        closeLabel="Close window"
        isOpen={isWindowOpen}
        moveLabel="Move window"
        resize={{ label: "Resize window", defaultSize: { width: 360, height: 320 } }}
        title="Window"
        onOpenChange={setIsWindowOpen}
      >
        <Text color="muted">
          Without an anchor button the panel opens right on the screen. You can have many of these
          windows, resized from any edge or corner.
        </Text>
      </FloatingPanel>
      <Button
        ref={trigger}
        aria-expanded={isOpen}
        variant="secondary"
        onPress={() => setIsOpen(!isOpen)}
      >
        Open note
      </Button>
      <FloatingPanel
        closeLabel="Close"
        isOpen={isOpen}
        moveLabel="Move note"
        pinLabel="Pin to screen"
        title="Note"
        triggerRef={trigger}
        unpinLabel="Return to button"
        onOpenChange={setIsOpen}
      >
        <Text color="muted">
          Drag the title or press the pin, and the panel stays on screen while you work with the
          page.
        </Text>
      </FloatingPanel>
    </Box>
  );
}

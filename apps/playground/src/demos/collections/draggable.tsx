import { Box, Draggable, ItemList, Text } from "@anyglade/kit";
import { useState } from "react";

const rooms = [
  { id: "standup", name: "Планёрка" },
  { id: "client", name: "Созвон с клиентом" },
];

export function DraggableDemo() {
  const [placed, setPlaced] = useState<Record<string, string>>({
    Анна: "standup",
    Илья: "standup",
    Ольга: "client",
  });

  return (
    <Box display="block" width="100%" maxWidth={320}>
      <ItemList
        drop={{
          canDrop: (room, name) => placed[name] !== room.id,
          onDrop: (room, name) => setPlaced((all) => ({ ...all, [name]: room.id })),
        }}
        getText={(room) => room.name}
        items={rooms}
        label="Каналы"
        renderItem={(room) => (
          <Box flexDirection="column" gap="xs">
            <Text>{room.name}</Text>
            {Object.keys(placed)
              .filter((name) => placed[name] === room.id)
              .map((name) => (
                <Draggable key={name} preview={<Text variant="caption">{name}</Text>} value={name}>
                  <Text variant="caption" color="muted">
                    {name}
                  </Text>
                </Draggable>
              ))}
          </Box>
        )}
        onOpen={() => undefined}
      />
    </Box>
  );
}

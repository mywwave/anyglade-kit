import { Box, Text, TreeNav } from "@anyglade/kit";
import { Folder } from "@anyglade/kit/icons";
import { useState } from "react";

const nodes = [
  {
    id: "sales",
    label: "Продажи",
    isGroup: true,
    leading: <Folder />,
    children: [
      {
        id: "anna",
        label: "Анна Смирнова",
        trailing: (
          <Text as="span" variant="caption" color="success">
            в сети
          </Text>
        ),
      },
      {
        id: "ilya",
        label: "Илья Воронов",
        trailing: (
          <Text as="span" variant="caption" color="muted">
            отпуск
          </Text>
        ),
      },
    ],
  },
];

export function TreeNavDemo() {
  const [selectedId, setSelectedId] = useState("anna");

  return (
    <Box display="block" width="100%" maxWidth={280}>
      <TreeNav label="Команда" nodes={nodes} selectedId={selectedId} onSelect={setSelectedId} />
    </Box>
  );
}

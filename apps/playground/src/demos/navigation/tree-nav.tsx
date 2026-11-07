import { Box, Text, TreeNav } from "@anyglade/kit";
import { Folder } from "@anyglade/kit/icons";
import { useState } from "react";

const nodes = [
  {
    id: "sales",
    label: "Sales",
    isGroup: true,
    leading: <Folder />,
    children: [
      {
        id: "anna",
        label: "Anna Wright",
        trailing: (
          <Text as="span" variant="caption" color="success">
            online
          </Text>
        ),
      },
      {
        id: "ethan",
        label: "Ethan Cole",
        trailing: (
          <Text as="span" variant="caption" color="muted">
            on vacation
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
      <TreeNav label="Team" nodes={nodes} selectedId={selectedId} onSelect={setSelectedId} />
    </Box>
  );
}

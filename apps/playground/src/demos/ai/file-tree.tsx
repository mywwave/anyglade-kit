import { Box, toast } from "@anyglade/kit";
import { FileTree } from "@anyglade/kit/ai";

const files = [
  { path: "src/report/check.ts", added: 12, removed: 3 },
  { path: "src/report/cli.ts", added: 2 },
  { path: "README.md", removed: 1 },
];

export function FileTreeDemo() {
  return (
    <Box display="block" width="100%" maxWidth={400}>
      <FileTree files={files} label="Изменённые файлы" onOpen={(path) => toast(path)} />
    </Box>
  );
}

"use client";

import { File, Folder } from "@gravity-ui/icons";
import { useMemo } from "react";
import { Box } from "../box/box.tsx";
import { Text } from "../text/text.tsx";
import { TreeNav, type TreeNavNode } from "../tree-nav/tree-nav.tsx";

export interface ChangedFile {
  path: string;
  added?: number;
  removed?: number;
}

function Changes({ file }: { file: ChangedFile }) {
  return (
    <Box as="span" display="inline-flex" gap="xs">
      {file.added ? (
        <Text as="span" variant="caption" color="success" tabularNums>
          +{file.added}
        </Text>
      ) : null}
      {file.removed ? (
        <Text as="span" variant="caption" color="danger" tabularNums>
          −{file.removed}
        </Text>
      ) : null}
    </Box>
  );
}

function buildTree(files: readonly ChangedFile[]) {
  const root: TreeNavNode & { children: TreeNavNode[] } = { id: "", label: "", children: [] };

  for (const file of files) {
    const names = file.path.split("/");
    let parent = root;
    names.forEach((name, index) => {
      const id = names.slice(0, index + 1).join("/");
      const isFile = index === names.length - 1;
      let node = parent.children.find((item) => item.id === id) as typeof root | undefined;
      if (!node) {
        node = {
          id,
          label: name,
          children: [],
          isGroup: !isFile,
          leading: isFile ? <File /> : <Folder />,
          trailing: isFile ? <Changes file={file} /> : undefined,
        };
        parent.children.push(node);
      }
      parent = node;
    });
  }
  return root.children;
}

export interface FileTreeProps {
  label: string;
  files: readonly ChangedFile[];
  onOpen?: (path: string) => void;
}

export function FileTree({ label, files, onOpen }: FileTreeProps) {
  const nodes = useMemo(() => buildTree(files), [files]);

  return <TreeNav label={label} nodes={nodes} onSelect={onOpen} />;
}

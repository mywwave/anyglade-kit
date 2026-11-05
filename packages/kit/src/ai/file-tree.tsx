"use client";

import { ChevronRight, File, Folder } from "@gravity-ui/icons";
import { useMemo } from "react";
import { Button as PressArea, Tree, TreeItem, TreeItemContent } from "react-aria-components";
import { Box } from "../box/box.tsx";
import { Text } from "../text/text.tsx";

export interface ChangedFile {
  path: string;
  added?: number;
  removed?: number;
}

interface TreeNode {
  id: string;
  name: string;
  file?: ChangedFile;
  children: TreeNode[];
}

function buildTree(files: readonly ChangedFile[]) {
  const root: TreeNode = { id: "", name: "", children: [] };

  for (const file of files) {
    let node = root;
    for (const name of file.path.split("/")) {
      const id = node.id ? `${node.id}/${name}` : name;
      let child = node.children.find((item) => item.id === id);
      if (!child) {
        child = { id, name, children: [] };
        node.children.push(child);
      }
      node = child;
    }
    node.file = file;
  }
  return root.children;
}

function folderIds(nodes: readonly TreeNode[]): string[] {
  return nodes.flatMap((node) =>
    node.children.length > 0 ? [node.id, ...folderIds(node.children)] : [],
  );
}

function Changes({ file }: { file: ChangedFile }) {
  return (
    <Box as="span" display="inline-flex" gap="xs" flexShrink={0} marginLeft="auto">
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

function Node({ node }: { node: TreeNode }) {
  const isFolder = node.children.length > 0;

  return (
    <TreeItem className="ag-tree__item" id={node.id} textValue={node.name}>
      <TreeItemContent>
        <Box alignItems="center" gap="xs" minWidth={0}>
          {isFolder ? (
            <PressArea className="ag-tree__chevron" slot="chevron">
              <ChevronRight />
            </PressArea>
          ) : null}
          <Box as="span" display="inline-flex" flexShrink={0} color="text-secondary">
            {isFolder ? <Folder /> : <File />}
          </Box>
          <Text as="span" truncate>
            {node.name}
          </Text>
          {node.file ? <Changes file={node.file} /> : null}
        </Box>
      </TreeItemContent>
      {node.children.map((child) => (
        <Node key={child.id} node={child} />
      ))}
    </TreeItem>
  );
}

export interface FileTreeProps {
  label: string;
  files: readonly ChangedFile[];
  onOpen?: (path: string) => void;
}

export function FileTree({ label, files, onOpen }: FileTreeProps) {
  const nodes = useMemo(() => buildTree(files), [files]);
  const paths = useMemo(() => new Set(files.map((file) => file.path)), [files]);

  return (
    <Tree
      aria-label={label}
      className="ag-tree"
      defaultExpandedKeys={folderIds(nodes)}
      onAction={(key) => {
        if (paths.has(String(key))) {
          onOpen?.(String(key));
        }
      }}
    >
      {nodes.map((node) => (
        <Node key={node.id} node={node} />
      ))}
    </Tree>
  );
}

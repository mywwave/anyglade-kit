"use client";

import { ChevronRight } from "@gravity-ui/icons";
import { useState, type ReactNode } from "react";
import { Button as PressArea, Tree, TreeItem, TreeItemContent } from "react-aria-components";
import { Box } from "../box/box.tsx";
import { Text } from "../text/text.tsx";

export interface TreeNavNode {
  id: string;
  label: string;
  /** An icon or an avatar. */
  leading?: ReactNode;
  /** A short status or count, next to the right edge. */
  trailing?: ReactNode;
  /** A group only opens and closes: it is never the current item. */
  isGroup?: boolean;
  children?: readonly TreeNavNode[];
}

export interface TreeNavProps {
  label: string;
  nodes: readonly TreeNavNode[];
  /** Pass it to show the current item. Without it rows act as plain actions. */
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}

function collect(nodes: readonly TreeNavNode[], test: (node: TreeNavNode) => boolean): string[] {
  return nodes.flatMap((node) => [
    ...(test(node) ? [node.id] : []),
    ...collect(node.children ?? [], test),
  ]);
}

const hasChildren = (node: TreeNavNode) => (node.children?.length ?? 0) > 0;

interface RowProps {
  node: TreeNavNode;
  onActivate: (node: TreeNavNode) => void;
}

function Row({ node, onActivate }: RowProps) {
  return (
    <TreeItem
      className="ag-tree__item"
      id={node.id}
      textValue={node.label}
      onAction={() => onActivate(node)}
    >
      <TreeItemContent>
        <Box alignItems="center" gap="s" minWidth={0}>
          {hasChildren(node) ? (
            <PressArea className="ag-tree__chevron" slot="chevron">
              <ChevronRight />
            </PressArea>
          ) : null}
          {node.leading ? (
            <Box as="span" display="inline-flex" flexShrink={0} color="text-secondary">
              {node.leading}
            </Box>
          ) : null}
          <Text as="span" truncate>
            {node.label}
          </Text>
          {node.trailing ? (
            <Box as="span" display="inline-flex" flexShrink={0} marginLeft="auto">
              {node.trailing}
            </Box>
          ) : null}
        </Box>
      </TreeItemContent>
      {node.children?.map((child) => (
        <Row key={child.id} node={child} onActivate={onActivate} />
      ))}
    </TreeItem>
  );
}

/** A file-tree sidebar: everything opens in place, and a chosen item stays marked. */
export function TreeNav({ label, nodes, selectedId, onSelect }: TreeNavProps) {
  const [expanded, setExpanded] = useState(() => new Set(collect(nodes, hasChildren)));
  const isSelectable = selectedId !== undefined;

  function toggle(id: string) {
    setExpanded((current) => {
      const next = new Set(current);
      if (!next.delete(id)) {
        next.add(id);
      }
      return next;
    });
  }

  function activate(node: TreeNavNode) {
    if (node.isGroup) {
      toggle(node.id);
    } else if (!isSelectable) {
      onSelect?.(node.id);
    }
  }

  return (
    <Tree
      aria-label={label}
      className="ag-tree"
      disabledBehavior="selection"
      disabledKeys={collect(nodes, (node) => Boolean(node.isGroup))}
      expandedKeys={expanded}
      selectedKeys={selectedId ? [selectedId] : []}
      selectionMode={isSelectable ? "single" : "none"}
      onExpandedChange={(keys) => setExpanded(new Set([...keys].map(String)))}
      onSelectionChange={(keys) => {
        const [key] = keys === "all" ? [] : keys;
        if (key !== undefined) {
          onSelect?.(String(key));
        }
      }}
    >
      {nodes.map((node) => (
        <Row key={node.id} node={node} onActivate={activate} />
      ))}
    </Tree>
  );
}

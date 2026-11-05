"use client";

import { useId, type ReactNode } from "react";
import { GridList, GridListItem } from "react-aria-components";

export interface ItemListProps<T extends { id: string }> {
  label: string;
  items: readonly T[];
  /** The open item. It stays marked while focus moves elsewhere. */
  currentId?: string | null;
  onOpen: (id: string) => void;
  /** What a screen reader and type-ahead get for the row. */
  getText: (item: T) => string;
  /** The row may hold its own buttons, which a plain list box does not allow. */
  renderItem: (item: T) => ReactNode;
}

/** Rows that open something and carry their own actions: chats, mail, tasks. */
export function ItemList<T extends { id: string }>({
  label,
  items,
  currentId,
  onOpen,
  getText,
  renderItem,
}: ItemListProps<T>) {
  const scope = useId().replace(/\W/g, "");

  return (
    <GridList aria-label={label} className="ag-item-list" selectionMode="none">
      {items.map((item) => (
        <GridListItem
          key={item.id}
          className={({ isHovered, isFocusVisible }) =>
            [
              "ag-item-list__row",
              item.id === currentId ? "ag-item-list__row--current" : "",
              isHovered ? "ag-item-list__row--hovered" : "",
              isFocusVisible ? "ag-item-list__row--focused" : "",
            ].join(" ")
          }
          id={item.id}
          style={{ viewTransitionName: `${scope}-${item.id}` }}
          textValue={getText(item)}
          onAction={() => onOpen(item.id)}
        >
          {renderItem(item)}
        </GridListItem>
      ))}
    </GridList>
  );
}

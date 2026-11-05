"use client";

import { Dropdown } from "@heroui/react";
import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { useContextMenu } from "react-aria";
import { GridList, GridListItem, Pressable } from "react-aria-components";
import { createPortal } from "react-dom";
import { useRowFlip } from "./use-row-flip.ts";

interface MenuPoint {
  id: string;
  x: number;
  y: number;
}

export interface ItemListProps<T extends { id: string }> {
  label: string;
  items: readonly T[];
  /** The open item. It stays marked while focus moves elsewhere. */
  currentId?: string | null;
  onOpen: (id: string) => void;
  /** Alt + click or Alt + Enter: the second way to open, usually in its own window. */
  onAltOpen?: (id: string) => void;
  /** What a screen reader and type-ahead get for the row. */
  getText: (item: T) => string;
  /** The row may hold its own buttons, which a plain list box does not allow. */
  renderItem: (item: T) => ReactNode;
  /** Opens on right click, long press and the menu key. `renderItems` returns `Dropdown.Item`s. */
  menu?: { label: string; renderItems: (item: T) => ReactNode };
}

interface RowProps {
  id: string;
  text: string;
  isCurrent: boolean;
  isMenuTarget: boolean;
  onOpen: (id: string) => void;
  onMenu?: (point: MenuPoint) => void;
  children: ReactNode;
}

function Row({ id, text, isCurrent, isMenuTarget, onOpen, onMenu, children }: RowProps) {
  const { contextMenuProps } = useContextMenu({
    onContextMenu: onMenu
      ? ({ target, x, y }) => {
          const box = target.getBoundingClientRect();
          onMenu({ id, x: box.x + x, y: box.y + y });
        }
      : undefined,
  });

  return (
    <GridListItem
      {...(contextMenuProps as ComponentProps<typeof GridListItem>)}
      className={({ isHovered, isFocusVisible }) =>
        [
          "ag-item-list__row",
          isCurrent ? "ag-item-list__row--current" : "",
          isHovered || isMenuTarget ? "ag-item-list__row--hovered" : "",
          isFocusVisible ? "ag-item-list__row--focused" : "",
        ].join(" ")
      }
      id={id}
      textValue={text}
      onAction={() => onOpen(id)}
    >
      {children}
    </GridListItem>
  );
}

/** Rows that open something and carry their own actions: chats, mail, tasks. */
export function ItemList<T extends { id: string }>({
  label,
  items,
  currentId,
  onOpen,
  onAltOpen,
  getText,
  renderItem,
  menu,
}: ItemListProps<T>) {
  const list = useRef<HTMLDivElement>(null);
  const [point, setPoint] = useState<MenuPoint | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const target = items.find((item) => item.id === point?.id);
  const isAltHeld = useRef(false);
  useRowFlip(list);

  // A row's action carries no event, so the key is read as the press begins.
  useEffect(() => {
    function noteAlt(event: KeyboardEvent | PointerEvent) {
      isAltHeld.current = event.altKey;
    }

    document.addEventListener("keydown", noteAlt, true);
    document.addEventListener("pointerdown", noteAlt, true);
    return () => {
      document.removeEventListener("keydown", noteAlt, true);
      document.removeEventListener("pointerdown", noteAlt, true);
    };
  }, []);

  // The open menu covers the page, so a second right click would bring up the browser's own.
  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    function dismiss(event: MouseEvent) {
      event.preventDefault();
      setIsMenuOpen(false);
    }

    document.addEventListener("contextmenu", dismiss);
    return () => document.removeEventListener("contextmenu", dismiss);
  }, [isMenuOpen]);

  function openItem(id: string) {
    if (isAltHeld.current && onAltOpen) {
      onAltOpen(id);
    } else {
      onOpen(id);
    }
  }

  function openMenu(next: MenuPoint) {
    setPoint(next);
    setIsMenuOpen(true);
  }

  return (
    <>
      <GridList ref={list} aria-label={label} className="ag-item-list" selectionMode="none">
        {items.map((item) => (
          <Row
            key={item.id}
            id={item.id}
            isCurrent={item.id === currentId}
            isMenuTarget={isMenuOpen && item.id === point?.id}
            text={getText(item)}
            onMenu={menu ? openMenu : undefined}
            onOpen={openItem}
          >
            {renderItem(item)}
          </Row>
        ))}
      </GridList>
      {menu && point && target ? (
        <Dropdown isOpen={isMenuOpen} onOpenChange={setIsMenuOpen}>
          {createPortal(
            <Pressable>
              <span
                aria-hidden
                className="ag-item-list__anchor"
                style={{ left: point.x, top: point.y }}
                tabIndex={-1}
              />
            </Pressable>,
            document.body,
          )}
          <Dropdown.Popover offset={4} placement="bottom start">
            <Dropdown.Menu aria-label={menu.label}>{menu.renderItems(target)}</Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      ) : null}
    </>
  );
}

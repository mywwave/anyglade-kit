"use client";

import { useRef, type ReactNode } from "react";
import { DragPreview, useDrag, type DragPreviewRenderer } from "react-aria/useDrag";
import { useDrop, type DropOptions } from "react-aria/useDrop";

const DRAG_TYPE = "application/x-anyglade-item";

/** The browser hides dragged data until the drop, but a target must answer while hovered. */
let carried: string | null = null;

export interface DraggableProps {
  /** What a target receives. Targets are `ItemList` rows with `drop`. */
  value: string;
  /** Follows the pointer: a short name, not the whole row. */
  preview: ReactNode;
  isDisabled?: boolean;
  children: ReactNode;
}

/** Drag is a shortcut: always offer the same action in a menu for touch and the keyboard. */
export function Draggable({ value, preview, isDisabled = false, children }: DraggableProps) {
  const previewRenderer = useRef<DragPreviewRenderer>(null);
  const { dragProps, isDragging } = useDrag({
    isDisabled,
    preview: previewRenderer,
    getAllowedDropOperations: () => ["move"],
    getItems: () => [{ [DRAG_TYPE]: value }],
    onDragStart: () => {
      carried = value;
    },
    onDragEnd: () => {
      carried = null;
    },
  });

  return (
    <div
      {...dragProps}
      className="ag-draggable"
      data-disabled={isDisabled ? "" : undefined}
      data-dragging={isDragging ? "" : undefined}
    >
      {children}
      <DragPreview ref={previewRenderer}>
        {() => <div className="ag-drag-preview">{preview}</div>}
      </DragPreview>
    </div>
  );
}

export interface DropRules {
  canDrop: (value: string) => boolean;
  onDrop: (value: string) => void;
}

/** Answers for the carried value, so a row that refuses it never lights up. */
export function useDropValue(ref: DropOptions["ref"], rules: DropRules | undefined) {
  return useDrop({
    ref,
    isDisabled: !rules,
    getDropOperation: () => (carried !== null && rules?.canDrop(carried) ? "move" : "cancel"),
    onDrop: () => {
      if (carried !== null && rules?.canDrop(carried)) {
        rules.onDrop(carried);
      }
    },
  });
}

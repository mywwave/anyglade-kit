"use client";

import { Table } from "@heroui/react";
import { useMemo, useState, type ComponentProps, type ReactNode } from "react";
import type { SortDescriptor } from "react-aria-components";
import { withTransition } from "../motion/with-transition.ts";

export interface SortableColumnProps extends Omit<
  ComponentProps<typeof Table.Column>,
  "allowsSorting" | "children"
> {
  children: ReactNode;
}

export function SortableColumn({ children, ...props }: SortableColumnProps) {
  return (
    <Table.Column allowsSorting {...props}>
      {({ sortDirection }) => (
        <Table.SortableColumnHeader sortDirection={sortDirection}>
          {children}
        </Table.SortableColumnHeader>
      )}
    </Table.Column>
  );
}

/** One entry per sortable column id. Keep the object outside the component. */
export type SortAccessors<T> = Record<string, (item: T) => string | number>;

export function useTableSort<T>(
  items: readonly T[],
  accessors: SortAccessors<T>,
  initial: SortDescriptor,
) {
  const [sortDescriptor, setSortDescriptor] = useState(initial);

  const sorted = useMemo(() => {
    const accessor = accessors[String(sortDescriptor.column)];
    if (!accessor) {
      return [...items];
    }
    const direction = sortDescriptor.direction === "descending" ? -1 : 1;
    return items.toSorted((a, b) => {
      const left = accessor(a);
      const right = accessor(b);
      const order =
        typeof left === "number" && typeof right === "number"
          ? left - right
          : String(left).localeCompare(String(right));
      return order * direction;
    });
  }, [items, accessors, sortDescriptor]);

  function onSortChange(next: SortDescriptor) {
    withTransition(() => setSortDescriptor(next));
  }

  return { sorted, tableProps: { sortDescriptor, onSortChange } };
}

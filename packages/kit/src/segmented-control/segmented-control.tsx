"use client";

import { ToggleButton, ToggleButtonGroup } from "@heroui/react";
import type { ReactNode } from "react";
import { SelectionIndicator } from "react-aria-components";

export interface SegmentedControlProps<T extends string> {
  label: string;
  options: readonly { id: T; label: ReactNode }[];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <ToggleButtonGroup
      aria-label={label}
      className="ag-segmented"
      disallowEmptySelection
      isDetached
      selectedKeys={new Set([value])}
      selectionMode="single"
      size="sm"
      onSelectionChange={(keys) => {
        const [key] = keys;
        onChange(key as T);
      }}
    >
      {options.map((option) => (
        <ToggleButton key={option.id} className="ag-segmented__item" id={option.id}>
          <SelectionIndicator className="ag-segmented__indicator" />
          {option.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

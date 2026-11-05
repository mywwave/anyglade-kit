"use client";

import { ListBox, Select, Tooltip } from "@heroui/react";
import { ArrowRotateLeft } from "@gravity-ui/icons";
import type { ReactNode } from "react";
import { Box } from "../box/box.tsx";
import { Button } from "../button/button.tsx";
import { Text } from "../text/text.tsx";

interface Option<T extends string> {
  id: T;
  label: string;
}

interface CompactSelectProps<T extends string> {
  label: string;
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
}

function CompactSelect<T extends string>({
  label,
  options,
  value,
  onChange,
}: CompactSelectProps<T>) {
  return (
    <Select
      aria-label={label}
      className="ag-compact-select"
      value={value}
      onChange={(key) => onChange(key as T)}
    >
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover className="min-w-44">
        <ListBox>
          {options.map((option) => (
            <ListBox.Item key={option.id} id={option.id} textValue={option.label}>
              {option.label}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}

export interface ModelPickerProps<M extends string, E extends string> {
  modelLabel: string;
  models: readonly Option<M>[];
  model: M;
  onModelChange: (model: M) => void;
  effortLabel: string;
  efforts: readonly Option<E>[];
  effort: E;
  onEffortChange: (effort: E) => void;
}

export function ModelPicker<M extends string, E extends string>({
  modelLabel,
  models,
  model,
  onModelChange,
  effortLabel,
  efforts,
  effort,
  onEffortChange,
}: ModelPickerProps<M, E>) {
  return (
    <Box alignItems="center" gap="2xs" minWidth={0}>
      <CompactSelect label={modelLabel} options={models} value={model} onChange={onModelChange} />
      <CompactSelect
        label={effortLabel}
        options={efforts}
        value={effort}
        onChange={onEffortChange}
      />
    </Box>
  );
}

const WARNING_SHARE = 0.8;
const DANGER_SHARE = 0.95;

function meterColor(share: number) {
  if (share >= DANGER_SHARE) return "danger";
  return share >= WARNING_SHARE ? "warning" : "muted";
}

export interface ContextMeterProps {
  label: string;
  used: number;
  limit: number;
  /** Exact numbers, shown on demand. */
  detail: ReactNode;
}

/** A number, not a ring: a thin ring beside a running agent reads as a loader. */
export function ContextMeter({ label, used, limit, detail }: ContextMeterProps) {
  const share = Math.min(used / limit, 1);

  return (
    <Tooltip delay={0}>
      <Button aria-label={label} size="sm" variant="ghost">
        <Text as="span" variant="caption" color={meterColor(share)} tabularNums>
          {Math.round(share * 100)}%
        </Text>
      </Button>
      <Tooltip.Content>
        <Text as="p">{detail}</Text>
      </Tooltip.Content>
    </Tooltip>
  );
}

export interface CheckpointProps {
  label: string;
  restoreLabel: string;
  onRestore: () => unknown;
}

export function Checkpoint({ label, restoreLabel, onRestore }: CheckpointProps) {
  return (
    <Box alignItems="center" justifyContent="center" gap="s" motion="fade">
      <Text as="span" variant="caption" color="muted">
        {label}
      </Text>
      <Button size="sm" variant="ghost" onPress={onRestore}>
        <ArrowRotateLeft />
        {restoreLabel}
      </Button>
    </Box>
  );
}

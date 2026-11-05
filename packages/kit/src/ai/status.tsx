"use client";

import { Check, Circle, CircleCheck, CircleXmark, TriangleExclamation } from "@gravity-ui/icons";
import { Spinner } from "@heroui/react";
import type { ComponentProps } from "react";
import { Box } from "../box/box.tsx";

export type AgentStatus = "pending" | "running" | "waiting" | "done" | "failed";

/** Words for screen readers: the icon alone says nothing to them. */
export type StatusLabels = Record<AgentStatus, string>;

const icons = {
  pending: { Icon: Circle, color: "text-tertiary" },
  waiting: { Icon: TriangleExclamation, color: "text-warning" },
  done: { Icon: Check, color: "text-secondary" },
  failed: { Icon: CircleXmark, color: "text-danger" },
} satisfies Record<
  Exclude<AgentStatus, "running">,
  { Icon: unknown; color: ComponentProps<typeof Box>["color"] }
>;

interface StatusIconProps {
  status: AgentStatus;
  labels: StatusLabels;
  /** A plan is a checklist, so its finished steps are ticked circles. */
  isChecklist?: boolean;
}

export function StatusIcon({ status, labels, isChecklist = false }: StatusIconProps) {
  const label = <span className="ag-visually-hidden">{labels[status]}</span>;

  if (status === "running") {
    return (
      <Box key={status} as="span" display="inline-flex" color="text-secondary" motion="pop">
        <span className="ag-status">
          <Spinner color="current" size="sm" />
        </span>
        {label}
      </Box>
    );
  }

  const { color, Icon: StatusGlyph } = icons[status];
  const Icon = isChecklist && status === "done" ? CircleCheck : StatusGlyph;
  return (
    <Box key={status} as="span" display="inline-flex" color={color} motion="pop">
      <span className="ag-status">
        <Icon />
      </span>
      {label}
    </Box>
  );
}

const ORDER: readonly AgentStatus[] = ["failed", "waiting", "running", "pending"];

/** The status a group reports: the most urgent one among its members. */
export function overallStatus(statuses: readonly AgentStatus[]): AgentStatus {
  return ORDER.find((status) => statuses.includes(status)) ?? "done";
}

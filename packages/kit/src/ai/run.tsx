"use client";

import { ListCheck } from "@gravity-ui/icons";
import type { CSSProperties, ReactNode } from "react";
import { Box } from "../box/box.tsx";
import { Shimmer } from "../shimmer/shimmer.tsx";
import { TextSwap } from "../text-swap/text-swap.tsx";
import { Text } from "../text/text.tsx";
import { ActivityRow } from "./activity-row.tsx";
import { StatusIcon, overallStatus, type AgentStatus, type StatusLabels } from "./status.tsx";

export interface RunStep {
  id: string;
  title: string;
  status: AgentStatus;
  /** One short fact. It sits on the title line, so a late note never moves the rows below. */
  note?: string;
  /** Steps of a subagent. They follow their parent with an indent, without a second header. */
  steps?: readonly RunStep[];
  /** Anything worth reading: output, a file tree. */
  detail?: ReactNode;
}

export interface RunProps {
  steps: readonly RunStep[];
  statusLabels: StatusLabels;
  /** Shown once nothing is running. A running step always takes the header. */
  summary: string;
  isDefaultExpanded?: boolean;
}

interface StepListProps {
  steps: readonly RunStep[];
  statusLabels: StatusLabels;
  isPlan?: boolean;
}

function StepList({ steps, statusLabels, isPlan = false }: StepListProps) {
  const rows = steps.map((step, index) => {
    const isQuiet = isPlan
      ? step.status === "pending" || step.status === "running"
      : step.status !== "failed" && step.status !== "waiting";

    return (
      <li key={step.id} className="ag-step" style={{ "--ag-step-index": index } as CSSProperties}>
        <Box alignItems="center" gap="s" minWidth={0}>
          <StatusIcon isChecklist={isPlan} labels={statusLabels} status={step.status} />
          <Text as="span" color={isQuiet ? "muted" : "default"} truncate>
            <Shimmer isActive={step.status === "running"}>{step.title}</Shimmer>
          </Text>
          {step.note ? (
            <Box as="span" display="inline-flex" flexShrink={0} motion="fade">
              <Text as="span" variant="caption" color="subtle">
                {step.note}
              </Text>
            </Box>
          ) : null}
        </Box>
        {step.steps || step.detail ? (
          <Box flexDirection="column" paddingLeft="xl" minWidth={0}>
            {step.steps ? <StepList statusLabels={statusLabels} steps={step.steps} /> : null}
            {step.detail ? (
              <Box display="block" paddingTop="xs" minWidth={0}>
                {step.detail}
              </Box>
            ) : null}
          </Box>
        ) : null}
      </li>
    );
  });

  return isPlan ? (
    <ol className="ag-plan__steps">{rows}</ol>
  ) : (
    <Box as="ol" flexDirection="column" gap="xs" paddingTop="xs">
      {rows}
    </Box>
  );
}

/**
 * One list of steps covers plans, queues, tasks, reasoning chains, subagents and
 * test runs: they differ in data, not in shape.
 */
export function Run({ steps, statusLabels, summary, isDefaultExpanded = false }: RunProps) {
  const status = overallStatus(steps.map((step) => step.status));
  const current = steps.find((step) => step.status === "running");
  const doneCount = steps.filter((step) => step.status === "done").length;

  return (
    <ActivityRow
      isDefaultExpanded={isDefaultExpanded}
      leading={<StatusIcon labels={statusLabels} status={status} />}
      meta={
        <Text as="span" variant="caption" color="subtle" tabularNums>
          <TextSwap text={`${doneCount}/${steps.length}`} />
        </Text>
      }
      title={<TextSwap isShimmering={Boolean(current)} text={current?.title ?? summary} />}
    >
      <StepList statusLabels={statusLabels} steps={steps} />
    </ActivityRow>
  );
}

export interface PlanProps {
  title: string;
  steps: readonly RunStep[];
  statusLabels: StatusLabels;
  /** Wording of the progress, such as "2 of 4 done". */
  formatProgress: (done: number, total: number) => string;
}

/** What the agent intends to do, as its own object: a titled checklist on a rail. */
export function Plan({ title, steps, statusLabels, formatProgress }: PlanProps) {
  const doneCount = steps.filter((step) => step.status === "done").length;

  return (
    <ActivityRow
      isDefaultExpanded
      leading={
        <Box as="span" display="inline-flex" color="text-secondary">
          <span className="ag-status">
            <ListCheck />
          </span>
        </Box>
      }
      meta={
        <Text as="span" variant="caption" color="subtle" tabularNums>
          <TextSwap text={formatProgress(doneCount, steps.length)} />
        </Text>
      }
      title={
        <Text as="span" color="default">
          {title}
        </Text>
      }
    >
      <StepList isPlan statusLabels={statusLabels} steps={steps} />
    </ActivityRow>
  );
}

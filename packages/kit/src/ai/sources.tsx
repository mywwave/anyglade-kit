"use client";

import { Link, Popover } from "@heroui/react";
import { Button as PressArea } from "react-aria-components";
import { Box } from "../box/box.tsx";
import { Text } from "../text/text.tsx";
import { ActivityRow } from "./activity-row.tsx";

export interface Source {
  title: string;
  url: string;
  note?: string;
}

function SourceLink({ source }: { source: Source }) {
  return (
    <Box flexDirection="column" minWidth={0}>
      <Link href={source.url} rel="noreferrer" target="_blank">
        {source.title}
      </Link>
      {source.note ? (
        <Text as="span" variant="caption" color="muted">
          {source.note}
        </Text>
      ) : null}
    </Box>
  );
}

export interface SourcesProps {
  label: string;
  items: readonly Source[];
}

export function Sources({ label, items }: SourcesProps) {
  return (
    <Box display="block" motion="enter">
      <ActivityRow title={label}>
        <Box as="ul" flexDirection="column" gap="xs" paddingTop="xs">
          {items.map((source) => (
            <Box as="li" key={source.url} display="block">
              <SourceLink source={source} />
            </Box>
          ))}
        </Box>
      </ActivityRow>
    </Box>
  );
}

export interface CitationProps {
  index: number;
  source: Source;
}

/** Opens on press, not hover: hover does not exist on a phone and a link inside must stay reachable. */
export function Citation({ index, source }: CitationProps) {
  return (
    <Popover>
      <PressArea aria-label={source.title} className="ag-citation">
        {index}
      </PressArea>
      <Popover.Content className="max-w-72">
        <Popover.Dialog aria-label={source.title}>
          <SourceLink source={source} />
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );
}

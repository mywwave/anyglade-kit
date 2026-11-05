"use client";

import { Disclosure } from "@heroui/react";
import type { ReactNode } from "react";
import { Button as PressArea } from "react-aria-components";
import { Box } from "../box/box.tsx";
import { Text } from "../text/text.tsx";

export interface ActivityRowProps {
  leading?: ReactNode;
  title: ReactNode;
  /** A count or a name. It stays next to the title, where the eye already is. */
  meta?: ReactNode;
  isDefaultExpanded?: boolean;
  children?: ReactNode;
}

/** One quiet line for everything the agent does, so a long run reads as a list, not as blocks. */
export function ActivityRow({
  leading,
  title,
  meta,
  isDefaultExpanded = false,
  children,
}: ActivityRowProps) {
  return (
    <Disclosure className="ag-activity" defaultExpanded={isDefaultExpanded}>
      <Disclosure.Heading>
        <PressArea className="ag-activity__trigger" slot="trigger">
          {leading}
          <Text as="span" truncate>
            {title}
          </Text>
          {meta ? (
            <Box as="span" display="inline-flex" flexShrink={0}>
              {meta}
            </Box>
          ) : null}
          {children ? <Disclosure.Indicator /> : null}
        </PressArea>
      </Disclosure.Heading>
      {children ? (
        <Disclosure.Content>
          <Disclosure.Body>{children}</Disclosure.Body>
        </Disclosure.Content>
      ) : null}
    </Disclosure>
  );
}

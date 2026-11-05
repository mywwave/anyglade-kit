"use client";

import { useState } from "react";
import { Box } from "../box/box.tsx";
import { Text } from "../text/text.tsx";

const MAX_COUNT = 99;

export interface CountBadgeProps {
  count: number;
}

/** How many new things wait for a person. It pops when the number grows, not when it mounts. */
export function CountBadge({ count }: CountBadgeProps) {
  const [firstCount] = useState(count);

  return (
    <Box
      key={count}
      as="span"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
      minWidth={20}
      height={20}
      paddingHorizontal="xs"
      backgroundColor="background-inverse"
      color="text-inverse"
      borderRadius="full"
      motion={count === firstCount ? undefined : "pop"}
    >
      <Text as="span" variant="caption" weight="medium" tabularNums>
        {count > MAX_COUNT ? `${MAX_COUNT}+` : count}
      </Text>
    </Box>
  );
}

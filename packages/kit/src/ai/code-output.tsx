"use client";

import { useEffect, useRef } from "react";
import { Box } from "../box/box.tsx";
import { CopyButton } from "../copy-button/copy-button.tsx";
import { Text } from "../text/text.tsx";

export interface CodeOutputProps {
  /** A command, a file name or an error message. */
  title: string;
  output: string;
  copyLabel: string;
  copiedLabel: string;
  /** Terminal output is neutral. A stack trace uses `danger`. */
  tone?: "default" | "danger";
  isStreaming?: boolean;
}

export function CodeOutput({
  title,
  output,
  copyLabel,
  copiedLabel,
  tone = "default",
  isStreaming = false,
}: CodeOutputProps) {
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isStreaming && scroller.current) {
      scroller.current.scrollTop = scroller.current.scrollHeight;
    }
  }, [isStreaming, output]);

  return (
    <Box
      flexDirection="column"
      gap="xs"
      minWidth={0}
      padding="m"
      backgroundColor="background-card"
      borderRadius="m"
    >
      <Box alignItems="center" justifyContent="between" gap="s">
        <Text
          as="span"
          variant="caption"
          color={tone === "danger" ? "danger" : "muted"}
          monospace
          truncate
        >
          {title}
        </Text>
        <CopyButton copiedLabel={copiedLabel} label={copyLabel} value={output} />
      </Box>
      <Box ref={scroller} display="block" maxHeight={220} overflowY="auto" overflowX="auto">
        <pre className="ag-code">{output}</pre>
      </Box>
    </Box>
  );
}

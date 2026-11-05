"use client";

import { Children, memo, type ReactNode } from "react";
import { Box } from "../box/box.tsx";
import { Text } from "../text/text.tsx";
import { Citation, type Source } from "./sources.tsx";

export interface MessageProps {
  /** `contact` is the other person in a chat: a bubble on the left. */
  author: "user" | "assistant" | "contact";
  children: ReactNode;
  /** Copy, retry and so on, under the reply. */
  actions?: ReactNode;
  /** A bubble's corner: `DeliveryStatus` and the like. It keeps to the last line. */
  meta?: ReactNode;
  /** Already there when the chat opened, so it does not animate. */
  isHistory?: boolean;
}

export function Message({ author, children, actions, meta, isHistory = false }: MessageProps) {
  if (author !== "assistant") {
    return (
      <Box
        flexDirection="column"
        alignItems={author === "user" ? "end" : "start"}
        motion={isHistory ? undefined : "enter"}
      >
        <Box
          flexWrap="wrap"
          alignItems="end"
          justifyContent="end"
          columnGap="s"
          maxWidth="80%"
          paddingHorizontal="l"
          paddingVertical="m"
          backgroundColor="background-card"
          borderRadius="l"
        >
          <Box flexDirection="column" gap="s" minWidth={0}>
            {children}
          </Box>
          {meta}
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" gap="s" minWidth={0}>
      {Children.toArray(children).map((part, index) => (
        <Box
          key={index}
          flexDirection="column"
          minWidth={0}
          motion={isHistory ? undefined : "enter"}
        >
          {part}
        </Box>
      ))}
      {actions ? (
        <Box alignItems="center" gap="xs" motion="fade">
          {actions}
        </Box>
      ) : null}
    </Box>
  );
}

const NO_SOURCES: readonly Source[] = [];
const CITATION = /^\[(\d+)\]$/;
const TOKENS = /(\[\d+\]|\s+)/;

interface TokenProps {
  token: string;
  sources: readonly Source[];
  isStreaming: boolean;
}

function Token({ token, sources, isStreaming }: TokenProps) {
  const index = Number(CITATION.exec(token)?.[1]);
  const source = sources[index - 1];

  if (source) {
    return <Citation index={index} source={source} />;
  }
  return /^\s*$/.test(token) ? (
    token
  ) : (
    <span className={isStreaming ? "ag-motion-fade" : undefined}>{token}</span>
  );
}

export interface StreamingTextProps {
  text: string;
  isStreaming: boolean;
  /** `[1]` in the text becomes a citation of the first source. */
  sources?: readonly Source[];
}

interface ParagraphProps {
  text: string;
  sources: readonly Source[];
  isStreaming: boolean;
}

/** Memoized: a new word re-renders its paragraph, not the whole answer. */
const Paragraph = memo(function Paragraph({ text, sources, isStreaming }: ParagraphProps) {
  return (
    <Text as="p">
      {text.split(TOKENS).map((token, index) => (
        <Token key={index} isStreaming={isStreaming} sources={sources} token={token} />
      ))}
    </Text>
  );
});

/** Only new words fade in, so an already read line never moves. */
export function StreamingText({ text, isStreaming, sources = NO_SOURCES }: StreamingTextProps) {
  return (
    <Box flexDirection="column" gap="m" minWidth={0}>
      {text.split(/\n{2,}/).map((paragraph, index) => (
        <Paragraph key={index} isStreaming={isStreaming} sources={sources} text={paragraph} />
      ))}
    </Box>
  );
}

import type { ReactNode } from "react";
import { Box } from "../box/box.tsx";
import { Text } from "../text/text.tsx";

export interface MasonryProps {
  /** `MasonryTile`s. Each takes the height of its content, columns fill top to bottom. */
  children: ReactNode;
}

/** A gallery of tiles of different heights: one column on a phone, two from `md`, three from `lg`. */
export function Masonry({ children }: MasonryProps) {
  return (
    <Box display="block" columns={{ base: 1, md: 2, lg: 3 }} columnGap="m">
      {children}
    </Box>
  );
}

export interface MasonryTileProps {
  /** What the piece is called, under it. */
  title: string;
  /** A short fact about it beside the title, such as how it is used. */
  note?: string;
  /** Anchor for a link to this tile. */
  id?: string;
  /** Lets the tile glide to its new place when the gallery is filtered. */
  viewTransitionName?: string;
  /** The live piece itself. It stands in the middle of a calm stage. */
  children: ReactNode;
}

export function MasonryTile({ title, note, id, viewTransitionName, children }: MasonryTileProps) {
  return (
    <Box
      as="article"
      id={id}
      flexDirection="column"
      minWidth={0}
      marginBottom="m"
      breakInside="avoid"
      backgroundColor="background-card"
      borderRadius="xl"
      viewTransitionName={viewTransitionName}
    >
      <Box
        alignItems="center"
        justifyContent="center"
        minWidth={0}
        minHeight={280}
        paddingHorizontal="xl"
        paddingTop="3xl"
        paddingBottom="xl"
      >
        {children}
      </Box>
      <Box
        alignItems="baseline"
        justifyContent="between"
        gap="m"
        paddingHorizontal="xl"
        paddingBottom="l"
      >
        <Text as="h3" variant="title">
          {title}
        </Text>
        {note ? (
          <Text variant="caption" color="muted">
            {note}
          </Text>
        ) : null}
      </Box>
    </Box>
  );
}

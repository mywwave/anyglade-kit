import { Box, Masonry, MasonryTile, SegmentedControl, withTransition } from "@anyglade/kit";
import { useState } from "react";
import type { Demo, DemoCategory } from "./demos.ts";

/** Folders of `blocks/` are kinds of interaction. */
const kindLabels: Record<string, string> = {
  press: "Press",
  drag: "Drag",
  type: "Type",
  loading: "Loading",
};

interface Tile extends Demo {
  kind: string;
}

/** Takes one tile of each kind in turn, so neighbours differ. */
function interleave(categories: readonly DemoCategory[]): Tile[] {
  const queues = categories.map((category) =>
    category.demos.map((demo) => ({ ...demo, kind: category.id })),
  );
  const tiles: Tile[] = [];
  for (let index = 0; queues.some((queue) => index < queue.length); index += 1) {
    for (const queue of queues) {
      const tile = queue[index];
      if (tile) {
        tiles.push(tile);
      }
    }
  }
  return tiles;
}

const kindOrder = Object.keys(kindLabels);
const rank = (id: string) => (kindOrder.includes(id) ? kindOrder.indexOf(id) : kindOrder.length);

export function BlockGallery({ categories: unordered }: { categories: readonly DemoCategory[] }) {
  const [kind, setKind] = useState("all");
  const categories = unordered.toSorted((a, b) => rank(a.id) - rank(b.id));
  const options = [
    { id: "all", label: "All" },
    ...categories.map((category) => ({
      id: category.id,
      label: kindLabels[category.id] ?? category.label,
    })),
  ];
  const tiles = interleave(
    kind === "all" ? categories : categories.filter((category) => category.id === kind),
  );

  return (
    <Box flexDirection="column" alignItems="start" gap="xl">
      <SegmentedControl
        label="Interaction"
        options={options}
        value={kind}
        onChange={(next) => withTransition(() => setKind(next))}
      />
      <Box display="block" width="100%">
        <Masonry>
          {tiles.map(({ name, title, kind: tileKind, Component }) => (
            <MasonryTile
              key={name}
              id={name}
              note={kindLabels[tileKind]}
              title={title}
              viewTransitionName={`block-${name}`}
            >
              <Component />
            </MasonryTile>
          ))}
        </Masonry>
      </Box>
    </Box>
  );
}

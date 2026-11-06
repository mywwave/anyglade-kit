"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { durations, easings, spacing } from "../tokens.ts";
import { fitColumns, fitStrip } from "./fit-stage.ts";

const GAP = Number.parseInt(spacing.s);

export interface MediaStageProps<T extends { id: string }> {
  label: string;
  items: readonly T[];
  /** The tile that takes the stage. The others shrink into a strip beside it. */
  focusId?: string | null;
  /** Each item keeps its tile while the layout changes, so a live video never restarts. */
  renderItem: (item: T) => ReactNode;
  /** Stands in the strip when not everyone fits. */
  more: { label: (count: number) => string; onPress: () => void };
}

/** Tiles slide to their new places: the layout changes with people, not with a page. */
function useTileMotion(root: HTMLElement | null, layoutKey: string, sizeKey: string) {
  const places = useRef(new Map<string, DOMRect>());
  const lastLayout = useRef(layoutKey);

  useLayoutEffect(() => {
    if (!root) {
      return;
    }
    const isMoved = layoutKey !== lastLayout.current;
    const isReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    lastLayout.current = layoutKey;

    for (const tile of root.querySelectorAll<HTMLElement>("[data-stage-tile]")) {
      for (const running of tile.getAnimations()) {
        running.cancel();
      }
      const id = tile.dataset.stageTile ?? "";
      const next = tile.getBoundingClientRect();
      const previous = places.current.get(id);
      places.current.set(id, next);

      if (isMoved && !isReduced && previous && next.width > 0 && previous.width > 0) {
        const x = previous.left - next.left;
        const y = previous.top - next.top;
        const scaleX = previous.width / next.width;
        const scaleY = previous.height / next.height;
        if (x !== 0 || y !== 0 || scaleX !== 1 || scaleY !== 1) {
          tile.animate(
            [
              { transform: `translate(${x}px, ${y}px) scale(${scaleX}, ${scaleY})` },
              { transform: "none" },
            ],
            { duration: Number.parseInt(durations.slow), easing: easings.standard },
          );
        }
      }
    }
  }, [root, layoutKey, sizeKey]);
}

/** Lays out live tiles: everyone equal, or one on the stage and the rest in a strip. */
export function MediaStage<T extends { id: string }>({
  label,
  items,
  focusId,
  renderItem,
  more,
}: MediaStageProps<T>) {
  const [root, setRoot] = useState<HTMLElement | null>(null);
  const [size, setSize] = useState({ width: 960, height: 540 });
  const [knownIds] = useState(() => new Set(items.map((item) => item.id)));

  useLayoutEffect(() => {
    if (!root) {
      return;
    }
    const measure = () => setSize({ width: root.clientWidth, height: root.clientHeight });
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    measure();
    return () => observer.disconnect();
  }, [root]);

  const isFocused = items.length > 1 && items.some((item) => item.id === focusId);
  const strip = fitStrip(items.length - 1, size, GAP);
  const columns = fitColumns(items.length, size, GAP);
  const rows = Math.ceil(items.length / columns);
  const hiddenIds = new Set(
    isFocused
      ? items
          .filter((item) => item.id !== focusId)
          .slice(strip.shown)
          .map((item) => item.id)
      : [],
  );

  useTileMotion(
    root,
    `${isFocused ? focusId : ""}|${items.map((item) => item.id).join()}`,
    `${size.width}x${size.height}`,
  );

  const layout = isFocused
    ? ({
        "--ag-stage-cells": strip.cells,
        "--ag-stage-strip": `${strip.thickness}px`,
      } as CSSProperties)
    : ({ "--ag-stage-columns": columns, "--ag-stage-rows": rows } as CSSProperties);

  return (
    <ul
      ref={setRoot}
      aria-label={label}
      className="ag-media-stage"
      data-layout={isFocused ? strip.side : "grid"}
      style={layout}
    >
      {items.map((item) => {
        const isOnStage = isFocused && item.id === focusId;

        return (
          <li
            key={item.id}
            className="ag-media-stage__tile"
            data-focused={isOnStage ? "" : undefined}
            data-hidden={hiddenIds.has(item.id) ? "" : undefined}
            data-new={knownIds.has(item.id) ? undefined : ""}
            data-stage-tile={item.id}
          >
            {renderItem(item)}
          </li>
        );
      })}
      {hiddenIds.size > 0 ? (
        <li className="ag-media-stage__more">
          <button aria-label={more.label(hiddenIds.size)} type="button" onClick={more.onPress}>
            +{hiddenIds.size}
          </button>
        </li>
      ) : null}
    </ul>
  );
}

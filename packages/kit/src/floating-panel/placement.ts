export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Anchor {
  top: number;
  right: number;
  bottom: number;
}

const EDGE_GAP = 8;
const ANCHOR_GAP = 8;

/** Keeps the whole panel on screen, or its top left corner when it does not fit. */
export function clampToViewport(point: Point, size: Size, viewport: Size): Point {
  const maxX = Math.max(EDGE_GAP, viewport.width - size.width - EDGE_GAP);
  const maxY = Math.max(EDGE_GAP, viewport.height - size.height - EDGE_GAP);

  return {
    x: Math.min(Math.max(point.x, EDGE_GAP), maxX),
    y: Math.min(Math.max(point.y, EDGE_GAP), maxY),
  };
}

/** Under the anchor, aligned to its end. Above it when only there is room. */
export function placeAtAnchor(anchor: Anchor, size: Size, viewport: Size): Point {
  const below = anchor.bottom + ANCHOR_GAP;
  const above = anchor.top - ANCHOR_GAP - size.height;
  const fitsBelow = below + size.height <= viewport.height - EDGE_GAP;

  return clampToViewport(
    { x: anchor.right - size.width, y: fitsBelow || above < EDGE_GAP ? below : above },
    size,
    viewport,
  );
}

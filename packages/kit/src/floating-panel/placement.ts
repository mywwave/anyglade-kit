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
const CASCADE_INSET = 64;
const CASCADE_STEP = 32;
const CASCADE_SLOTS = 6;

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

/** From the top right corner down and to the left, so every title stays in sight. */
export function cascadePoint(slot: number, size: Size, viewport: Size): Point {
  const step = (slot % CASCADE_SLOTS) * CASCADE_STEP;

  return clampToViewport(
    { x: viewport.width - size.width - CASCADE_INSET - step, y: CASCADE_INSET + step },
    size,
    viewport,
  );
}

/** Between the smallest usable size and what fits from the panel's corner to the screen edge. */
export function clampSize(size: Size, min: Size, point: Point, viewport: Size): Size {
  const fit = (value: number, smallest: number, room: number) =>
    Math.max(smallest, Math.min(value, room));

  return {
    width: fit(size.width, min.width, viewport.width - point.x - EDGE_GAP),
    height: fit(size.height, min.height, viewport.height - point.y - EDGE_GAP),
  };
}

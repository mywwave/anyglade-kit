/** Webcams are 4:3, and a face survives this crop on a tall phone screen. */
const TILE_RATIO = 4 / 3;
const STRIP_SIDE = 216;
const STRIP_BOTTOM = 88;
const STRIP_MIN_TILE = 88;
const STRIP_MIN_TILE_WIDE = 136;

interface Size {
  width: number;
  height: number;
}

/** The column count that gives every tile the largest picture. */
export function fitColumns(count: number, { width, height }: Size, gap: number) {
  let columns = 1;
  let widest = 0;

  for (let candidate = 1; candidate <= count; candidate += 1) {
    const rows = Math.ceil(count / candidate);
    const cellWidth = (width - gap * (candidate - 1)) / candidate;
    const cellHeight = (height - gap * (rows - 1)) / rows;
    const picture = Math.min(cellWidth, cellHeight * TILE_RATIO);
    if (picture > widest) {
      widest = picture;
      columns = candidate;
    }
  }

  return columns;
}

/** A wide stage keeps its strip on the right, a tall one underneath. */
export function fitStrip(others: number, { width, height }: Size, gap: number) {
  const isSide = width >= height;
  const length = isSide ? height : width;
  const tile = isSide ? STRIP_MIN_TILE : STRIP_MIN_TILE_WIDE;
  const room = Math.max(1, Math.floor((length + gap) / (tile + gap)));

  return {
    side: isSide ? "side" : "bottom",
    thickness: isSide ? STRIP_SIDE : STRIP_BOTTOM,
    /** The last cell turns into "+N" when not everyone fits. */
    shown: others > room ? room - 1 : others,
    cells: Math.min(others, room),
  } as const;
}

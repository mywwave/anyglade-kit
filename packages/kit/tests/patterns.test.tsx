import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vite-plus/test";
import {
  cascadePoint,
  clampSize,
  clampToViewport,
  placeAtAnchor,
} from "../src/floating-panel/placement.ts";
import { fitColumns, fitStrip } from "../src/media-stage/fit-stage.ts";
import { VideoSlash } from "../src/icons.ts";
import {
  DetailRow,
  Draggable,
  Masonry,
  MasonryTile,
  SignaturePad,
  SlideToConfirm,
  EmptyPanel,
  Frame,
  CountBadge,
  FloatingPanel,
  FrameTile,
  ItemList,
  MediaStage,
  MediaTile,
  PageLoader,
  Stat,
} from "../src/index.ts";

test("Frame renders its header only when it has content", () => {
  const withHeader = renderToStaticMarkup(
    <Frame title="Plans" meta="Monthly">
      <FrameTile>Tile</FrameTile>
    </Frame>,
  );
  const withoutHeader = renderToStaticMarkup(
    <Frame>
      <FrameTile>Tile</FrameTile>
    </Frame>,
  );

  expect(withHeader).toContain("Plans");
  expect(withHeader).toContain("ag-rounded-frame");
  expect(withoutHeader).not.toContain("<span");
});

test("Stat omits an empty note", () => {
  const html = renderToStaticMarkup(<Stat label="Revenue" value="100" />);

  expect(html).toContain("ag-tabular");
  expect(html.match(/<p/g)).toHaveLength(2);
});

test("DetailRow shows a dash for a missing value", () => {
  expect(renderToStaticMarkup(<DetailRow label="Company" />)).toContain("—");
  expect(renderToStaticMarkup(<DetailRow label="Plan" value="Pro" />)).not.toContain("—");
});

test("EmptyPanel renders optional slots only when provided", () => {
  const html = renderToStaticMarkup(<EmptyPanel title="Nothing here" />);

  expect(html).toContain("<h3");
  expect(html).not.toContain("<p");
});

test("ItemList marks the open row and renders its own actions", () => {
  const html = renderToStaticMarkup(
    <ItemList
      currentId="b"
      getText={(item) => item.name}
      items={[
        { id: "a", name: "Anna" },
        { id: "b", name: "Ilya" },
      ]}
      label="Chats"
      renderItem={(item) => <button type="button">{item.name}</button>}
      onOpen={() => undefined}
    />,
  );

  expect(html.match(/ag-item-list__row--current/g)).toHaveLength(1);
  expect(html).toContain('aria-label="Chats"');
  expect(html).toContain("<button");
});

const viewport = { width: 1000, height: 600 };
const panel = { width: 320, height: 200 };

test("FloatingPanel stands under its trigger, aligned to the end", () => {
  expect(placeAtAnchor({ top: 20, right: 900, bottom: 52 }, panel, viewport)).toEqual({
    x: 580,
    y: 60,
  });
});

test("FloatingPanel flips above its trigger when only there is room", () => {
  expect(placeAtAnchor({ top: 500, right: 900, bottom: 532 }, panel, viewport)).toEqual({
    x: 580,
    y: 292,
  });
});

test("FloatingPanel stays on screen wherever it is dragged", () => {
  expect(clampToViewport({ x: -50, y: 900 }, panel, viewport)).toEqual({ x: 8, y: 392 });
  expect(clampToViewport({ x: 900, y: -50 }, panel, viewport)).toEqual({ x: 672, y: 8 });
});

test("FloatingPanel taller than the screen keeps its header reachable", () => {
  expect(clampToViewport({ x: 0, y: 300 }, { width: 320, height: 900 }, viewport).y).toBe(8);
});

test("ItemList renders no menu until one is asked for", () => {
  const html = renderToStaticMarkup(
    <ItemList
      getText={(item) => item.name}
      items={[{ id: "a", name: "Anna" }]}
      label="Chats"
      menu={{ label: "Actions", renderItems: () => null }}
      renderItem={(item) => item.name}
      onOpen={() => undefined}
    />,
  );

  expect(html).not.toContain('role="menu"');
  expect(html).not.toContain("ag-item-list__anchor");
});

test("FloatingPanel windows cascade so that each title stays in sight", () => {
  const first = cascadePoint(0, panel, viewport);
  const second = cascadePoint(1, panel, viewport);

  expect(second.y).toBe(first.y + 32);
  expect(second.x).toBe(first.x - 32);
  expect(cascadePoint(6, panel, viewport)).toEqual(first);
});

test("FloatingPanel keeps its size between the smallest and what fits on screen", () => {
  const min = { width: 320, height: 320 };

  expect(clampSize({ width: 100, height: 100 }, min, { x: 0, y: 0 }, viewport)).toEqual(min);
  expect(clampSize({ width: 2000, height: 2000 }, min, { x: 100, y: 100 }, viewport)).toEqual({
    width: viewport.width - 108,
    height: viewport.height - 108,
  });
});

test("CountBadge caps the number and stays still on first render", () => {
  expect(renderToStaticMarkup(<CountBadge count={7} />)).toContain(">7<");
  const html = renderToStaticMarkup(<CountBadge count={128} />);
  expect(html).toContain("99+");
  expect(html).not.toContain("ag-motion-pop");
});

test("MediaStage picks the columns that give each tile the largest picture", () => {
  expect(fitColumns(1, { width: 800, height: 600 }, 8)).toBe(1);
  expect(fitColumns(2, { width: 800, height: 400 }, 8)).toBe(2);
  expect(fitColumns(6, { width: 374, height: 650 }, 8)).toBe(2);
  expect(fitColumns(6, { width: 1200, height: 600 }, 8)).toBe(3);
});

test("MediaStage keeps the strip beside a wide stage and under a tall one", () => {
  expect(fitStrip(3, { width: 900, height: 600 }, 8).side).toBe("side");
  expect(fitStrip(3, { width: 374, height: 650 }, 8).side).toBe("bottom");
});

test("MediaStage leaves a cell for the rest when not everyone fits", () => {
  expect(fitStrip(9, { width: 900, height: 400 }, 8)).toMatchObject({ shown: 3, cells: 4 });
  expect(fitStrip(2, { width: 900, height: 400 }, 8)).toMatchObject({ shown: 2, cells: 2 });
});

test("MediaStage shows one tile on stage and counts the hidden ones", () => {
  const items = Array.from({ length: 9 }, (_, index) => ({ id: String(index) }));
  const stage = (focusId: string | null) =>
    renderToStaticMarkup(
      <MediaStage
        focusId={focusId}
        items={items}
        label="Participants"
        more={{ label: (count) => `${count} more`, onPress: () => undefined }}
        renderItem={(item) => item.id}
      />,
    );

  expect(stage(null)).toContain('data-layout="grid"');
  expect(stage(null)).not.toContain("ag-media-stage__more");
  const focused = stage("4");
  expect(focused).toContain('data-layout="side"');
  expect(focused).toContain('data-focused=""');
  expect(focused).toContain("ag-media-stage__more");
});

test("MediaStage ignores a focus that is no longer on stage", () => {
  const html = renderToStaticMarkup(
    <MediaStage
      focusId="gone"
      items={[{ id: "a" }, { id: "b" }]}
      label="Participants"
      more={{ label: () => "", onPress: () => undefined }}
      renderItem={(item) => item.id}
    />,
  );
  expect(html).toContain('data-layout="grid"');
});

test("MediaTile renders only the slots it was given", () => {
  const plain = renderToStaticMarkup(<MediaTile name="Anna">x</MediaTile>);
  expect(plain).not.toContain("ag-media-tile__actions");
  expect(plain).not.toContain("data-speaking");
  const live = renderToStaticMarkup(
    <MediaTile isSpeaking actions={<button type="button">Pin</button>} name="Anna">
      x
    </MediaTile>,
  );
  expect(live).toContain("ag-media-tile__actions");
  expect(live).toContain("data-speaking");
});

test("Draggable marks a row that cannot move", () => {
  const html = (isDisabled: boolean) =>
    renderToStaticMarkup(
      <Draggable isDisabled={isDisabled} preview="Anna" value="anna">
        Anna
      </Draggable>,
    );
  expect(html(false)).not.toContain("data-disabled");
  expect(html(true)).toContain("data-disabled");
});

test("VideoSlash pairs with the microphone icon", () => {
  expect(renderToStaticMarkup(<VideoSlash />)).toContain('viewBox="0 0 16 16"');
});

test("PageLoader waits before showing: fast work never flashes a screen", () => {
  const html = renderToStaticMarkup(
    <PageLoader
      isLoading
      label="Loading"
      logo={{ src: "/logo.svg", width: 87, height: 48 }}
      status="Connecting channels"
    />,
  );
  expect(html).toBe("");
});

test("PageLoader stays hidden through a custom delay on the first render too", () => {
  const html = renderToStaticMarkup(
    <PageLoader
      isLoading
      delay={0}
      label="Loading"
      logo={{ src: "/logo.svg", width: 87, height: 48 }}
      status="Connecting channels"
    />,
  );
  expect(html).toBe("");
});

test("FloatingPanel renders nothing while closed", () => {
  const html = renderToStaticMarkup(
    <FloatingPanel
      closeLabel="Close"
      isOpen={false}
      moveLabel="Move"
      pinLabel="Pin"
      title="Note"
      triggerRef={{ current: null }}
      unpinLabel="Unpin"
      onOpenChange={() => undefined}
    >
      Text
    </FloatingPanel>,
  );

  expect(html).toBe("");
});

test("MasonryTile is an anchored article and omits an empty note", () => {
  const withNote = renderToStaticMarkup(
    <Masonry>
      <MasonryTile id="Receipt" note="Press" title="Receipt">
        Detail
      </MasonryTile>
    </Masonry>,
  );
  const withoutNote = renderToStaticMarkup(<MasonryTile title="Receipt">Detail</MasonryTile>);

  expect(withNote).toContain('<article id="Receipt"');
  expect(withNote).toContain("ag-break-avoid");
  expect(withNote).toContain("Press");
  expect(withoutNote).not.toContain("<p");
});

test("SlideToConfirm names its thumb by the action and starts idle", () => {
  const html = renderToStaticMarkup(
    <SlideToConfirm
      doneLabel="Sent"
      label="Send $480"
      pendingLabel="Sending"
      onConfirm={() => undefined}
    />,
  );

  expect(html).toContain('data-phase="idle"');
  expect(html).toContain('aria-label="Send $480"');
  expect(html).not.toContain("Sent");
});

test("SignaturePad shows the placeholder until the first stroke", () => {
  const html = renderToStaticMarkup(
    <SignaturePad
      clearLabel="Clear"
      label="Signature on the contract"
      placeholder="Sign here"
      onChange={() => undefined}
    />,
  );

  expect(html).toContain("Sign here");
  expect(html).not.toContain("Clear");
});

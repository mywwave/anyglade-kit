import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vite-plus/test";
import { clampToViewport, placeAtAnchor } from "../src/floating-panel/placement.ts";
import {
  DetailRow,
  EmptyPanel,
  Frame,
  FloatingPanel,
  FrameTile,
  ItemList,
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
        { id: "a", name: "Анна" },
        { id: "b", name: "Илья" },
      ]}
      label="Чаты"
      renderItem={(item) => <button type="button">{item.name}</button>}
      onOpen={() => undefined}
    />,
  );

  expect(html.match(/ag-item-list__row--current/g)).toHaveLength(1);
  expect(html).toContain('aria-label="Чаты"');
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

test("FloatingPanel renders nothing while closed", () => {
  const html = renderToStaticMarkup(
    <FloatingPanel
      closeLabel="Закрыть"
      isOpen={false}
      moveLabel="Переместить"
      pinLabel="Закрепить"
      title="Заметка"
      triggerRef={{ current: null }}
      unpinLabel="Открепить"
      onOpenChange={() => undefined}
    >
      Текст
    </FloatingPanel>,
  );

  expect(html).toBe("");
});

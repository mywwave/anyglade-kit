import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vite-plus/test";
import { DetailRow, EmptyPanel, Frame, FrameTile, Stat } from "../src/index.ts";

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

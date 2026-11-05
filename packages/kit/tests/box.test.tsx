import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vite-plus/test";
import { Box } from "../src/box/box.tsx";
import { resolveBox } from "../src/box/resolve.ts";
import { Text } from "../src/text/text.tsx";

test("token props resolve to classes for every condition", () => {
  const { className, style } = resolveBox({
    padding: { base: "l", md: "2xl" },
    backgroundColor: { hover: "background-card" },
  });

  expect(className).toBe("ag-p-l md:ag-p-2xl hover:ag-bg-background-card");
  expect(style).toBeUndefined();
});

test("free props pass through CSS variables", () => {
  const { className, style } = resolveBox({ width: { base: 320, md: "50%" }, zIndex: 10 });

  expect(className).toBe("ag-w md:ag-w ag-z");
  expect(style).toEqual({ "--ag-w": "320px", "--ag-w-md": "50%", "--ag-z": "10" });
});

test("DOM props are forwarded and style props are not", () => {
  const { rest } = resolveBox({ padding: "l", id: "a", onClick: undefined });

  expect(rest).toEqual({ id: "a", onClick: undefined });
});

test("Box is flex by default except for inline elements", () => {
  expect(renderToStaticMarkup(<Box gap="s" />)).toContain("ag-gap-s ag-d-flex");
  expect(renderToStaticMarkup(<Box as="span" />)).toBe("<span></span>");
});

test("Text picks an element and wrapping from the role", () => {
  const html = renderToStaticMarkup(<Text variant="heading-l">Title</Text>);

  expect(html).toContain("<h3");
  expect(html).toContain("ag-wrap-balance");
});

test("Text formats numeric children", () => {
  expect(renderToStaticMarkup(<Text formatter="number">{3290033}</Text>)).toContain("3,290,033");
  expect(renderToStaticMarkup(<Text formatter="compact">{9260000}</Text>)).toContain("9.3M");
});

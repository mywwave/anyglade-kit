import { renderToStaticMarkup } from "react-dom/server";
import { expect, test, vi } from "vite-plus/test";
import {
  Box,
  Button,
  CopyButton,
  Loadable,
  SegmentedControl,
  useTableSort,
  withTransition,
} from "../src/index.ts";

test("Button stays free of a loader until work has run long enough", () => {
  const html = renderToStaticMarkup(<Button isPending>Save</Button>);

  expect(html).toContain("Save");
  expect(html).toContain('data-pending="true"');
  expect(html).not.toContain("data-loading");
});

test("Button keeps the compound API of HeroUI", () => {
  expect(renderToStaticMarkup(<Button.Root>Open</Button.Root>)).toContain("Open");
});

test("Loadable waits before showing the skeleton and fades the content in", () => {
  const waiting = renderToStaticMarkup(
    <Loadable isLoading skeleton="skeleton">
      content
    </Loadable>,
  );
  const ready = renderToStaticMarkup(
    <Loadable isLoading={false} skeleton="skeleton">
      content
    </Loadable>,
  );

  expect(waiting).toBe("");
  expect(ready).toContain("content");
  expect(ready).toContain("ag-motion-fade");
});

test("CopyButton hides its label unless asked and always names itself", () => {
  const icon = renderToStaticMarkup(<CopyButton copiedLabel="Copied" label="Copy" value="a" />);
  const labelled = renderToStaticMarkup(
    <CopyButton isLabelVisible copiedLabel="Copied" label="Copy" value="a" />,
  );

  expect(icon).toContain('aria-label="Copy"');
  expect(icon).not.toContain(">Copy<");
  expect(labelled).toContain("Copy");
});

test("SegmentedControl renders every option and the current value", () => {
  const html = renderToStaticMarkup(
    <SegmentedControl
      label="Period"
      options={[
        { id: "week", label: "Week" },
        { id: "year", label: "Year" },
      ]}
      value="year"
      onChange={() => undefined}
    />,
  );

  expect(html).toContain("Week");
  expect(html).toContain('aria-label="Period"');
  expect(html).toContain('data-selected="true"');
});

const accessors = {
  name: (row: { name: string; total: number }) => row.name,
  total: (row: { name: string; total: number }) => row.total,
};
const rows = [
  { name: "B", total: 2 },
  { name: "A", total: 10 },
];

function SortedNames({ column, descending }: { column: string; descending: boolean }) {
  const { sorted } = useTableSort(rows, accessors, {
    column,
    direction: descending ? "descending" : "ascending",
  });
  return <>{sorted.map((row) => row.name).join("")}</>;
}

test("useTableSort orders text and numbers and keeps unknown columns as they are", () => {
  expect(renderToStaticMarkup(<SortedNames column="name" descending={false} />)).toBe("AB");
  expect(renderToStaticMarkup(<SortedNames column="total" descending />)).toBe("AB");
  expect(renderToStaticMarkup(<SortedNames column="missing" descending />)).toBe("BA");
});

test("Box maps motion presets to generated classes", () => {
  expect(renderToStaticMarkup(<Box motion="enter" />)).toContain("ag-motion-enter");
});

test("withTransition handles being skipped by a newer transition", () => {
  const ready = { catch: vi.fn() };
  const update = vi.fn();
  vi.stubGlobal("matchMedia", () => ({ matches: false }));
  vi.stubGlobal("document", {
    querySelector: () => null,
    startViewTransition: (callback: () => void) => {
      callback();
      return { ready };
    },
  });

  withTransition(update);
  vi.unstubAllGlobals();

  expect(update).toHaveBeenCalledOnce();
  expect(ready.catch).toHaveBeenCalledOnce();
});

test("withTransition takes no snapshot of the page under a floating panel", () => {
  const startViewTransition = vi.fn();
  const update = vi.fn();
  vi.stubGlobal("matchMedia", () => ({ matches: false }));
  vi.stubGlobal("document", { querySelector: () => ({}), startViewTransition });

  withTransition(update);
  vi.unstubAllGlobals();

  expect(update).toHaveBeenCalledOnce();
  expect(startViewTransition).not.toHaveBeenCalled();
});

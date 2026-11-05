import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vite-plus/test";
import { Button, PageHeader } from "../src/index.ts";

test("PageHeader renders title, description and actions", () => {
  const html = renderToStaticMarkup(
    <PageHeader title="Orders" description="All orders" actions={<Button>Create</Button>} />,
  );

  expect(html).toContain("<h1");
  expect(html).toContain("Orders");
  expect(html).toContain("All orders");
  expect(html).toContain("Create");
});

test("PageHeader omits empty slots", () => {
  const html = renderToStaticMarkup(<PageHeader title="Orders" />);

  expect(html).not.toContain("<p");
  expect(html).not.toContain("<button");
});

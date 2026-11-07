import { renderToStaticMarkup } from "react-dom/server";
import { splitChange } from "../src/text-swap/split-change.ts";
import { expect, test } from "vite-plus/test";
import { DeliveryStatus, Message, Plan, Run, StreamingText } from "../src/ai.ts";
import { overallStatus } from "../src/ai/status.tsx";
import { Shimmer, TextSwap } from "../src/index.ts";

const statusLabels = {
  pending: "Pending",
  running: "Running",
  waiting: "Question",
  done: "Done",
  failed: "Failed",
};

test("Shimmer stops with the work", () => {
  expect(renderToStaticMarkup(<Shimmer>Thinking</Shimmer>)).toContain("data-layer");
  expect(renderToStaticMarkup(<Shimmer isActive={false}>Thinking</Shimmer>)).not.toContain(
    "data-layer",
  );
});

test("TextSwap shows plain text until it changes and can shimmer", () => {
  const quiet = renderToStaticMarkup(<TextSwap text="Thinking" />);
  const active = renderToStaticMarkup(<TextSwap isShimmering text="Thinking" />);

  expect(quiet).toContain("Thinking");
  expect(quiet).not.toContain("ag-swap__line--leaving");
  expect(active).toContain("data-active");
});

test("TextSwap moves only the part that changed", () => {
  expect(splitChange("97 100", "97 101")).toEqual({
    prefix: "97 10",
    leaving: "0",
    arriving: "1",
    suffix: "",
  });
  expect(splitChange("Sending in 15 s", "Sending in 14 s")).toEqual({
    prefix: "Sending in 1",
    leaving: "5",
    arriving: "4",
    suffix: " s",
  });
  expect(splitChange("Reading", "You are reading").prefix).toBe("");
});

test("TextSwap handles growing, shrinking and repeated letters", () => {
  expect(splitChange("100", "1000")).toMatchObject({ leaving: "", arriving: "0" });
  expect(splitChange("1000", "100")).toMatchObject({ leaving: "0", arriving: "" });
  expect(splitChange("aaa", "aa")).toEqual({
    prefix: "aa",
    leaving: "a",
    arriving: "",
    suffix: "",
  });
  expect(splitChange("👍🏽 yes", "👍🏿 yes")).toMatchObject({ leaving: "👍🏽", arriving: "👍🏿" });
});

test("a group reports its most urgent status", () => {
  expect(overallStatus(["done", "failed", "running"])).toBe("failed");
  expect(overallStatus(["done", "running", "pending"])).toBe("running");
  expect(overallStatus(["done", "done"])).toBe("done");
  expect(overallStatus(["pending", "done"])).toBe("pending");
});

test("Run names the running step and names statuses for screen readers", () => {
  const html = renderToStaticMarkup(
    <Run
      statusLabels={statusLabels}
      summary="Done"
      steps={[
        { id: "1", title: "First", status: "done" },
        { id: "2", title: "Second", status: "running" },
      ]}
    />,
  );

  expect(html).toContain("Second");
  expect(html).toContain("Running");
  expect(html).toContain("1/2");
});

test("StreamingText fades only while it streams and links citations", () => {
  const source = { title: "Rules", url: "https://example.com" };
  const streaming = renderToStaticMarkup(<StreamingText isStreaming text="First paragraph" />);
  const done = renderToStaticMarkup(
    <StreamingText isStreaming={false} sources={[source]} text={"Text [1]\n\nMore [9]"} />,
  );

  expect(streaming).toContain("ag-motion-fade");
  expect(done).not.toContain("ag-motion-fade");
  expect(done.match(/<p/g)).toHaveLength(2);
  expect(done).toContain("ag-citation");
  expect(done).toContain("[9]");
});

test("Message leaves out empty actions and gives the user a bubble", () => {
  expect(renderToStaticMarkup(<Message author="assistant">Answer</Message>)).not.toContain(
    "ag-motion-fade",
  );
  expect(renderToStaticMarkup(<Message author="user">Question</Message>)).toContain(
    "ag-bg-background-card",
  );
  expect(renderToStaticMarkup(<Message author="contact">Hello</Message>)).toContain(
    "ag-items-start",
  );
});

test("DeliveryStatus names the state and stays still when it first renders", () => {
  const labels = {
    sending: "Sending",
    sent: "Sent",
    delivered: "Delivered",
    read: "Read",
  };
  const html = renderToStaticMarkup(
    <Message author="user" meta={<DeliveryStatus labels={labels} status="read" />}>
      Question
    </Message>,
  );

  expect(html).toContain("Read");
  expect(html).toContain("ag-visually-hidden");
  expect(html).toContain("ag-text-text-success");
  expect(html).not.toContain("ag-motion-pop");
});

test("Plan reports progress in the words it was given and keeps its title while it runs", () => {
  const html = renderToStaticMarkup(
    <Plan
      formatProgress={(done, total) => `${done} of ${total}`}
      statusLabels={statusLabels}
      title="Work plan"
      steps={[
        { id: "1", title: "First", status: "done" },
        { id: "2", title: "Second", status: "running" },
      ]}
    />,
  );

  expect(html).toContain("Work plan");
  expect(html).toContain("1 of 2");
  expect(html).toContain("ag-plan__steps");
});

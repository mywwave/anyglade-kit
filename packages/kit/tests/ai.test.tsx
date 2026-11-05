import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vite-plus/test";
import { DeliveryStatus, Message, Plan, Run, StreamingText } from "../src/ai.ts";
import { overallStatus } from "../src/ai/status.tsx";
import { Shimmer, TextSwap } from "../src/index.ts";

const statusLabels = {
  pending: "Ожидает",
  running: "Идёт",
  waiting: "Вопрос",
  done: "Готово",
  failed: "Ошибка",
};

test("Shimmer stops with the work", () => {
  expect(renderToStaticMarkup(<Shimmer>Думаю</Shimmer>)).toContain("data-layer");
  expect(renderToStaticMarkup(<Shimmer isActive={false}>Думаю</Shimmer>)).not.toContain(
    "data-layer",
  );
});

test("TextSwap shows plain text until it changes and can shimmer", () => {
  const quiet = renderToStaticMarkup(<TextSwap text="Думаю" />);
  const active = renderToStaticMarkup(<TextSwap isShimmering text="Думаю" />);

  expect(quiet).toContain("Думаю");
  expect(quiet).not.toContain("ag-swap__entering");
  expect(quiet).not.toContain("ag-swap__leaving");
  expect(active).toContain("data-active");
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
      summary="Готово"
      steps={[
        { id: "1", title: "Первый", status: "done" },
        { id: "2", title: "Второй", status: "running" },
      ]}
    />,
  );

  expect(html).toContain("Второй");
  expect(html).toContain("Идёт");
  expect(html).toContain("1/2");
});

test("StreamingText fades only while it streams and links citations", () => {
  const source = { title: "Правила", url: "https://example.com" };
  const streaming = renderToStaticMarkup(<StreamingText isStreaming text="Первый абзац" />);
  const done = renderToStaticMarkup(
    <StreamingText isStreaming={false} sources={[source]} text={"Текст [1]\n\nЕщё [9]"} />,
  );

  expect(streaming).toContain("ag-motion-fade");
  expect(done).not.toContain("ag-motion-fade");
  expect(done.match(/<p/g)).toHaveLength(2);
  expect(done).toContain("ag-citation");
  expect(done).toContain("[9]");
});

test("Message leaves out empty actions and gives the user a bubble", () => {
  expect(renderToStaticMarkup(<Message author="assistant">Ответ</Message>)).not.toContain(
    "ag-motion-fade",
  );
  expect(renderToStaticMarkup(<Message author="user">Вопрос</Message>)).toContain(
    "ag-bg-background-card",
  );
  expect(renderToStaticMarkup(<Message author="contact">Привет</Message>)).toContain(
    "ag-items-start",
  );
});

test("DeliveryStatus names the state and stays still when it first renders", () => {
  const labels = {
    sending: "Отправляется",
    sent: "Отправлено",
    delivered: "Доставлено",
    read: "Прочитано",
  };
  const html = renderToStaticMarkup(
    <Message author="user" meta={<DeliveryStatus labels={labels} status="read" />}>
      Вопрос
    </Message>,
  );

  expect(html).toContain("Прочитано");
  expect(html).toContain("ag-visually-hidden");
  expect(html).toContain("ag-text-text-success");
  expect(html).not.toContain("ag-motion-pop");
});

test("Plan reports progress in the words it was given and keeps its title while it runs", () => {
  const html = renderToStaticMarkup(
    <Plan
      formatProgress={(done, total) => `${done} из ${total}`}
      statusLabels={statusLabels}
      title="План работ"
      steps={[
        { id: "1", title: "Первый", status: "done" },
        { id: "2", title: "Второй", status: "running" },
      ]}
    />,
  );

  expect(html).toContain("План работ");
  expect(html).toContain("1 из 2");
  expect(html).toContain("ag-plan__steps");
});

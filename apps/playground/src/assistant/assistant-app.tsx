import { Box, Button, CopyButton, Text, toast, tokens } from "@anyglade/kit";
import {
  Checkpoint,
  CodeOutput,
  ContextMeter,
  Conversation,
  ConversationTurn,
  FileTree,
  Message,
  ModelPicker,
  PromptComposer,
  Reasoning,
  Run,
  Sources,
  StreamingText,
  Suggestions,
  ToolCall,
  Plan,
  type PromptAttachment,
  type RunStep,
  type StatusLabels,
} from "@anyglade/kit/ai";
import { ArrowRotateRight } from "@anyglade/kit/icons";
import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { pluralize } from "../crm/format.ts";
import { suggestions, type Part, type PlanStep } from "./scenarios.ts";
import { useAgent, type Effort, type Turn } from "./use-agent.ts";

type Model = "kasanie" | "kasanie-mini";

const models: { id: Model; label: string }[] = [
  { id: "kasanie", label: "Касание" },
  { id: "kasanie-mini", label: "Касание мини" },
];

const efforts: { id: Effort; label: string }[] = [
  { id: "fast", label: "Сразу" },
  { id: "balanced", label: "Обычно" },
  { id: "deep", label: "Глубоко" },
];

const statusLabels: StatusLabels = {
  pending: "Ожидает",
  running: "Выполняется",
  waiting: "Нужен ответ",
  done: "Готово",
  failed: "Ошибка",
};

const CONTEXT_LIMIT = 200000;
/** The navbar and a gap under it. */
const TOP_INSET = 64;
const copyLabels = { copyLabel: "Скопировать вывод", copiedLabel: "Вывод скопирован" };

function toRunStep(step: PlanStep): RunStep {
  const { substeps, output } = step;
  const steps = substeps?.map(toRunStep);
  const detail = output ? (
    <CodeOutput {...copyLabels} output={output.text} title={output.title} tone={output.tone} />
  ) : undefined;

  return { id: step.id, title: step.title, status: step.status, note: step.note, steps, detail };
}

interface PartViewProps {
  part: Part;
  onAnswer: (partId: string, isApproved: boolean) => void;
}

const PartView = memo(function PartView({ part, onAnswer }: PartViewProps) {
  switch (part.type) {
    case "reasoning":
      return (
        <Reasoning isStreaming={part.isStreaming} label={part.label}>
          {part.text}
        </Reasoning>
      );
    case "plan":
      return (
        <Plan
          formatProgress={(done, total) => `${done} из ${total} готово`}
          statusLabels={statusLabels}
          steps={part.steps.map(toRunStep)}
          title={part.title}
        />
      );
    case "run":
      return (
        <Run
          isDefaultExpanded
          statusLabels={statusLabels}
          steps={part.steps.map(toRunStep)}
          summary={part.summary}
        />
      );
    case "tool":
      return (
        <ToolCall
          approval={
            part.question
              ? {
                  question: part.question,
                  approveLabel: "Отправить",
                  rejectLabel: "Отменить",
                  onApprove: () => onAnswer(part.id, true),
                  onReject: () => onAnswer(part.id, false),
                }
              : undefined
          }
          name={part.name}
          status={part.status}
          statusLabels={statusLabels}
          title={part.title}
        >
          <CodeOutput {...copyLabels} output={part.input} title="Вход" />
          {part.output ? (
            <CodeOutput {...copyLabels} output={part.output} title="Результат" />
          ) : null}
        </ToolCall>
      );
    case "code":
      return (
        <CodeOutput
          {...copyLabels}
          isStreaming={part.isStreaming}
          output={part.output}
          title={part.title}
        />
      );
    case "files":
      return (
        <FileTree
          files={part.files}
          label="Изменённые файлы"
          onOpen={(path) => toast(`Открыт ${path}`)}
        />
      );
    case "text":
      return (
        <Box flexDirection="column" gap="s" minWidth={0}>
          <StreamingText isStreaming={part.isStreaming} sources={part.sources} text={part.text} />
          {!part.isStreaming && part.sources.length > 0 ? (
            <Sources
              items={part.sources}
              label={`${part.sources.length} ${pluralize(part.sources.length, "источник", "источника", "источников")}`}
            />
          ) : null}
        </Box>
      );
  }
});

const turnText = (turn: Turn) =>
  turn.parts.flatMap((part) => (part.type === "text" ? [part.text] : [])).join("\n\n");

interface TurnViewProps {
  turn: Turn;
  isFirst: boolean;
  isLast: boolean;
  onAnswer: (partId: string, isApproved: boolean) => void;
  onRetry: (turn: Turn) => void;
  onRestore: (turn: Turn) => void;
  onSuggest: (prompt: string) => void;
}

const TurnView = memo(function TurnView({
  turn,
  isFirst,
  isLast,
  onAnswer,
  onRetry,
  onRestore,
  onSuggest,
}: TurnViewProps) {
  const text = turnText(turn);

  return (
    <ConversationTurn>
      <Box flexDirection="column" gap="xl" minWidth={0}>
        {isFirst ? null : (
          <Checkpoint
            label="Можно вернуться сюда"
            restoreLabel="Вернуться"
            onRestore={() => onRestore(turn)}
          />
        )}
        <Message author="user">
          <Text>{turn.prompt}</Text>
          {turn.attachments.length > 0 ? (
            <Text variant="caption" color="muted">
              {turn.attachments.join(", ")}
            </Text>
          ) : null}
        </Message>
        <Message
          author="assistant"
          actions={
            turn.state === "running" ? undefined : (
              <>
                {text ? (
                  <CopyButton
                    copiedLabel="Ответ скопирован"
                    label="Скопировать ответ"
                    value={text}
                  />
                ) : null}
                {isLast ? (
                  <Button
                    isIconOnly
                    aria-label="Повторить"
                    size="sm"
                    variant="ghost"
                    onPress={() => onRetry(turn)}
                  >
                    <ArrowRotateRight />
                  </Button>
                ) : null}
                {turn.state === "stopped" ? (
                  <Text as="span" variant="caption" color="muted">
                    Остановлено
                  </Text>
                ) : null}
              </>
            )
          }
        >
          {turn.parts.map((part) => (
            <PartView key={part.id} part={part} onAnswer={onAnswer} />
          ))}
        </Message>
        {isLast && turn.state === "done" ? (
          <Suggestions
            items={suggestions.filter((item) => item !== turn.prompt)}
            label="Подсказки"
            onSelect={onSuggest}
          />
        ) : null}
      </Box>
    </ConversationTurn>
  );
});

interface AssistantComposerProps {
  draft: string;
  onDraftChange: (draft: string) => void;
  attachments: PromptAttachment[];
  onAttachmentsChange: Dispatch<SetStateAction<PromptAttachment[]>>;
  effort: Effort;
  onEffortChange: (effort: Effort) => void;
  isRunning: boolean;
  usedTokens: number;
  onStop: () => void;
  onSend: (prompt: string) => void;
}

/** Lives apart from the conversation: a streamed word must not touch the field. */
const AssistantComposer = memo(function AssistantComposer({
  draft,
  onDraftChange,
  attachments,
  onAttachmentsChange,
  effort,
  onEffortChange,
  isRunning,
  usedTokens,
  onStop,
  onSend,
}: AssistantComposerProps) {
  const [model, setModel] = useState<Model>("kasanie");

  return (
    <PromptComposer
      attachLabel="Прикрепить файл"
      attachments={attachments}
      isRunning={isRunning}
      label="Сообщение помощнику"
      placeholder="Спросите о сделках или клиентах"
      removeAttachmentLabel="Убрать"
      stopLabel="Остановить"
      submitLabel="Отправить"
      toolbar={
        <>
          <ModelPicker
            effort={effort}
            effortLabel="Глубина размышлений"
            efforts={efforts}
            model={model}
            modelLabel="Модель"
            models={models}
            onEffortChange={onEffortChange}
            onModelChange={setModel}
          />
          <ContextMeter
            detail={`${usedTokens.toLocaleString("ru-RU")} из ${CONTEXT_LIMIT.toLocaleString("ru-RU")} токенов`}
            label="Заполнение контекста"
            limit={CONTEXT_LIMIT}
            used={usedTokens}
          />
        </>
      }
      value={draft}
      onAttach={(files) =>
        onAttachmentsChange((list) => [
          ...list,
          ...files.map((file) => ({ id: crypto.randomUUID(), name: file.name })),
        ])
      }
      onChange={onDraftChange}
      onRemoveAttachment={(id) =>
        onAttachmentsChange((list) => list.filter((file) => file.id !== id))
      }
      onStop={onStop}
      onSubmit={() => onSend(draft.trim())}
    />
  );
});

export function AssistantApp() {
  const { turns, isRunning, start, stop, answer, retry, restore: restoreTurn } = useAgent();
  const [draft, setDraft] = useState("");
  const [attachments, setAttachments] = useState<PromptAttachment[]>([]);
  const [effort, setEffort] = useState<Effort>("balanced");
  const latest = useRef({ attachments, effort });

  useEffect(() => {
    latest.current = { attachments, effort };
  }, [attachments, effort]);

  useEffect(() => {
    const { style } = document.documentElement;
    style.scrollbarGutter = "stable";
    return () => {
      style.removeProperty("scrollbar-gutter");
    };
  }, []);

  const send = useCallback(
    (prompt: string) => {
      void start(
        prompt,
        latest.current.attachments.map((file) => file.name),
        latest.current.effort,
      );
      setDraft("");
      setAttachments([]);
    },
    [start],
  );

  const retryTurn = useCallback((turn: Turn) => retry(turn, latest.current.effort), [retry]);

  const restore = useCallback(
    (turn: Turn) => {
      restoreTurn(turn.id);
      setDraft(turn.prompt);
    },
    [restoreTurn],
  );

  const usedTokens = turns.reduce((sum, turn) => sum + turn.tokens, 0);
  const lastTurn = turns.at(-1);

  return (
    <Box flexDirection="column" width="100%" paddingHorizontal={{ base: "none", md: "s" }}>
      <Box
        as="main"
        flexDirection="column"
        alignItems="center"
        flexGrow={1}
        backgroundColor="background-panel"
        borderRadius={{ base: "none", md: "l" }}
        paddingHorizontal="l"
        paddingTop={{ base: "l", md: "2xl" }}
      >
        <Box flexDirection="column" flexGrow={1} width="100%" maxWidth={tokens.widths.content}>
          <Conversation
            footer={
              <AssistantComposer
                attachments={attachments}
                draft={draft}
                effort={effort}
                isRunning={isRunning}
                usedTokens={usedTokens}
                onAttachmentsChange={setAttachments}
                onDraftChange={setDraft}
                onEffortChange={setEffort}
                onSend={send}
                onStop={stop}
              />
            }
            followKey={lastTurn?.id}
            label="Диалог с помощником"
            scrollLabel="К последнему сообщению"
            topInset={TOP_INSET}
          >
            {turns.length === 0 ? (
              <Box
                flexDirection="column"
                justifyContent="center"
                gap="xl"
                flexGrow={1}
                motion="fade"
              >
                <Box display="block">
                  <Text as="h1" variant="heading-m">
                    Чем помочь?
                  </Text>
                  <Text as="p" variant="heading-m" color="muted">
                    Я вижу сделки, клиентов и отчёты
                  </Text>
                </Box>
                <Suggestions items={suggestions} label="Подсказки" onSelect={send} />
              </Box>
            ) : null}
            {turns.map((turn, index) => (
              <TurnView
                key={turn.id}
                isFirst={index === 0}
                isLast={turn === lastTurn}
                turn={turn}
                onAnswer={answer}
                onRestore={restore}
                onRetry={retryTurn}
                onSuggest={send}
              />
            ))}
          </Conversation>
        </Box>
      </Box>
    </Box>
  );
}

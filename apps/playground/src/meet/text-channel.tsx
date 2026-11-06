import { Box, Button, Shimmer, Text } from "@anyglade/kit";
import {
  Conversation,
  ConversationNewMark,
  PromptComposer,
  type PromptAttachment,
} from "@anyglade/kit/ai";
import { ArrowLeft, Hashtag } from "@anyglade/kit/icons";
import { memo, useState, type ReactNode, type Ref } from "react";
import { formatDay, formatMessageTime, startOfDay } from "../messenger/format.ts";
import { firstName, ME, personById, type Note, type TextChannel } from "./data.ts";
import { PersonAvatar } from "./tiles.tsx";

interface NoteRowProps {
  note: Note;
  /** Continues a run from the same author, so the name and the avatar repeat once. */
  isGrouped: boolean;
  dayLabel: string | null;
  isFirstNew: boolean;
  isHistory: boolean;
}

/** A room has many authors, so everyone reads down one edge instead of in bubbles. */
const NoteRow = memo(function NoteRow({
  note,
  isGrouped,
  dayLabel,
  isFirstNew,
  isHistory,
}: NoteRowProps) {
  return (
    <Box flexDirection="column" gap="m" minWidth={0} marginTop={isGrouped ? "-m" : undefined}>
      {dayLabel ? (
        <Text variant="caption" color="muted" align="center">
          {dayLabel}
        </Text>
      ) : null}
      {isFirstNew ? <ConversationNewMark label="Новые сообщения" /> : null}
      <Box gap="m" minWidth={0} motion={isHistory ? undefined : "enter"}>
        <Box display="block" flexShrink={0} width={32}>
          {isGrouped ? null : <PersonAvatar personId={note.authorId} />}
        </Box>
        <Box flexDirection="column" flexGrow={1} minWidth={0}>
          {isGrouped ? null : (
            <Box alignItems="baseline" gap="s" minWidth={0}>
              <Text as="span" weight="medium" truncate>
                {note.authorId === ME ? "Вы" : personById(note.authorId).name}
              </Text>
              <Text as="span" variant="caption" color="subtle" tabularNums>
                {formatMessageTime(note.at)}
              </Text>
            </Box>
          )}
          <Text>{note.text}</Text>
          {note.attachments?.map((name) => (
            <Text key={name} variant="caption" color="muted" monospace>
              {name}
            </Text>
          ))}
        </Box>
      </Box>
    </Box>
  );
});

interface NotesProps {
  channel: TextChannel;
  notes: Note[];
  typingId: string | undefined;
}

function Notes({ channel, notes, typingId }: NotesProps) {
  const [openedAt] = useState(Date.now);
  // Fixed on opening: the mark stays where it was while the messages below get read.
  const [firstNewId] = useState(() =>
    channel.unread > 0
      ? notes.filter((note) => note.authorId !== ME).at(-channel.unread)?.id
      : null,
  );

  return (
    <Box flexDirection="column" gap="l" marginTop="auto" minWidth={0}>
      {notes.length === 0 ? (
        <Box flexDirection="column" gap="xs" paddingVertical="xl">
          <Text variant="title">Здесь пока тихо</Text>
          <Text color="muted">Напишите первым, и канал оживёт.</Text>
        </Box>
      ) : null}
      {notes.map((note, position) => {
        const previous = notes[position - 1];
        const isNewDay = !previous || startOfDay(previous.at) !== startOfDay(note.at);
        return (
          <NoteRow
            key={note.id}
            dayLabel={isNewDay ? formatDay(note.at) : null}
            isFirstNew={note.id === firstNewId}
            isGrouped={!isNewDay && previous?.authorId === note.authorId}
            isHistory={note.at <= openedAt}
            note={note}
          />
        );
      })}
      {typingId ? (
        <Box display="block" motion="fade">
          <Text variant="caption" color="muted">
            <Shimmer>{`${firstName(typingId)} печатает`}</Shimmer>
          </Text>
        </Box>
      ) : null}
    </Box>
  );
}

interface ComposerProps {
  channel: TextChannel;
  draft: string;
  inputRef: Ref<HTMLTextAreaElement> | undefined;
  onDraft: (text: string) => void;
  onSend: (text: string, attachments: string[]) => void;
}

function Composer({ channel, draft, inputRef, onDraft, onSend }: ComposerProps) {
  const [attachments, setAttachments] = useState<PromptAttachment[]>([]);

  return (
    <PromptComposer
      attachLabel="Прикрепить файл"
      attachments={attachments}
      inputRef={inputRef}
      isRunning={false}
      label={`Сообщение в канал ${channel.name}`}
      placeholder={`Написать в ${channel.name}`}
      removeAttachmentLabel="Убрать"
      stopLabel="Остановить"
      submitLabel="Отправить"
      value={draft}
      onAttach={(files) =>
        setAttachments((list) => [
          ...list,
          ...files.map((file) => ({ id: crypto.randomUUID(), name: file.name })),
        ])
      }
      onChange={onDraft}
      onRemoveAttachment={(id) => setAttachments((list) => list.filter((file) => file.id !== id))}
      onStop={() => undefined}
      onSubmit={() => {
        onSend(
          draft.trim(),
          attachments.map((file) => file.name),
        );
        setAttachments([]);
      }}
    />
  );
}

interface TextChannelViewProps {
  channel: TextChannel;
  notes: Note[];
  draft: string;
  typingId: string | undefined;
  /** Shown on a phone, where no window keeps the call in sight. */
  callStrip: ReactNode;
  inputRef?: Ref<HTMLTextAreaElement>;
  onBack: () => void;
  onDraft: (text: string) => void;
  onRead: () => void;
  onSend: (text: string, attachments: string[]) => void;
}

export function TextChannelView({
  channel,
  notes,
  draft,
  typingId,
  callStrip,
  inputRef,
  onBack,
  onDraft,
  onRead,
  onSend,
}: TextChannelViewProps) {
  return (
    <Box flexDirection="column" flexGrow={1} width="100%" minHeight={0}>
      <Box alignItems="center" gap="s" flexShrink={0} paddingHorizontal="l" paddingVertical="m">
        <Box display={{ base: "flex", md: "none" }}>
          <Button
            isIconOnly
            aria-label="К списку каналов"
            size="sm"
            variant="ghost"
            onPress={onBack}
          >
            <ArrowLeft />
          </Button>
        </Box>
        <Box as="span" display="inline-flex" color="text-secondary">
          <Hashtag />
        </Box>
        <Text variant="title" truncate>
          {channel.name}
        </Text>
      </Box>
      {callStrip}
      <Conversation
        key={channel.id}
        isContained
        followKey={notes.findLast((note) => note.authorId === ME)?.id}
        footer={
          channel.isReadOnly ? (
            <Box justifyContent="center" padding="m">
              <Text color="muted">Писать здесь могут только организаторы</Text>
            </Box>
          ) : (
            <Composer
              key={channel.id}
              channel={channel}
              draft={draft}
              inputRef={inputRef}
              onDraft={onDraft}
              onSend={onSend}
            />
          )
        }
        label={`Сообщения канала ${channel.name}`}
        newCount={channel.unread}
        scrollLabel="К последнему сообщению"
        onReachEnd={onRead}
      >
        <Notes channel={channel} notes={notes} typingId={typingId} />
      </Conversation>
    </Box>
  );
}

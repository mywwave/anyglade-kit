import {
  AlertDialog,
  Avatar,
  Box,
  Badge,
  Button,
  CopyButton,
  CountBadge,
  Drawer,
  Dropdown,
  EmptyPanel,
  FloatingPanel,
  ItemList,
  Header,
  Label,
  ListBox,
  Loadable,
  Modal,
  SearchField,
  Separator,
  Select,
  Shimmer,
  Skeleton,
  Text,
  TextArea,
  tokens,
} from "@anyglade/kit";
import {
  Conversation,
  ConversationNewMark,
  DeliveryStatus,
  Message,
  PromptComposer,
  type PromptAttachment,
} from "@anyglade/kit/ai";
import {
  Archive,
  ArrowLeft,
  ArrowUturnCcwLeft,
  Bars,
  Check,
  ChevronDown,
  ChevronUp,
  Comments,
  EllipsisVertical,
  Magnifier,
  Pencil,
  Person,
  Star,
  StarFill,
  Tray,
  TrashBin,
  Xmark,
} from "@anyglade/kit/icons";
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type FormEvent,
  type ReactNode,
  type Ref,
  type RefObject,
} from "react";
import { formatRubles } from "../blocks/format.ts";
import { ChatMenuItems, LabelIcon, type ChatMenuActions } from "./chat-menu.tsx";
import { contactById, contacts, labels, type Chat, type LabelId, type Note } from "./data.ts";
import { formatListTime, formatMessageTime, startOfDay, formatDay } from "./format.ts";
import { useMessenger } from "./use-messenger.ts";

interface ChatWindowEntry {
  id: string;
  isOpen: boolean;
  focusRequest: number;
}

const NO_NOTES: Note[] = [];

type Section = "all" | "unread" | "starred" | "archive" | "trash" | LabelId;

const sections: { id: Section; label: string; icon: ComponentType }[] = [
  { id: "all", label: "Все чаты", icon: Comments },
  { id: "unread", label: "Непрочитанные", icon: Tray },
  { id: "starred", label: "Избранные", icon: Star },
  { id: "archive", label: "Архив", icon: Archive },
  { id: "trash", label: "Корзина", icon: TrashBin },
];

const LOAD_MS = 700;
const WINDOW_SIZE = { width: tokens.widths.form, height: 520 };

const isWideScreen = () => matchMedia(`(min-width: ${tokens.breakpoints.md})`).matches;

const deliveryLabels = {
  sending: "Отправляется",
  sent: "Отправлено",
  delivered: "Доставлено",
  read: "Прочитано",
};

const emptyStates: Partial<Record<Section, { title: string; description: string }>> = {
  unread: { title: "Всё прочитано", description: "Новые сообщения появятся здесь." },
  starred: {
    title: "Пока нет избранных",
    description: "Отметьте чат звездой, чтобы он был под рукой.",
  },
  archive: { title: "Архив пуст", description: "Сюда попадают чаты, убранные из списка." },
  trash: {
    title: "Корзина пуста",
    description: "Удалённые чаты хранятся здесь до окончательного удаления.",
  },
};

function inSection(chat: Chat, section: Section) {
  switch (section) {
    case "archive":
    case "trash":
      return chat.place === section;
    case "all":
      return chat.place === "inbox";
    case "unread":
      return chat.place === "inbox" && chat.unread > 0;
    case "starred":
      return chat.place === "inbox" && chat.isStarred;
    default:
      return chat.place === "inbox" && chat.label === section;
  }
}

interface ContactAvatarProps {
  contactId: string;
  isSmall?: boolean;
  showsPresence?: boolean;
}

function ContactAvatar({ contactId, isSmall = false, showsPresence = false }: ContactAvatarProps) {
  const contact = contactById(contactId);
  const avatar = (
    <Avatar className={isSmall ? "size-8" : "size-10"} size="sm">
      {contact?.image ? <Avatar.Image alt="" src={contact.image} /> : null}
      <Avatar.Fallback>{contact?.name.charAt(0)}</Avatar.Fallback>
    </Avatar>
  );

  return showsPresence && contact?.isOnline ? (
    <Badge.Anchor>
      {avatar}
      <Badge aria-label="В сети" color="success" placement="bottom-right" size="sm" />
    </Badge.Anchor>
  ) : (
    avatar
  );
}

interface NavButtonProps {
  label: string;
  icon: ReactNode;
  count?: number;
  isActive: boolean;
  onPress: () => void;
}

function NavButton({ label, icon, count, isActive, onPress }: NavButtonProps) {
  return (
    <Button
      aria-current={isActive ? "page" : undefined}
      className="justify-start"
      fullWidth
      size="sm"
      variant={isActive ? "secondary" : "ghost"}
      onPress={onPress}
    >
      {icon}
      {label}
      {count ? (
        <Box as="span" display="block" marginLeft="auto">
          <Text as="span" variant="caption" color="muted" tabularNums>
            {count}
          </Text>
        </Box>
      ) : null}
    </Button>
  );
}

interface SectionsProps {
  section: Section;
  chats: Chat[];
  onSelect: (section: Section) => void;
  onCompose: () => void;
}

const Sections = memo(function Sections({ section, chats, onSelect, onCompose }: SectionsProps) {
  const count = (id: Section) => chats.filter((chat) => inSection(chat, id)).length;
  const unread = chats.filter((chat) => chat.place === "inbox" && chat.unread > 0).length;

  return (
    <Box flexDirection="column" justifyContent="between" gap="xl" flexGrow={1} minHeight={0}>
      <Box flexDirection="column" gap="xl" minHeight={0} overflowY="auto">
        <Box as="nav" aria-label="Разделы сообщений" flexDirection="column" gap="xs">
          {sections.map(({ id, label, icon: Icon }) => (
            <NavButton
              key={id}
              count={id === "unread" ? unread : undefined}
              icon={<Icon />}
              isActive={section === id}
              label={label}
              onPress={() => onSelect(id)}
            />
          ))}
        </Box>
        <Box as="nav" aria-label="Метки" flexDirection="column" gap="xs">
          <Box display="block" paddingHorizontal="m">
            <Text variant="caption" color="muted">
              Метки
            </Text>
          </Box>
          {labels.map(({ id, label }) => (
            <NavButton
              key={id}
              count={count(id)}
              icon={<LabelIcon id={id} />}
              isActive={section === id}
              label={label}
              onPress={() => onSelect(id)}
            />
          ))}
        </Box>
      </Box>
      <Button fullWidth variant="secondary" onPress={onCompose}>
        <Pencil />
        Новое сообщение
      </Button>
    </Box>
  );
});

interface ChatRowProps {
  chat: Chat;
  last: Note | undefined;
  onToggleStar: (chat: Chat) => void;
}

const ChatRow = memo(function ChatRow({ chat, last, onToggleStar }: ChatRowProps) {
  const contact = contactById(chat.contactId);
  const isUnread = chat.unread > 0;

  return (
    <Box alignItems="start" gap="m" minWidth={0}>
      <ContactAvatar showsPresence contactId={chat.contactId} />
      <Box flexDirection="column" flexGrow={1} minWidth={0}>
        <Box alignItems="center" justifyContent="between" gap="s" minWidth={0}>
          <Box alignItems="center" gap="xs" minWidth={0}>
            <Text as="span" weight={isUnread ? "medium" : undefined} truncate>
              {contact?.name}
            </Text>
            <LabelIcon id={chat.label} />
          </Box>
          <Box as="span" display="inline-flex" alignItems="center" gap="2xs" flexShrink={0}>
            {last?.mine ? <DeliveryStatus labels={deliveryLabels} status={last.delivery} /> : null}
            <Text as="span" variant="caption" color={isUnread ? "default" : "muted"} tabularNums>
              {last ? formatListTime(last.at) : ""}
            </Text>
          </Box>
        </Box>
        <Box alignItems="center" justifyContent="between" gap="s" minWidth={0}>
          <Text as="span" variant="caption" color={isUnread ? "default" : "muted"} truncate>
            {chat.isTyping ? (
              <Shimmer>печатает</Shimmer>
            ) : (
              `${last?.mine ? "Вы: " : ""}${last?.text ?? ""}`
            )}
          </Text>
          <Box as="span" display="inline-flex" alignItems="center" gap="xs" flexShrink={0}>
            {isUnread ? <CountBadge count={chat.unread} /> : null}
            <Button
              isIconOnly
              aria-label={chat.isStarred ? "Убрать из избранных" : "В избранные"}
              aria-pressed={chat.isStarred}
              className="size-6"
              size="sm"
              variant="ghost"
              onPress={() => onToggleStar(chat)}
            >
              {chat.isStarred ? <StarFill /> : <Star />}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
});

interface MessageItemProps {
  note: Note;
  /** Continues a run of messages from the same author. */
  isGrouped: boolean;
  dayLabel: string | null;
  isHistory: boolean;
  isFirstNew: boolean;
}

const MessageItem = memo(function MessageItem({
  note,
  isGrouped,
  dayLabel,
  isHistory,
  isFirstNew,
}: MessageItemProps) {
  const side = note.mine ? "right" : "left";

  return (
    <Box flexDirection="column" gap="m" minWidth={0} marginTop={isGrouped ? "-s" : undefined}>
      {dayLabel ? (
        <Text variant="caption" color="muted" align="center">
          {dayLabel}
        </Text>
      ) : null}
      {isFirstNew ? <ConversationNewMark label="Новые сообщения" /> : null}
      <Box flexDirection="column" gap="xs" minWidth={0} motion={isHistory ? undefined : "enter"}>
        {isGrouped ? null : (
          <Text variant="caption" color="subtle" align={side}>
            {formatMessageTime(note.at)}
          </Text>
        )}
        <Message
          isHistory
          author={note.mine ? "user" : "contact"}
          meta={
            note.mine ? <DeliveryStatus labels={deliveryLabels} status={note.delivery} /> : null
          }
        >
          <Box display="block" maxWidth={tokens.widths.content}>
            <Text>{note.text}</Text>
          </Box>
          {note.attachments?.map((name) => (
            <Text key={name} variant="caption" color="muted" monospace>
              {name}
            </Text>
          ))}
        </Message>
      </Box>
    </Box>
  );
});

function Messages({ chat, notes }: { chat: Chat; notes: Note[] }) {
  const [openedAt] = useState(Date.now);
  // Fixed on opening: the mark stays where it was while the messages below get read.
  const [firstNewId] = useState(() =>
    chat.unread > 0 ? notes.filter((note) => !note.mine).at(-chat.unread)?.id : undefined,
  );
  const contact = contactById(chat.contactId);

  return (
    <Box flexDirection="column" gap="m" marginTop="auto" minWidth={0}>
      {notes.map((note, position) => {
        const previous = notes[position - 1];
        const isNewDay = !previous || startOfDay(previous.at) !== startOfDay(note.at);
        return (
          <MessageItem
            key={note.id}
            dayLabel={isNewDay ? formatDay(note.at) : null}
            isGrouped={!isNewDay && previous?.mine === note.mine}
            isFirstNew={note.id === firstNewId}
            isHistory={note.at <= openedAt}
            note={note}
          />
        );
      })}
      {chat.isTyping ? (
        <Box display="block" motion="fade">
          <Text variant="caption" color="muted">
            <Shimmer>{`${contact?.name.split(" ")[0]} печатает`}</Shimmer>
          </Text>
        </Box>
      ) : null}
    </Box>
  );
}

function CardField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Box flexDirection="column" minWidth={0}>
      <Text variant="caption" color="muted">
        {label}
      </Text>
      {children}
    </Box>
  );
}

function CopyField({ label, value }: { label: string; value: string }) {
  return (
    <CardField label={label}>
      <Box alignItems="center" justifyContent="between" gap="s" minWidth={0}>
        <Text truncate>{value}</Text>
        <CopyButton
          copiedLabel={`${label} скопирован`}
          label={`Скопировать: ${label.toLowerCase()}`}
          size="sm"
          value={value}
          variant="ghost"
        />
      </Box>
    </CardField>
  );
}

interface ClientCardProps {
  chat: Chat;
  onComment: (id: string, comment: string) => void;
}

const ClientCard = memo(function ClientCard({ chat, onComment }: ClientCardProps) {
  const contact = contactById(chat.contactId);
  if (!contact) {
    return null;
  }

  return (
    <Box key={contact.id} flexDirection="column" gap="l" motion="fade">
      <Box alignItems="center" gap="m" minWidth={0}>
        <ContactAvatar contactId={contact.id} />
        <Box flexDirection="column" minWidth={0}>
          <Text truncate>{contact.role}</Text>
          <Text variant="caption" color="muted">
            С нами с {contact.since}
          </Text>
        </Box>
      </Box>
      <Box flexDirection="column" gap="s">
        <CopyField label="Почта" value={contact.email} />
        <CopyField label="Телефон" value={contact.phone} />
        {contact.deals ? (
          <CardField label="Сделки">
            <Text tabularNums>
              {contact.deals.count} на {formatRubles(contact.deals.total)}
            </Text>
          </CardField>
        ) : null}
      </Box>
      <TextArea
        aria-label={`Заметка о клиенте ${contact.name}`}
        fullWidth
        placeholder="Заметка о клиенте"
        rows={3}
        value={chat.comment}
        variant="secondary"
        onChange={(event) => onComment(chat.id, event.target.value)}
      />
    </Box>
  );
});

function Footer({
  chat,
  inputRef,
  onSend,
  onDraft,
}: {
  chat: Chat;
  inputRef?: Ref<HTMLTextAreaElement>;
  onSend: (text: string, attachments: string[]) => void;
  onDraft: (text: string) => void;
}) {
  const [attachments, setAttachments] = useState<PromptAttachment[]>([]);
  const contact = contactById(chat.contactId);

  return (
    <PromptComposer
      attachLabel="Прикрепить файл"
      attachments={attachments}
      inputRef={inputRef}
      isRunning={false}
      label={`Сообщение для ${contact?.name}`}
      placeholder="Напишите сообщение"
      removeAttachmentLabel="Убрать"
      stopLabel="Остановить"
      submitLabel="Отправить"
      value={chat.draft}
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
          chat.draft.trim(),
          attachments.map((file) => file.name),
        );
        setAttachments([]);
      }}
    />
  );
}

interface ChatViewProps {
  chat: Chat;
  notes: Note[];
  inputRef?: Ref<HTMLTextAreaElement>;
  onDraft: (id: string, text: string) => void;
  onRead: (id: string) => void;
  onSend: (id: string, text: string, attachments: string[]) => void;
}

function ChatView({ chat, notes, inputRef, onDraft, onRead, onSend }: ChatViewProps) {
  return (
    <Conversation
      key={chat.id}
      isContained
      followKey={notes.findLast((note) => note.mine)?.id}
      footer={
        <Footer
          chat={chat}
          inputRef={inputRef}
          onDraft={(text) => onDraft(chat.id, text)}
          onSend={(text, files) => onSend(chat.id, text, files)}
        />
      }
      label={`Переписка с ${contactById(chat.contactId)?.name}`}
      newCount={chat.unread}
      scrollLabel="К последнему сообщению"
      onReachEnd={() => onRead(chat.id)}
    >
      <Messages chat={chat} notes={notes} />
    </Conversation>
  );
}

interface ChatWindowProps extends Omit<ChatViewProps, "inputRef"> {
  isOpen: boolean;
  /** Grows each time the chat is asked for again: the window comes forward, ready to type. */
  focusRequest: number;
  onClose: (id: string) => void;
  onExited: (id: string) => void;
}

const ChatWindow = memo(function ChatWindow({
  chat,
  notes,
  isOpen,
  focusRequest,
  onClose,
  onExited,
  onDraft,
  onRead,
  onSend,
}: ChatWindowProps) {
  const input = useRef<HTMLTextAreaElement>(null);
  const name = contactById(chat.contactId)?.name ?? "";

  useEffect(() => {
    input.current?.focus();
  }, [focusRequest]);

  return (
    <FloatingPanel
      isBodyFlush
      closeLabel={`Закрыть окно: ${name}`}
      isOpen={isOpen}
      moveLabel={`Переместить окно: ${name}`}
      resize={{ label: `Изменить размер окна: ${name}`, defaultSize: WINDOW_SIZE }}
      title={name}
      onExited={() => onExited(chat.id)}
      onOpenChange={() => onClose(chat.id)}
    >
      <ChatView
        chat={chat}
        inputRef={input}
        notes={notes}
        onDraft={onDraft}
        onRead={onRead}
        onSend={onSend}
      />
    </FloatingPanel>
  );
});

function ChatHeader({
  chat,
  position,
  onClose,
  onMove,
  onToggleStar,
  onArchive,
  onRestore,
  onTrash,
  onRemove,
  onMarkUnread,
  onLabel,
  cardTriggerRef,
  isCardOpen,
  onToggleCard,
}: {
  chat: Chat;
  position: { index: number; total: number };
  onClose: () => void;
  onMove: (step: number) => void;
  onToggleStar: () => void;
  onArchive: () => void;
  onRestore: () => void;
  onTrash: () => void;
  onRemove: () => void;
  onMarkUnread: () => void;
  onLabel: (label: LabelId) => void;
  cardTriggerRef: RefObject<HTMLButtonElement | null>;
  isCardOpen: boolean;
  onToggleCard: () => void;
}) {
  const contact = contactById(chat.contactId);
  const isTrash = chat.place === "trash";

  return (
    <Box alignItems="center" gap="s" flexShrink={0} paddingHorizontal="l" paddingVertical="m">
      <Box display={{ base: "flex", md: "none" }}>
        <Button isIconOnly aria-label="К списку чатов" size="sm" variant="ghost" onPress={onClose}>
          <ArrowLeft />
        </Button>
      </Box>
      <Box display={{ base: "none", md: "flex" }}>
        <Button isIconOnly aria-label="Закрыть чат" size="sm" variant="ghost" onPress={onClose}>
          <Xmark />
        </Button>
      </Box>
      <ContactAvatar isSmall contactId={chat.contactId} />
      <Box flexDirection="column" flexGrow={1} minWidth={0}>
        <Text variant="title" truncate>
          {contact?.name}
        </Text>
        <Text variant="caption" color={contact?.isOnline ? "success" : "muted"} truncate>
          {chat.isTyping ? "печатает" : contact?.isOnline ? "в сети" : contact?.role}
        </Text>
      </Box>
      <Box display={{ base: "none", sm: "flex" }} alignItems="center" gap="2xs">
        <Button
          isIconOnly
          aria-label="Предыдущий чат"
          isDisabled={position.index <= 0}
          size="sm"
          variant="ghost"
          onPress={() => onMove(-1)}
        >
          <ChevronUp />
        </Button>
        <Button
          isIconOnly
          aria-label="Следующий чат"
          isDisabled={position.index < 0 || position.index >= position.total - 1}
          size="sm"
          variant="ghost"
          onPress={() => onMove(1)}
        >
          <ChevronDown />
        </Button>
      </Box>
      <Button
        ref={cardTriggerRef}
        isIconOnly
        aria-expanded={isCardOpen}
        aria-label="Карточка клиента"
        size="sm"
        variant={isCardOpen ? "secondary" : "ghost"}
        onPress={onToggleCard}
      >
        <Person />
      </Button>
      <Box display={{ base: "none", sm: "flex" }}>
        <Button
          isIconOnly
          aria-label={chat.isStarred ? "Убрать из избранных" : "В избранные"}
          size="sm"
          variant="ghost"
          onPress={onToggleStar}
        >
          {chat.isStarred ? <StarFill /> : <Star />}
        </Button>
      </Box>
      {chat.place === "inbox" ? (
        <Button isIconOnly aria-label="В архив" size="sm" variant="ghost" onPress={onArchive}>
          <Archive />
        </Button>
      ) : (
        <Button isIconOnly aria-label="Вернуть" size="sm" variant="ghost" onPress={onRestore}>
          <ArrowUturnCcwLeft />
        </Button>
      )}
      {isTrash ? (
        <Button
          isIconOnly
          aria-label="Удалить навсегда"
          size="sm"
          variant="ghost"
          onPress={onRemove}
        >
          <TrashBin />
        </Button>
      ) : (
        <Button isIconOnly aria-label="В корзину" size="sm" variant="ghost" onPress={onTrash}>
          <TrashBin />
        </Button>
      )}
      <Dropdown>
        <Button isIconOnly aria-label="Ещё" size="sm" variant="ghost">
          <EllipsisVertical />
        </Button>
        <Dropdown.Popover>
          <Dropdown.Menu
            aria-label="Действия с чатом"
            onAction={(key) => {
              const label = labels.find(({ id }) => id === key);
              if (label) {
                onLabel(label.id);
              } else {
                onMarkUnread();
              }
            }}
          >
            <Dropdown.Item id="unread" textValue="Отметить непрочитанным">
              <Label>Отметить непрочитанным</Label>
            </Dropdown.Item>
            <Separator />
            <Dropdown.Section aria-label="Метка">
              <Header>Метка</Header>
              {labels.map(({ id, label }) => (
                <Dropdown.Item key={id} id={id} textValue={label}>
                  <LabelIcon id={id} />
                  <Label>{label}</Label>
                  {id === chat.label ? (
                    <Box as="span" display="inline-flex" marginLeft="auto">
                      <Check />
                    </Box>
                  ) : null}
                </Dropdown.Item>
              ))}
            </Dropdown.Section>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
    </Box>
  );
}

function ComposeModal({
  isOpen,
  onOpenChange,
  onStart,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onStart: (contactId: string, text: string) => void;
}) {
  const [contactId, setContactId] = useState(contacts[0]?.id ?? "");
  const [text, setText] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (text.trim()) {
      onStart(contactId, text.trim());
      setText("");
      onOpenChange(false);
    }
  }

  return (
    <Modal>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Новое сообщение</Modal.Heading>
            </Modal.Header>
            <Box as="form" flexDirection="column" gap="l" onSubmit={submit}>
              <Modal.Body>
                <Box flexDirection="column" gap="m">
                  <Select
                    aria-label="Кому"
                    className="w-full"
                    value={contactId}
                    onChange={(key) => setContactId(String(key))}
                  >
                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        {contacts.map((contact) => (
                          <ListBox.Item key={contact.id} id={contact.id} textValue={contact.name}>
                            {contact.name}
                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>
                  <TextArea
                    aria-label="Текст сообщения"
                    fullWidth
                    placeholder="Напишите сообщение"
                    rows={4}
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                  />
                </Box>
              </Modal.Body>
              <Modal.Footer>
                <Button slot="close" variant="tertiary">
                  Отменить
                </Button>
                <Button isDisabled={!text.trim()} type="submit">
                  Отправить
                </Button>
              </Modal.Footer>
            </Box>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

function RemoveDialog({
  contactName,
  isOpen,
  onOpenChange,
  onRemove,
}: {
  contactName: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onRemove: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialog.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
        <AlertDialog.Container>
          <AlertDialog.Dialog>
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>Удалить чат с {contactName}?</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <Text as="p">Переписка удалится без возможности восстановить.</Text>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button slot="close" variant="tertiary">
                Отменить
              </Button>
              <Button slot="close" variant="danger" onPress={onRemove}>
                Удалить чат
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}

function MessengerSkeleton() {
  return (
    <Box
      height="100%"
      width="100%"
      gap="s"
      paddingHorizontal={{ base: "none", md: "s" }}
      paddingBottom={{ base: "none", md: "s" }}
    >
      <Box
        display={{ base: "none", lg: "flex" }}
        flexDirection="column"
        gap="xs"
        flexShrink={0}
        width={216}
        padding="s"
      >
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} className="h-8 w-full rounded-full" />
        ))}
      </Box>
      <Box
        flexDirection="column"
        gap="m"
        flexShrink={0}
        width={{ base: "100%", md: 320 }}
        padding="s"
      >
        <Skeleton className="h-10 w-full rounded-lg" />
        <Box flexDirection="column" gap="2xs">
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton key={index} className="h-16 w-full rounded-lg" />
          ))}
        </Box>
      </Box>
      <Box
        display={{ base: "none", md: "flex" }}
        flexGrow={1}
        minWidth={0}
        backgroundColor="background-panel"
        borderRadius="l"
      />
    </Box>
  );
}

export function MessengerApp() {
  const {
    chats,
    notes,
    archive,
    markRead,
    markUnread,
    removeForever,
    restore,
    send,
    setComment,
    setDraft,
    setLabel,
    startChat,
    toggleStar,
    trash,
  } = useMessenger();
  const [isLoading, setIsLoading] = useState(true);
  const [section, setSection] = useState<Section>("all");
  const [query, setQuery] = useState("");
  // On a phone the list comes first, so nothing counts as read until it is opened.
  const [openId, setOpenId] = useState(() => (isWideScreen() ? "maria" : null));
  const [windows, setWindows] = useState<ChatWindowEntry[]>([]);
  const [isPaneOpen, setIsPaneOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // The card stays with the last client while no chat is open.
  const cardTrigger = useRef<HTMLButtonElement>(null);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [cardChatId, setCardChatId] = useState(openId);
  if (openId && openId !== cardChatId) {
    setCardChatId(openId);
  }
  const cardChat = chats.find((chat) => chat.id === cardChatId);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), LOAD_MS);
    return () => clearTimeout(timer);
  }, []);

  const visible = useMemo(() => {
    const search = query.trim().toLowerCase();
    const lastAt = (chat: Chat) => notes[chat.id]?.at(-1)?.at ?? 0;

    return chats
      .filter((chat) => inSection(chat, section))
      .filter((chat) => {
        const contact = contactById(chat.contactId);
        return `${contact?.name} ${notes[chat.id]?.at(-1)?.text}`.toLowerCase().includes(search);
      })
      .toSorted((a, b) => lastAt(b) - lastAt(a));
  }, [chats, notes, section, query]);

  const open = chats.find((chat) => chat.id === openId);
  const openNotes = open ? (notes[open.id] ?? []) : [];

  const closeWindow = useCallback((id: string) => {
    setWindows((list) =>
      list.map((entry) => (entry.id === id ? { ...entry, isOpen: false } : entry)),
    );
  }, []);

  const forgetWindow = useCallback((id: string) => {
    setWindows((list) => list.filter((entry) => entry.id !== id));
  }, []);

  function openChat(id: string) {
    setOpenId(id);
    setIsPaneOpen(true);
  }

  function closeChat() {
    setOpenId(null);
    setIsPaneOpen(false);
  }

  function openWindow(id: string) {
    if (!isWideScreen()) {
      openChat(id);
      return;
    }
    setWindows((list) =>
      list.some((entry) => entry.id === id)
        ? list.map((entry) =>
            entry.id === id
              ? { ...entry, isOpen: true, focusRequest: entry.focusRequest + 1 }
              : entry,
          )
        : [...list, { id, isOpen: true, focusRequest: 0 }],
    );
  }

  function markChatUnread(id: string) {
    if (id === openId) {
      closeChat();
    }
    closeWindow(id);
    markUnread(id);
  }

  function removeChat(id: string) {
    if (id === openId) {
      closeChat();
    }
    forgetWindow(id);
    removeForever(id);
  }

  const chatActions: ChatMenuActions = {
    openWindow,
    markRead,
    markUnread: markChatUnread,
    toggleStar,
    openCard: (id) => {
      openChat(id);
      setIsCardOpen(true);
    },
    setLabel,
    archive,
    restore,
    trash,
    askToRemove: setRemovingId,
  };

  function selectSection(next: Section) {
    setSection(next);
    setIsMenuOpen(false);
  }

  const index = open ? visible.findIndex((chat) => chat.id === open.id) : -1;
  const empty = emptyStates[section];
  const sectionsPanel = (
    <Sections
      chats={chats}
      section={section}
      onCompose={() => {
        setIsMenuOpen(false);
        setIsComposing(true);
      }}
      onSelect={selectSection}
    />
  );

  return (
    <Loadable isLoading={isLoading} skeleton={<MessengerSkeleton />}>
      <Box
        height="100%"
        width="100%"
        minHeight={0}
        gap="s"
        paddingHorizontal={{ base: "none", md: "s" }}
        paddingBottom={{ base: "none", md: "s" }}
      >
        <Box
          display={{ base: "none", lg: "flex" }}
          flexDirection="column"
          flexShrink={0}
          width={216}
          minHeight={0}
          padding="s"
        >
          {sectionsPanel}
        </Box>
        <Drawer>
          <Drawer.Backdrop isOpen={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <Drawer.Content placement="left">
              <Drawer.Dialog aria-label="Разделы сообщений">
                <Drawer.Body>
                  <Box flexDirection="column" minHeight="100%">
                    {sectionsPanel}
                  </Box>
                </Drawer.Body>
              </Drawer.Dialog>
            </Drawer.Content>
          </Drawer.Backdrop>
        </Drawer>
        <Box
          display={{ base: isPaneOpen ? "none" : "flex", md: "flex" }}
          flexDirection="column"
          gap="m"
          flexShrink={0}
          width={{ base: "100%", md: 320 }}
          minHeight={0}
          padding="s"
        >
          <Box alignItems="center" gap="s">
            <Box display={{ base: "flex", lg: "none" }}>
              <Button
                isIconOnly
                aria-label="Открыть разделы"
                size="sm"
                variant="secondary"
                onPress={() => setIsMenuOpen(true)}
              >
                <Bars />
              </Button>
            </Box>
            <Box display="block" flexGrow={1} minWidth={0}>
              <SearchField aria-label="Поиск по чатам" value={query} onChange={setQuery}>
                <SearchField.Group>
                  <SearchField.SearchIcon />
                  <SearchField.Input className="w-full" placeholder="Поиск" />
                  <SearchField.ClearButton />
                </SearchField.Group>
              </SearchField>
            </Box>
          </Box>
          <Box display="block" flexGrow={1} minHeight={0} overflowY="auto">
            {visible.length > 0 ? (
              <ItemList
                currentId={openId}
                getText={(chat) => {
                  const name = contactById(chat.contactId)?.name ?? "";
                  return chat.unread > 0 ? `${name}, непрочитанных: ${chat.unread}` : name;
                }}
                items={visible}
                label="Чаты"
                menu={{
                  label: "Действия с чатом",
                  renderItems: (chat) => (
                    <ChatMenuItems
                      actions={chatActions}
                      canOpenWindow={isWideScreen()}
                      chat={chat}
                    />
                  ),
                }}
                renderItem={(chat) => (
                  <ChatRow chat={chat} last={notes[chat.id]?.at(-1)} onToggleStar={toggleStar} />
                )}
                onAltOpen={openWindow}
                onOpen={openChat}
              />
            ) : (
              <Box
                flexDirection="column"
                alignItems="center"
                gap="m"
                padding="xl"
                textAlign="center"
              >
                {query ? (
                  <>
                    <Box color="text-secondary">
                      <Magnifier />
                    </Box>
                    <Text color="muted">Никого не нашли</Text>
                    <Button size="sm" variant="secondary" onPress={() => setQuery("")}>
                      Сбросить поиск
                    </Button>
                  </>
                ) : (
                  <>
                    <Text variant="title">{empty?.title ?? "В этой метке пусто"}</Text>
                    <Text color="muted">
                      {empty?.description ?? "Чаты с этой меткой появятся здесь."}
                    </Text>
                  </>
                )}
              </Box>
            )}
          </Box>
        </Box>
        <Box
          as="main"
          display={{ base: isPaneOpen ? "flex" : "none", md: "flex" }}
          flexDirection="column"
          flexGrow={1}
          minWidth={0}
          minHeight={0}
          overflowY="hidden"
          backgroundColor="background-panel"
          borderRadius={{ base: "none", md: "l" }}
        >
          {open ? (
            <Box flexDirection="column" flexGrow={1} width="100%" minHeight={0}>
              <ChatHeader
                cardTriggerRef={cardTrigger}
                chat={open}
                isCardOpen={isCardOpen}
                position={{ index, total: visible.length }}
                onArchive={() => archive(open)}
                onClose={closeChat}
                onLabel={(label) => setLabel(open.id, label)}
                onMarkUnread={() => markChatUnread(open.id)}
                onMove={(step) => {
                  const next = visible[index + step];
                  if (next) {
                    setOpenId(next.id);
                  }
                }}
                onRemove={() => setRemovingId(open.id)}
                onRestore={() => restore(open)}
                onToggleCard={() => setIsCardOpen(!isCardOpen)}
                onToggleStar={() => toggleStar(open)}
                onTrash={() => trash(open)}
              />
              <ChatView
                chat={open}
                notes={openNotes}
                onDraft={setDraft}
                onRead={markRead}
                onSend={send}
              />
            </Box>
          ) : (
            <Box flexDirection="column" alignItems="center" justifyContent="center" flexGrow={1}>
              <EmptyPanel
                actions={
                  <Button size="sm" variant="secondary" onPress={() => setIsComposing(true)}>
                    Новое сообщение
                  </Button>
                }
                description="Откройте чат из списка или начните новый."
                icon={<Comments />}
                title="Чат не выбран"
              />
            </Box>
          )}
        </Box>
        <FloatingPanel
          closeLabel="Закрыть карточку"
          isOpen={isCardOpen && cardChat !== undefined}
          moveLabel="Переместить карточку"
          pinLabel="Закрепить на экране"
          title={contactById(cardChatId ?? "")?.name ?? ""}
          triggerRef={cardTrigger}
          unpinLabel="Вернуть к кнопке"
          onOpenChange={setIsCardOpen}
        >
          {cardChat ? <ClientCard chat={cardChat} onComment={setComment} /> : null}
        </FloatingPanel>
        {windows.map((entry) => {
          const chat = chats.find(({ id }) => id === entry.id);
          return chat ? (
            <ChatWindow
              key={entry.id}
              chat={chat}
              focusRequest={entry.focusRequest}
              isOpen={entry.isOpen}
              notes={notes[entry.id] ?? NO_NOTES}
              onClose={closeWindow}
              onDraft={setDraft}
              onExited={forgetWindow}
              onRead={markRead}
              onSend={send}
            />
          ) : null;
        })}
        <RemoveDialog
          contactName={contactById(removingId ?? "")?.name ?? ""}
          isOpen={removingId !== null}
          onOpenChange={() => setRemovingId(null)}
          onRemove={() => {
            if (removingId) {
              removeChat(removingId);
            }
          }}
        />
        <ComposeModal
          isOpen={isComposing}
          onOpenChange={setIsComposing}
          onStart={(contactId, text) => {
            startChat(contactId, text);
            setSection("all");
            setQuery("");
            openChat(contactId);
          }}
        />
      </Box>
    </Loadable>
  );
}

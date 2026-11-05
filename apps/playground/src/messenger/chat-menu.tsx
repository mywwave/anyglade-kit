import { Box, Dropdown, Label, Separator, Text } from "@anyglade/kit";
import { Check } from "@anyglade/kit/icons";
import { labels, type Chat, type LabelId } from "./data.ts";

export function LabelIcon({ id }: { id: LabelId }) {
  const label = labels.find((item) => item.id === id);
  if (!label) {
    return null;
  }
  const { icon: Icon, color } = label;

  return (
    <Box as="span" display="inline-flex" flexShrink={0} color={color}>
      <Icon />
    </Box>
  );
}

export interface ChatMenuActions {
  openWindow: (id: string) => void;
  markRead: (id: string) => void;
  markUnread: (id: string) => void;
  toggleStar: (chat: Chat) => void;
  openCard: (id: string) => void;
  setLabel: (id: string, label: LabelId) => void;
  archive: (chat: Chat) => void;
  restore: (chat: Chat) => void;
  trash: (chat: Chat) => void;
  askToRemove: (id: string) => void;
}

function Item({ title, onAction }: { title: string; onAction: () => void }) {
  return (
    <Dropdown.Item textValue={title} onAction={onAction}>
      <Label>{title}</Label>
    </Dropdown.Item>
  );
}

function DangerItem({ title, onAction }: { title: string; onAction: () => void }) {
  return (
    <Dropdown.Item textValue={title} variant="danger" onAction={onAction}>
      <Label>{title}</Label>
    </Dropdown.Item>
  );
}

interface ChatMenuItemsProps {
  chat: Chat;
  actions: ChatMenuActions;
  /** A phone has no room for a second window. */
  canOpenWindow: boolean;
}

export function ChatMenuItems({ chat, actions, canOpenWindow }: ChatMenuItemsProps) {
  const isUnread = chat.unread > 0;

  return (
    <>
      {canOpenWindow ? (
        <Dropdown.Item textValue="Открыть в окне" onAction={() => actions.openWindow(chat.id)}>
          <Label>Открыть в окне</Label>
          <Box as="span" display="inline-flex" marginLeft="auto" paddingLeft="l">
            <Text as="span" variant="caption" color="muted">
              Alt + клик
            </Text>
          </Box>
        </Dropdown.Item>
      ) : null}
      <Item
        title={isUnread ? "Отметить прочитанным" : "Отметить непрочитанным"}
        onAction={() => (isUnread ? actions.markRead(chat.id) : actions.markUnread(chat.id))}
      />
      <Item
        title={chat.isStarred ? "Убрать из избранных" : "В избранные"}
        onAction={() => actions.toggleStar(chat)}
      />
      <Item title="Карточка клиента" onAction={() => actions.openCard(chat.id)} />
      <Dropdown.SubmenuTrigger>
        <Dropdown.Item textValue="Метка">
          <Label>Метка</Label>
          <Dropdown.SubmenuIndicator />
        </Dropdown.Item>
        <Dropdown.Popover>
          <Dropdown.Menu aria-label="Метка">
            {labels.map(({ id, label }) => (
              <Dropdown.Item
                key={id}
                id={id}
                textValue={label}
                onAction={() => actions.setLabel(chat.id, id)}
              >
                <LabelIcon id={id} />
                <Label>{label}</Label>
                {id === chat.label ? (
                  <Box as="span" display="inline-flex" marginLeft="auto">
                    <Check />
                  </Box>
                ) : null}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown.SubmenuTrigger>
      <Separator />
      {chat.place === "inbox" ? (
        <Item title="В архив" onAction={() => actions.archive(chat)} />
      ) : (
        <Item title="Вернуть в чаты" onAction={() => actions.restore(chat)} />
      )}
      {chat.place === "trash" ? (
        <DangerItem title="Удалить навсегда" onAction={() => actions.askToRemove(chat.id)} />
      ) : (
        <DangerItem title="В корзину" onAction={() => actions.trash(chat)} />
      )}
    </>
  );
}

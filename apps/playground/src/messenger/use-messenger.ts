import { toast, withTransition } from "@anyglade/kit";
import { useState, type Dispatch, type SetStateAction } from "react";
import {
  contactById,
  initialChats,
  initialNotes,
  type Chat,
  type LabelId,
  type Note,
  type Place,
} from "./data.ts";

const TYPING_DELAY_MS = 900;
const TYPING_MS = 1800;

interface Setters {
  setChats: Dispatch<SetStateAction<Chat[]>>;
  setNotes: Dispatch<SetStateAction<Record<string, Note[]>>>;
}

const newNote = (mine: boolean, text: string, attachments?: string[]): Note => ({
  id: crypto.randomUUID(),
  mine,
  text,
  at: Date.now(),
  attachments,
});

/** Stable actions: a new message must not re-render every row of the list. */
function createActions({ setChats, setNotes }: Setters) {
  let openChatId: string | null = null;
  const replyCounts = new Map<string, number>();

  const patch = (id: string, change: Partial<Chat>) =>
    setChats((list) => list.map((chat) => (chat.id === id ? { ...chat, ...change } : chat)));

  const addNote = (chatId: string, note: Note) =>
    setNotes((notes) => ({ ...notes, [chatId]: [...(notes[chatId] ?? []), note] }));

  function moveTo(id: string, place: Place, message: string, from: Place) {
    withTransition(() => patch(id, { place }));
    const toastId = toast(message, {
      actionProps: {
        children: "Отменить",
        onPress: () => {
          withTransition(() => patch(id, { place: from }));
          toast.close(toastId);
        },
      },
    });
  }

  function scheduleReply(chatId: string) {
    const contact = contactById(chatId);
    const count = replyCounts.get(chatId) ?? 0;
    const text = contact?.replies[count % (contact.replies.length || 1)];
    if (!text) {
      return;
    }
    replyCounts.set(chatId, count + 1);
    setTimeout(() => patch(chatId, { isTyping: true }), TYPING_DELAY_MS);
    setTimeout(() => {
      withTransition(() => {
        addNote(chatId, newNote(false, text));
        setChats((list) =>
          list.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  isTyping: false,
                  unread: chatId === openChatId ? 0 : chat.unread + 1,
                }
              : chat,
          ),
        );
      });
    }, TYPING_DELAY_MS + TYPING_MS);
  }

  return {
    setOpenChat: (id: string | null) => {
      openChatId = id;
    },
    markRead: (id: string) => patch(id, { unread: 0 }),
    markUnread: (id: string) => patch(id, { unread: 1 }),
    setDraft: (id: string, draft: string) => patch(id, { draft }),
    setComment: (id: string, comment: string) => patch(id, { comment }),
    setLabel: (id: string, label: LabelId) => withTransition(() => patch(id, { label })),
    toggleStar: (chat: Chat) => patch(chat.id, { isStarred: !chat.isStarred }),
    archive: (chat: Chat) => moveTo(chat.id, "archive", "Чат в архиве", chat.place),
    restore: (chat: Chat) => moveTo(chat.id, "inbox", "Чат возвращён", chat.place),
    trash: (chat: Chat) => moveTo(chat.id, "trash", "Чат в корзине", chat.place),

    removeForever: (id: string) => {
      withTransition(() => setChats((list) => list.filter((chat) => chat.id !== id)));
      setNotes(({ [id]: _removed, ...rest }) => rest);
      toast("Чат удалён");
    },

    send: (chatId: string, text: string, attachments: string[]) => {
      withTransition(() => {
        addNote(chatId, newNote(true, text, attachments.length > 0 ? attachments : undefined));
        patch(chatId, { place: "inbox", draft: "" });
      });
      scheduleReply(chatId);
    },

    startChat: (contactId: string, text: string) => {
      setChats((list) =>
        list.some((chat) => chat.id === contactId)
          ? list.map((chat) => (chat.id === contactId ? { ...chat, place: "inbox" } : chat))
          : [
              ...list,
              {
                id: contactId,
                contactId,
                label: "work",
                place: "inbox",
                isStarred: false,
                unread: 0,
                isTyping: false,
                draft: "",
                comment: "",
              },
            ],
      );
      addNote(contactId, newNote(true, text));
      scheduleReply(contactId);
    },
  };
}

export function useMessenger() {
  const [chats, setChats] = useState(initialChats);
  const [notes, setNotes] = useState(initialNotes);
  const [actions] = useState(() => createActions({ setChats, setNotes }));

  return { chats, notes, ...actions };
}

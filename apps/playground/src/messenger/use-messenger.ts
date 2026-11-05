import { toast } from "@anyglade/kit";
import type { Delivery } from "@anyglade/kit/ai";
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

const SENT_MS = 400;
const DELIVERED_MS = 1000;
const READ_MS = 2000;
const TYPING_DELAY_MS = 2400;
const TYPING_MS = 1800;
/** Someone offline gets to the phone later, so their ticks and reply lag behind. */
const OFFLINE_PACE = 4;

interface Setters {
  setChats: Dispatch<SetStateAction<Chat[]>>;
  setNotes: Dispatch<SetStateAction<Record<string, Note[]>>>;
}

const newNote = (text: string, attachments?: string[]) => ({
  id: crypto.randomUUID(),
  text,
  at: Date.now(),
  attachments,
});

/** Stable actions: a new message must not re-render every row of the list. */
function createActions({ setChats, setNotes }: Setters) {
  const replyCounts = new Map<string, number>();

  const patch = (id: string, change: Partial<Chat>) =>
    setChats((list) => list.map((chat) => (chat.id === id ? { ...chat, ...change } : chat)));

  const addNote = (chatId: string, note: Note) =>
    setNotes((notes) => ({ ...notes, [chatId]: [...(notes[chatId] ?? []), note] }));

  const setDelivery = (chatId: string, noteId: string, delivery: Delivery) =>
    setNotes((notes) => ({
      ...notes,
      [chatId]: (notes[chatId] ?? []).map((note) =>
        note.id === noteId && note.mine ? { ...note, delivery } : note,
      ),
    }));

  function moveTo(id: string, place: Place, message: string, from: Place) {
    patch(id, { place });
    const toastId = toast(message, {
      actionProps: {
        children: "Отменить",
        onPress: () => {
          patch(id, { place: from });
          toast.close(toastId);
        },
      },
    });
  }

  function scheduleReply(chatId: string, pace: number) {
    const contact = contactById(chatId);
    const count = replyCounts.get(chatId) ?? 0;
    const text = contact?.replies[count % (contact.replies.length || 1)];
    if (!text) {
      return;
    }
    replyCounts.set(chatId, count + 1);
    setTimeout(() => patch(chatId, { isTyping: true }), TYPING_DELAY_MS * pace);
    setTimeout(
      () => {
        addNote(chatId, { ...newNote(text), mine: false });
        setChats((list) =>
          list.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  isTyping: false,
                  unread: chat.unread + 1,
                }
              : chat,
          ),
        );
      },
      TYPING_DELAY_MS * pace + TYPING_MS,
    );
  }

  function post(chatId: string, text: string, attachments?: string[]) {
    const note = { ...newNote(text, attachments), mine: true as const };
    const pace = contactById(chatId)?.isOnline ? 1 : OFFLINE_PACE;

    addNote(chatId, { ...note, delivery: "sending" });
    setTimeout(() => setDelivery(chatId, note.id, "sent"), SENT_MS);
    setTimeout(() => setDelivery(chatId, note.id, "delivered"), DELIVERED_MS * pace);
    setTimeout(() => setDelivery(chatId, note.id, "read"), READ_MS * pace);
    scheduleReply(chatId, pace);
  }

  return {
    markRead: (id: string) =>
      setChats((list) =>
        list.some((chat) => chat.id === id && chat.unread > 0)
          ? list.map((chat) => (chat.id === id ? { ...chat, unread: 0 } : chat))
          : list,
      ),
    markUnread: (id: string) => patch(id, { unread: 1 }),
    setDraft: (id: string, draft: string) => patch(id, { draft }),
    setComment: (id: string, comment: string) => patch(id, { comment }),
    setLabel: (id: string, label: LabelId) => patch(id, { label }),
    toggleStar: (chat: Chat) => patch(chat.id, { isStarred: !chat.isStarred }),
    archive: (chat: Chat) => moveTo(chat.id, "archive", "Чат в архиве", chat.place),
    restore: (chat: Chat) => moveTo(chat.id, "inbox", "Чат возвращён", chat.place),
    trash: (chat: Chat) => moveTo(chat.id, "trash", "Чат в корзине", chat.place),

    removeForever: (id: string) => {
      setChats((list) => list.filter((chat) => chat.id !== id));
      setNotes(({ [id]: _removed, ...rest }) => rest);
      toast("Чат удалён");
    },

    send: (chatId: string, text: string, attachments: string[]) => {
      post(chatId, text, attachments.length > 0 ? attachments : undefined);
      patch(chatId, { place: "inbox", draft: "" });
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
      post(contactId, text);
    },
  };
}

export function useMessenger() {
  const [chats, setChats] = useState(initialChats);
  const [notes, setNotes] = useState(initialNotes);
  const [actions] = useState(() => createActions({ setChats, setNotes }));

  return { chats, notes, ...actions };
}

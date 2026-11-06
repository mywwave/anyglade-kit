import { toast } from "@anyglade/kit";
import { useEffect, useState } from "react";
import { simulateRequest } from "../simulate.ts";
import {
  guest,
  incoming,
  ME,
  microphones,
  newSpaceIcon,
  replies,
  seedChannels,
  seedMembers,
  seedNotes,
  seedSpaces,
  speakers,
  type Channel,
  type Member,
  type Note,
  type Space,
  type VoiceChannel,
} from "./data.ts";

export type Call =
  | { status: "idle" }
  | { status: "connecting"; channelId: string }
  | { status: "live"; channelId: string; startedAt: number };

export interface SelfState {
  isMuted: boolean;
  /** Sound off for me: I hear nobody, and nobody hears me either. */
  isDeafened: boolean;
  hasHand: boolean;
  microphone: string;
  speaker: string;
}

const SPEAKER_MS = 2600;
const ROSTER_MS = 11000;
const INCOMING_MS = 15000;
const CONNECT_MS = 700;
const TYPING_DELAY_MS = 900;
const TYPING_MS = 1600;
const DEFAULT_VOLUME = 100;

const patchMember = (list: Member[], personId: string, change: Partial<Member>) =>
  list.map((member) => (member.personId === personId ? { ...member, ...change } : member));

/** What happens in a call by itself, one step every few seconds. */
const rosterSteps: ((list: Member[]) => Member[])[] = [
  (list) => {
    const quiet = list.find((member) => member.isMuted);
    return quiet ? patchMember(list, quiet.personId, { hasHand: true }) : list;
  },
  (list) => list.map((member) => ({ ...member, connection: "good" })),
  (list) =>
    list.some((member) => member.personId === guest.personId) ? list : [...list, { ...guest }],
  (list) => list.map((member) => ({ ...member, hasHand: false })),
  (list) => list.filter((member) => member.personId !== guest.personId),
];

const addNote = (notes: Record<string, Note[]>, channelId: string, note: Note) => ({
  ...notes,
  [channelId]: [...(notes[channelId] ?? []), note],
});

const newNote = (authorId: string, text: string, attachments?: string[]): Note => ({
  id: crypto.randomUUID(),
  authorId,
  text,
  at: Date.now(),
  attachments,
});

export function useMeet() {
  const [spaces, setSpaces] = useState<Space[]>(seedSpaces);
  const [channels, setChannels] = useState<Channel[]>(seedChannels);
  const [notes, setNotes] = useState(seedNotes);
  const [members, setMembers] = useState(seedMembers);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [volumes, setVolumes] = useState<Record<string, number>>({});
  const [typing, setTyping] = useState<Record<string, string>>({});
  const [requested, setRequested] = useState<string[]>([]);
  const [call, setCall] = useState<Call>({ status: "idle" });
  const [tick, setTick] = useState(0);
  const [self, setSelf] = useState<SelfState>({
    isMuted: false,
    isDeafened: false,
    hasHand: false,
    microphone: microphones[0] ?? "",
    speaker: speakers[0] ?? "",
  });

  const liveId = call.status === "live" ? call.channelId : null;

  useEffect(() => {
    if (!liveId) {
      return;
    }
    const speaker = setInterval(() => setTick((value) => value + 1), SPEAKER_MS);
    let step = 0;
    const roster = setInterval(() => {
      const change = rosterSteps[step % rosterSteps.length];
      step += 1;
      if (change) {
        setMembers((all) => ({ ...all, [liveId]: change(all[liveId] ?? []) }));
      }
    }, ROSTER_MS);

    return () => {
      clearInterval(speaker);
      clearInterval(roster);
    };
  }, [liveId]);

  useEffect(() => {
    let step = 0;
    const timer = setInterval(() => {
      const message = incoming[step % incoming.length];
      step += 1;
      if (message) {
        receive(message.channelId, newNote(message.authorId, message.text));
      }
    }, INCOMING_MS);
    return () => clearInterval(timer);
  }, []);

  function receive(channelId: string, note: Note) {
    setNotes((all) => addNote(all, channelId, note));
    setChannels((list) =>
      list.map((channel) =>
        channel.id === channelId && channel.kind === "text"
          ? { ...channel, unread: channel.unread + 1 }
          : channel,
      ),
    );
  }

  function markRead(channelId: string) {
    setChannels((list) =>
      list.some((item) => item.id === channelId && item.kind === "text" && item.unread > 0)
        ? list.map((item) =>
            item.id === channelId && item.kind === "text" ? { ...item, unread: 0 } : item,
          )
        : list,
    );
  }

  function send(channelId: string, text: string, attachments: string[]) {
    setNotes((all) => addNote(all, channelId, newNote(ME, text, attachments)));
    setDrafts((all) => ({ ...all, [channelId]: "" }));

    const reply = replies[(notes[channelId]?.length ?? 0) % replies.length];
    if (reply) {
      setTimeout(() => {
        setTyping((all) => ({ ...all, [channelId]: reply.authorId }));
      }, TYPING_DELAY_MS);
      setTimeout(() => {
        setTyping(({ [channelId]: _done, ...rest }) => rest);
        receive(channelId, newNote(reply.authorId, reply.text));
      }, TYPING_DELAY_MS + TYPING_MS);
    }
  }

  async function connect(channelId: string) {
    setCall({ status: "connecting", channelId });
    await simulateRequest(CONNECT_MS);
    setCall({ status: "live", channelId, startedAt: Date.now() });
    setSelf((state) => ({ ...state, hasHand: false }));
  }

  function disconnect() {
    setCall({ status: "idle" });
    setSelf((state) => ({ ...state, hasHand: false }));
  }

  function toggleMute() {
    setSelf((state) => ({
      ...state,
      isMuted: !state.isMuted,
      // Turning the microphone back on means the person wants to talk, so they must hear too.
      isDeafened: state.isMuted ? false : state.isDeafened,
    }));
  }

  function toggleDeafen() {
    setSelf((state) => ({
      ...state,
      isDeafened: !state.isDeafened,
      isMuted: state.isDeafened ? state.isMuted : true,
    }));
  }

  function patchSelf(change: Partial<SelfState>) {
    setSelf((state) => ({ ...state, ...change }));
  }

  function updateMember(channelId: string, personId: string, change: Partial<Member>) {
    setMembers((all) => ({
      ...all,
      [channelId]: patchMember(all[channelId] ?? [], personId, change),
    }));
  }

  function muteAll(channelId: string) {
    const before = members[channelId] ?? [];
    setMembers((all) => ({
      ...all,
      [channelId]: (all[channelId] ?? []).map((member) => ({ ...member, isMuted: true })),
    }));
    const toastId = toast("Микрофоны выключены у всех", {
      actionProps: {
        children: "Вернуть",
        onPress: () => {
          setMembers((all) => ({ ...all, [channelId]: before }));
          toast.close(toastId);
        },
      },
    });
  }

  function removeMember(channelId: string, personId: string) {
    setMembers((all) => ({
      ...all,
      [channelId]: (all[channelId] ?? []).filter((member) => member.personId !== personId),
    }));
  }

  function moveMember(fromId: string, toId: string, personId: string) {
    setMembers((all) => {
      const member = all[fromId]?.find((item) => item.personId === personId);
      return member
        ? {
            ...all,
            [fromId]: (all[fromId] ?? []).filter((item) => item !== member),
            [toId]: [...(all[toId] ?? []), member],
          }
        : all;
    });
  }

  function setVolume(personId: string, volume: number) {
    setVolumes((all) => ({ ...all, [personId]: volume }));
  }

  function requestAccess(channelId: string) {
    setRequested((list) => [...list, channelId]);
    toast("Запрос отправлен организатору");
  }

  function createSpace(name: string) {
    const id = crypto.randomUUID();
    const voice: VoiceChannel = {
      id: crypto.randomUUID(),
      spaceId: id,
      kind: "voice",
      name: "Созвон",
      organizerId: ME,
    };
    setSpaces((list) => [...list, { id, name, icon: newSpaceIcon }]);
    setChannels((list) => [
      ...list,
      { id: crypto.randomUUID(), spaceId: id, kind: "text", name: "общий", unread: 0 },
      voice,
    ]);
    return { spaceId: id, channelId: voice.id };
  }

  return {
    call,
    channels,
    connect,
    createSpace,
    disconnect,
    drafts,
    markRead,
    members,
    moveMember,
    muteAll,
    notes,
    patchSelf,
    removeMember,
    requestAccess,
    requested,
    self,
    send,
    setDraft: (channelId: string, text: string) =>
      setDrafts((all) => ({ ...all, [channelId]: text })),
    setVolume,
    spaces,
    tick,
    toggleDeafen,
    toggleMute,
    typing,
    updateMember,
    volumeOf: (personId: string) => volumes[personId] ?? DEFAULT_VOLUME,
  };
}

export type Meet = ReturnType<typeof useMeet>;

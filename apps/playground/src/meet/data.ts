import { Briefcase, CircleDollar, Headphones, Palette, Persons } from "@anyglade/kit/icons";
import type { ComponentType } from "react";

const portrait = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=640&h=480&fit=crop&crop=faces&q=70`;

export const ME = "me";

export interface Person {
  id: string;
  name: string;
  role: string;
  photo?: string;
}

export const people: Person[] = [
  { id: ME, name: "David Lee", role: "Head of sales" },
  {
    id: "maria",
    name: "Maria Cole",
    role: "Project manager",
    photo: portrait("1438761681033-6461ffad8d80"),
  },
  {
    id: "anna",
    name: "Anna Fisher",
    role: "Sales",
    photo: portrait("1494790108377-be9c29b29330"),
  },
  {
    id: "ilya",
    name: "Ethan Brooks",
    role: "Engineering",
    photo: portrait("1507003211169-0a1dd7228f2d"),
  },
  {
    id: "olga",
    name: "Olivia Bennett",
    role: "Accounting",
    photo: portrait("1544005313-94ddf0286df2"),
  },
  {
    id: "sergey",
    name: "Sam Nelson",
    role: "Support",
    photo: portrait("1472099645785-5658abf4ff4e"),
  },
  {
    id: "pavel",
    name: "Paul Harper",
    role: "Design",
    photo: portrait("1500648767791-00dcc994a43e"),
  },
  {
    id: "elena",
    name: "Ellen Parker",
    role: "Design",
    photo: portrait("1534528741775-53994a69daeb"),
  },
  {
    id: "timur",
    name: "Tom Archer",
    role: "Support",
    photo: portrait("1506794778202-cad84cf45f1d"),
  },
  { id: "vera", name: "Vera Kim", role: "Guest" },
];

const peopleById = new Map(people.map((person) => [person.id, person]));

export function personById(id: string) {
  const person = peopleById.get(id);
  if (!person) {
    throw new Error(`Unknown person: ${id}`);
  }
  return person;
}

export const firstName = (id: string) => personById(id).name.split(" ")[0] ?? "";

export interface Space {
  id: string;
  name: string;
  icon: ComponentType;
}

export const seedSpaces: Space[] = [
  { id: "sales", name: "Sales", icon: Briefcase },
  { id: "design", name: "Design", icon: Palette },
  { id: "support", name: "Support", icon: Headphones },
  { id: "finance", name: "Finance", icon: CircleDollar },
];

export const newSpaceIcon = Persons;

interface ChannelBase {
  id: string;
  spaceId: string;
  name: string;
}

export interface TextChannel extends ChannelBase {
  kind: "text";
  unread: number;
  /** Only organizers post here, as in a channel of announcements. */
  isReadOnly?: boolean;
}

export interface VoiceChannel extends ChannelBase {
  kind: "voice";
  organizerId: string;
  isLocked?: boolean;
}

export type Channel = TextChannel | VoiceChannel;

export const seedChannels: Channel[] = [
  { id: "general", spaceId: "sales", kind: "text", name: "general", unread: 3 },
  { id: "deals", spaceId: "sales", kind: "text", name: "deals", unread: 0 },
  {
    id: "news",
    spaceId: "sales",
    kind: "text",
    name: "announcements",
    unread: 0,
    isReadOnly: true,
  },
  { id: "standup", spaceId: "sales", kind: "voice", name: "Standup", organizerId: ME },
  { id: "client", spaceId: "sales", kind: "voice", name: "Client call", organizerId: ME },
  {
    id: "board",
    spaceId: "sales",
    kind: "voice",
    name: "Leadership",
    organizerId: "maria",
    isLocked: true,
  },
  { id: "review", spaceId: "design", kind: "text", name: "review", unread: 2 },
  { id: "refs", spaceId: "design", kind: "text", name: "references", unread: 0 },
  {
    id: "mockups",
    spaceId: "design",
    kind: "voice",
    name: "Mockup review",
    organizerId: "pavel",
  },
  { id: "tickets", spaceId: "support", kind: "text", name: "tickets", unread: 0 },
  { id: "duty", spaceId: "support", kind: "voice", name: "On call", organizerId: "timur" },
  { id: "invoices", spaceId: "finance", kind: "text", name: "invoices", unread: 0 },
  {
    id: "closing",
    spaceId: "finance",
    kind: "voice",
    name: "Month-end close",
    organizerId: "olga",
  },
];

export type Connection = "good" | "weak";

export interface Member {
  personId: string;
  isMuted: boolean;
  hasCamera: boolean;
  hasHand: boolean;
  isSharing: boolean;
  connection: Connection;
}

const member = (personId: string, change: Partial<Member> = {}): Member => ({
  personId,
  isMuted: false,
  hasCamera: true,
  hasHand: false,
  isSharing: false,
  connection: "good",
  ...change,
});

export const guest = member("vera", { isMuted: true, hasCamera: false });

export const seedMembers: Record<string, Member[]> = {
  standup: [
    member("maria"),
    member("anna"),
    member("ilya", { isMuted: true, connection: "weak" }),
    member("olga", { hasCamera: false }),
    member("sergey", { isMuted: true, hasCamera: false }),
  ],
  mockups: [member("pavel", { isSharing: true }), member("elena")],
  duty: [member("timur", { hasCamera: false })],
};

export interface Note {
  id: string;
  authorId: string;
  text: string;
  at: number;
  attachments?: string[];
}

const minutesAgo = (minutes: number) => Date.now() - minutes * 60000;

const note = (id: string, authorId: string, minutes: number, text: string): Note => ({
  id,
  authorId,
  text,
  at: minutesAgo(minutes),
});

export const seedNotes: Record<string, Note[]> = {
  general: [
    note("g1", "maria", 1540, "Team, starting Monday our calls move to 10 a.m."),
    note("g2", "anna", 1532, "Got it. That works better for our Denver clients too."),
    note("g3", ME, 95, "Who's running standup today?"),
    note("g4", "maria", 92, "I am. We start at noon, the agenda is pinned."),
    note("g5", "anna", 41, "The Vector Labs contract is out for signature."),
    note("g6", "ilya", 38, "I shipped the new request form, try it with your clients."),
    note("g7", "ilya", 37, "If something breaks, post here rather than in DMs."),
    note("g8", "olga", 12, "The October invoice is paid, we can close the deal."),
  ],
  deals: [
    note(
      "d1",
      "anna",
      620,
      "Campus School is asking for a three-month payment plan. Should we agree?",
    ),
    note("d2", ME, 610, "Yes, as long as the first payment is at least a third."),
  ],
  news: [
    note("n1", "maria", 2880, "Starting in November, reports are due Fridays by 6 p.m."),
    note("n2", "maria", 1440, "The office is closed from December 30 to January 8."),
  ],
  review: [
    note("r1", "pavel", 180, "Posted the second version of the deal card."),
    note("r2", "elena", 16, "The Pay button gets lost in the dark theme."),
    note("r3", "pavel", 14, "I see it. Let's discuss it at the review, I'll share my screen."),
  ],
  tickets: [note("t1", "timur", 300, "We closed 14 tickets overnight, the queue is empty.")],
  invoices: [note("i1", "olga", 1600, "The September statements are signed.")],
};

export const replies = [
  { authorId: "maria", text: "Sure, I'll add it to the agenda." },
  { authorId: "anna", text: "I'll look after the call and get back to you." },
  { authorId: "ilya", text: "Got it, I'm on it." },
];

export const incoming = [
  { channelId: "general", authorId: "anna", text: "The client confirmed the Thursday meeting." },
  { channelId: "review", authorId: "elena", text: "Updated the button contrast, take a look." },
  { channelId: "tickets", authorId: "timur", text: "New ticket from North Studio, I'll take it." },
  { channelId: "general", authorId: "maria", text: "Updated the agenda, there are two new items." },
];

export const microphones = ["Built-in microphone", "USB headset"];
export const speakers = ["Built-in speakers", "USB headset"];

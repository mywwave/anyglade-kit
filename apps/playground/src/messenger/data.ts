import type { Delivery } from "@anyglade/kit/ai";
import { Briefcase, HandOk, Heart, Persons } from "@anyglade/kit/icons";

const AVATARS = "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars";
const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export const labels = [
  { id: "work", label: "Work", icon: Briefcase, color: "text-label-blue" },
  { id: "team", label: "Team", icon: Persons, color: "text-label-violet" },
  { id: "clients", label: "Clients", icon: HandOk, color: "text-label-teal" },
  { id: "personal", label: "Personal", icon: Heart, color: "text-label-pink" },
] as const;

export type LabelId = (typeof labels)[number]["id"];
export type Place = "inbox" | "archive" | "trash";

export interface Contact {
  id: string;
  name: string;
  image?: string;
  role: string;
  email: string;
  phone: string;
  since: string;
  deals?: { count: number; total: number };
  isOnline: boolean;
  replies: string[];
}

interface NoteBase {
  id: string;
  text: string;
  at: number;
  attachments?: string[];
}

export type Note = NoteBase & ({ mine: false } | { mine: true; delivery: Delivery });

export interface Chat {
  id: string;
  contactId: string;
  label: LabelId;
  place: Place;
  isStarred: boolean;
  unread: number;
  isTyping: boolean;
  draft: string;
  comment: string;
}

export const contacts: Contact[] = [
  {
    id: "maria",
    name: "Maria Kim",
    image: `${AVATARS}/purple.jpg`,
    role: "Design",
    email: "m.kim@anyglade.com",
    phone: "+1 415 555 0182",
    since: "March 2023",
    isOnline: true,
    replies: [
      "Looking now, give me a couple of minutes",
      "Yes, that works better. Let's keep this one",
    ],
  },
  {
    id: "anna",
    name: "Anna Fisher",
    image: `${AVATARS}/blue.jpg`,
    role: "Sales, Vector Labs",
    email: "a.fisher@vectorlabs.com",
    phone: "+1 212 555 0147",
    since: "January 2024",
    deals: { count: 3, total: 15500 },
    isOnline: true,
    replies: ["Sure, I'll pass it on to the client", "The contract is out for signature"],
  },
  {
    id: "ilya",
    name: "Ethan Brooks",
    image: `${AVATARS}/green.jpg`,
    role: "Engineering",
    email: "e.brooks@anyglade.com",
    phone: "+1 646 555 0123",
    since: "August 2022",
    isOnline: false,
    replies: ["I'll take a look tomorrow and get back to you"],
  },
  {
    id: "olga",
    name: "Olivia Bennett",
    image: `${AVATARS}/orange.jpg`,
    role: "Accounting",
    email: "o.bennett@anyglade.com",
    phone: "+1 312 555 0164",
    since: "May 2021",
    isOnline: true,
    replies: ["Got the invoice, we'll pay it today"],
  },
  {
    id: "pavel",
    name: "Paul Harper",
    image: `${AVATARS}/red.jpg`,
    role: "North Studio",
    email: "paul@north.studio",
    phone: "+1 503 555 0191",
    since: "October 2024",
    deals: { count: 1, total: 4750 },
    isOnline: false,
    replies: ["Thanks, it's a deal"],
  },
  {
    id: "elena",
    name: "Ellen Parker",
    role: "Campus School",
    email: "e.parker@campus.school",
    phone: "+1 617 555 0138",
    since: "February 2025",
    deals: { count: 2, total: 6400 },
    isOnline: false,
    replies: ["I'll get back to you this week"],
  },
  {
    id: "roman",
    name: "Ryan Turner",
    role: "Meridian Logistics",
    email: "turner@meridian-logistics.com",
    phone: "+1 206 555 0175",
    since: "June 2024",
    deals: { count: 1, total: 1200 },
    isOnline: true,
    replies: ["Noted"],
  },
  {
    id: "vera",
    name: "Vera Collins",
    role: "Support",
    email: "v.collins@anyglade.com",
    phone: "+1 737 555 0156",
    since: "April 2025",
    isOnline: true,
    replies: ["Let me check"],
  },
];

export const contactById = (id: string) => contacts.find((contact) => contact.id === id);

const chat = (contactId: string, label: LabelId, extra: Partial<Chat> = {}): Chat => ({
  id: contactId,
  contactId,
  label,
  place: "inbox",
  isStarred: false,
  unread: 0,
  isTyping: false,
  draft: "",
  comment: "",
  ...extra,
});

export const initialChats: Chat[] = [
  chat("maria", "team", { unread: 2, isStarred: true }),
  chat("anna", "clients", { unread: 1, comment: "Wants a discount for an annual contract" }),
  chat("ilya", "work", { isStarred: true }),
  chat("olga", "work"),
  chat("pavel", "clients", { unread: 1 }),
  chat("elena", "clients", { place: "archive" }),
  chat("roman", "work", { place: "trash" }),
];

const theirs = (id: string, text: string, ago: number, attachments?: string[]): Note => ({
  id,
  mine: false,
  text,
  at: Date.now() - ago,
  attachments,
});

const ours = (
  id: string,
  delivery: Delivery,
  text: string,
  ago: number,
  attachments?: string[],
): Note => ({
  id,
  mine: true,
  delivery,
  text,
  at: Date.now() - ago,
  attachments,
});

export const initialNotes: Record<string, Note[]> = {
  maria: [
    theirs("m1", "Looked at the checkout screen. The button gets lost on mobile", DAY + 3 * HOUR),
    ours("m2", "read", "Agreed, I'll move it above the total", DAY + 2 * HOUR),
    ours("m3", "read", "And remove the duplicate amount", DAY + 2 * HOUR - MINUTE),
    theirs("m4", "Great. I put together a new version, take a look", 12 * MINUTE, [
      "checkout-v3.fig",
    ]),
    theirs("m5", "If it looks good, I'll hand it to engineering today", 11 * MINUTE),
  ],
  anna: [
    ours("a1", "read", "How did the meeting with Vector Labs go?", 5 * HOUR),
    theirs("a2", "Well. They want 10% off for an annual contract", 4 * HOUR),
    theirs("a3", "Can we sign off on it today?", 40 * MINUTE),
  ],
  ilya: [
    theirs("i1", "Fixed the export, ready for testing", 3 * DAY),
    ours("i2", "read", "Checked it, everything works. Thanks", 3 * DAY - HOUR),
    theirs("i3", "Shipping it on Friday", 2 * DAY),
    ours("i4", "sent", "Sounds good, I'll let the clients know", 2 * DAY - HOUR),
  ],
  olga: [
    theirs("o1", "I need the October statement from Brightline", 6 * DAY),
    ours("o2", "read", "Sent it to your email", 6 * DAY - 2 * HOUR, ["statement-october.pdf"]),
    theirs("o3", "Got it, thanks", 5 * DAY),
    ours("o4", "delivered", "I'll send the November statement early next month", 5 * DAY - HOUR),
  ],
  pavel: [theirs("p1", "Can we move the call to Thursday?", 3 * HOUR)],
  elena: [theirs("e1", "Thanks for the demo, we'll discuss it internally", 14 * DAY)],
  roman: [theirs("r1", "Your shipment is on its way", 20 * DAY)],
};

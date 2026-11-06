import { Briefcase, CircleRuble, Headphones, Palette, Persons } from "@anyglade/kit/icons";
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
  { id: ME, name: "Дмитрий Лебедев", role: "Руководитель продаж" },
  {
    id: "maria",
    name: "Мария Котова",
    role: "Менеджер проектов",
    photo: portrait("1438761681033-6461ffad8d80"),
  },
  {
    id: "anna",
    name: "Анна Смирнова",
    role: "Отдел продаж",
    photo: portrait("1494790108377-be9c29b29330"),
  },
  {
    id: "ilya",
    name: "Илья Воронов",
    role: "Разработка",
    photo: portrait("1507003211169-0a1dd7228f2d"),
  },
  {
    id: "olga",
    name: "Ольга Белова",
    role: "Бухгалтерия",
    photo: portrait("1544005313-94ddf0286df2"),
  },
  {
    id: "sergey",
    name: "Сергей Нестеров",
    role: "Поддержка",
    photo: portrait("1472099645785-5658abf4ff4e"),
  },
  {
    id: "pavel",
    name: "Павел Орлов",
    role: "Дизайн",
    photo: portrait("1500648767791-00dcc994a43e"),
  },
  {
    id: "elena",
    name: "Елена Жукова",
    role: "Дизайн",
    photo: portrait("1534528741775-53994a69daeb"),
  },
  {
    id: "timur",
    name: "Тимур Ахметов",
    role: "Поддержка",
    photo: portrait("1506794778202-cad84cf45f1d"),
  },
  { id: "vera", name: "Вера Ким", role: "Гость" },
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
  { id: "sales", name: "Продажи", icon: Briefcase },
  { id: "design", name: "Дизайн", icon: Palette },
  { id: "support", name: "Поддержка", icon: Headphones },
  { id: "finance", name: "Финансы", icon: CircleRuble },
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
  { id: "general", spaceId: "sales", kind: "text", name: "общий", unread: 3 },
  { id: "deals", spaceId: "sales", kind: "text", name: "сделки", unread: 0 },
  {
    id: "news",
    spaceId: "sales",
    kind: "text",
    name: "объявления",
    unread: 0,
    isReadOnly: true,
  },
  { id: "standup", spaceId: "sales", kind: "voice", name: "Планёрка", organizerId: ME },
  { id: "client", spaceId: "sales", kind: "voice", name: "Созвон с клиентом", organizerId: ME },
  {
    id: "board",
    spaceId: "sales",
    kind: "voice",
    name: "Руководство",
    organizerId: "maria",
    isLocked: true,
  },
  { id: "review", spaceId: "design", kind: "text", name: "ревью", unread: 2 },
  { id: "refs", spaceId: "design", kind: "text", name: "референсы", unread: 0 },
  {
    id: "mockups",
    spaceId: "design",
    kind: "voice",
    name: "Ревью макетов",
    organizerId: "pavel",
  },
  { id: "tickets", spaceId: "support", kind: "text", name: "обращения", unread: 0 },
  { id: "duty", spaceId: "support", kind: "voice", name: "Дежурные", organizerId: "timur" },
  { id: "invoices", spaceId: "finance", kind: "text", name: "счета", unread: 0 },
  {
    id: "closing",
    spaceId: "finance",
    kind: "voice",
    name: "Закрытие месяца",
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
    note("g1", "maria", 1540, "Коллеги, с понедельника созвоны переносим на десять утра."),
    note("g2", "anna", 1532, "Принято. Клиентам из Екатеринбурга тоже удобнее."),
    note("g3", ME, 95, "Кто сегодня ведёт планёрку?"),
    note("g4", "maria", 92, "Я веду. Начнём в полдень, повестка в закреплённом."),
    note("g5", "anna", 41, "Договор с «Вектором» ушёл на подпись."),
    note("g6", "ilya", 38, "Выкатил новую форму заявки, проверьте на своих клиентах."),
    note("g7", "ilya", 37, "Если что-то сломалось, пишите сюда, а не в личку."),
    note("g8", "olga", 12, "Счёт за октябрь оплачен, можно закрывать сделку."),
  ],
  deals: [
    note("d1", "anna", 620, "«Кампус» просит рассрочку на три месяца. Берём?"),
    note("d2", ME, 610, "Берём, если первый платёж не меньше трети."),
  ],
  news: [
    note("n1", "maria", 2880, "С ноября отчёты сдаём по пятницам до шести вечера."),
    note("n2", "maria", 1440, "В декабре офис закрыт с 30-го по 8 января."),
  ],
  review: [
    note("r1", "pavel", 180, "Выложил второй вариант карточки сделки."),
    note("r2", "elena", 16, "Кнопка «Оплатить» теряется на тёмной теме."),
    note("r3", "pavel", 14, "Вижу. Обсудим на ревью, я покажу экран."),
  ],
  tickets: [note("t1", "timur", 300, "За ночь закрыли 14 обращений, очередь пуста.")],
  invoices: [note("i1", "olga", 1600, "Акты за сентябрь подписаны.")],
};

export const replies = [
  { authorId: "maria", text: "Хорошо, добавлю в повестку." },
  { authorId: "anna", text: "Посмотрю после звонка и отпишусь." },
  { authorId: "ilya", text: "Понял, беру в работу." },
];

export const incoming = [
  { channelId: "general", authorId: "anna", text: "Клиент подтвердил встречу на четверг." },
  { channelId: "review", authorId: "elena", text: "Обновила контраст кнопки, гляньте." },
  { channelId: "tickets", authorId: "timur", text: "Новое обращение от «Севера», беру себе." },
  { channelId: "general", authorId: "maria", text: "Повестку обновила, там два новых пункта." },
];

export const microphones = ["Встроенный микрофон", "Гарнитура USB"];
export const speakers = ["Встроенные динамики", "Гарнитура USB"];

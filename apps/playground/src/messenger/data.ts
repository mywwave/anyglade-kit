const AVATARS = "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars";
const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export const labels = [
  { id: "work", label: "Работа" },
  { id: "team", label: "Команда" },
  { id: "clients", label: "Клиенты" },
  { id: "personal", label: "Личное" },
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

export interface Note {
  id: string;
  mine: boolean;
  text: string;
  at: number;
  attachments?: string[];
}

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
    name: "Мария Ким",
    image: `${AVATARS}/purple.jpg`,
    role: "Дизайн",
    email: "m.kim@anyglade.ru",
    phone: "+7 916 204-18-33",
    since: "марта 2023",
    isOnline: true,
    replies: ["Смотрю, пара минут", "Да, так лучше. Оставляем этот вариант"],
  },
  {
    id: "anna",
    name: "Анна Смирнова",
    image: `${AVATARS}/blue.jpg`,
    role: "Отдел продаж, «Вектор»",
    email: "a.smirnova@vector.ru",
    phone: "+7 903 571-62-09",
    since: "января 2024",
    deals: { count: 3, total: 1240000 },
    isOnline: true,
    replies: ["Хорошо, передам клиенту", "Договор ушёл на подпись"],
  },
  {
    id: "ilya",
    name: "Илья Воронов",
    image: `${AVATARS}/green.jpg`,
    role: "Разработка",
    email: "i.voronov@anyglade.ru",
    phone: "+7 925 330-47-16",
    since: "августа 2022",
    isOnline: false,
    replies: ["Завтра посмотрю и отпишусь"],
  },
  {
    id: "olga",
    name: "Ольга Белова",
    image: `${AVATARS}/orange.jpg`,
    role: "Бухгалтерия",
    email: "o.belova@anyglade.ru",
    phone: "+7 926 118-90-54",
    since: "мая 2021",
    isOnline: true,
    replies: ["Счёт получила, оплатим сегодня"],
  },
  {
    id: "pavel",
    name: "Павел Орлов",
    image: `${AVATARS}/red.jpg`,
    role: "Студия «Север»",
    email: "pavel@sever.studio",
    phone: "+7 911 742-05-81",
    since: "октября 2024",
    deals: { count: 1, total: 380000 },
    isOnline: false,
    replies: ["Спасибо, договорились"],
  },
  {
    id: "elena",
    name: "Елена Жукова",
    role: "Школа «Кампус»",
    email: "e.zhukova@kampus.school",
    phone: "+7 985 266-13-47",
    since: "февраля 2025",
    deals: { count: 2, total: 515000 },
    isOnline: false,
    replies: ["Вернусь с ответом на этой неделе"],
  },
  {
    id: "roman",
    name: "Роман Титов",
    role: "Логистика «Трасса»",
    email: "titov@trassa.ru",
    phone: "+7 917 605-29-70",
    since: "июня 2024",
    deals: { count: 1, total: 96000 },
    isOnline: true,
    replies: ["Принято"],
  },
  {
    id: "vera",
    name: "Вера Соколова",
    role: "Поддержка",
    email: "v.sokolova@anyglade.ru",
    phone: "+7 903 448-71-22",
    since: "апреля 2025",
    isOnline: true,
    replies: ["Сейчас проверю"],
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
  chat("anna", "clients", { unread: 1, comment: "Просит скидку за годовой договор" }),
  chat("ilya", "work", { isStarred: true }),
  chat("olga", "work"),
  chat("pavel", "clients", { unread: 1 }),
  chat("elena", "clients", { place: "archive" }),
  chat("roman", "work", { place: "trash" }),
];

const note = (
  id: string,
  mine: boolean,
  text: string,
  ago: number,
  attachments?: string[],
): Note => ({
  id,
  mine,
  text,
  at: Date.now() - ago,
  attachments,
});

export const initialNotes: Record<string, Note[]> = {
  maria: [
    note("m1", false, "Посмотрела экран оплаты. Кнопка теряется на мобильном", DAY + 3 * HOUR),
    note("m2", true, "Согласен, подниму её над итогом", DAY + 2 * HOUR),
    note("m3", true, "И уберу дублирующую сумму", DAY + 2 * HOUR - MINUTE),
    note("m4", false, "Отлично. Собрала новый вариант, посмотри", 12 * MINUTE, ["oplata-v3.fig"]),
    note("m5", false, "Если ок, сегодня отдаю в разработку", 11 * MINUTE),
  ],
  anna: [
    note("a1", true, "Как прошла встреча с «Вектором»?", 5 * HOUR),
    note("a2", false, "Хорошо. Просят скидку 10 % за годовой договор", 4 * HOUR),
    note("a3", false, "Можем согласовать сегодня?", 40 * MINUTE),
  ],
  ilya: [
    note("i1", false, "Починил экспорт, можно проверять", 3 * DAY),
    note("i2", true, "Проверил, всё работает. Спасибо!", 3 * DAY - HOUR),
    note("i3", false, "Выкатываю в пятницу", 2 * DAY),
  ],
  olga: [
    note("o1", false, "Нужен акт за октябрь от «Лента»", 6 * DAY),
    note("o2", true, "Отправил на почту", 6 * DAY - 2 * HOUR, ["akt-oktyabr.pdf"]),
    note("o3", false, "Получила, спасибо", 5 * DAY),
  ],
  pavel: [note("p1", false, "Можем перенести созвон на четверг?", 3 * HOUR)],
  elena: [note("e1", false, "Спасибо за демонстрацию, обсудим внутри", 14 * DAY)],
  roman: [note("r1", false, "Ваш груз отправлен", 20 * DAY)],
};

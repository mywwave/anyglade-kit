export const AVATARS = "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars";

export const stages = [
  { id: "new", label: "Новые" },
  { id: "qualified", label: "Квалификация" },
  { id: "proposal", label: "Предложение" },
  { id: "negotiation", label: "Переговоры" },
  { id: "won", label: "Успешно" },
] as const;

export type StageId = (typeof stages)[number]["id"];

export interface Deal {
  id: string;
  title: string;
  company: string;
  owner: string;
  amount: number;
  stage: StageId;
  daysInStage: number;
}

export const STALLED_AFTER_DAYS = 7;

export const initialDeals: Deal[] = [
  {
    id: "D-218",
    title: "Внедрение на 40 мест",
    company: "ООО «Вектор»",
    owner: "Анна",
    amount: 840000,
    stage: "negotiation",
    daysInStage: 9,
  },
  {
    id: "D-217",
    title: "Продление на год",
    company: "Студия «Север»",
    owner: "Илья",
    amount: 186000,
    stage: "won",
    daysInStage: 1,
  },
  {
    id: "D-216",
    title: "Пилот для отдела продаж",
    company: "ИП Лебедев",
    owner: "Мария",
    amount: 96000,
    stage: "proposal",
    daysInStage: 3,
  },
  {
    id: "D-215",
    title: "Интеграция с телефонией",
    company: "ООО «Лента»",
    owner: "Анна",
    amount: 412000,
    stage: "proposal",
    daysInStage: 11,
  },
  {
    id: "D-214",
    title: "Переход с таблиц",
    company: "Клиника «Дар»",
    owner: "Павел",
    amount: 228000,
    stage: "qualified",
    daysInStage: 2,
  },
  {
    id: "D-213",
    title: "Расширение на филиалы",
    company: "ГК «Опора»",
    owner: "Мария",
    amount: 1260000,
    stage: "negotiation",
    daysInStage: 4,
  },
  {
    id: "D-212",
    title: "Демо для директора",
    company: "Агентство «Пульс»",
    owner: "Илья",
    amount: 74000,
    stage: "new",
    daysInStage: 1,
  },
  {
    id: "D-211",
    title: "Аудит воронки",
    company: "Школа «Кампус»",
    owner: "Павел",
    amount: 58000,
    stage: "new",
    daysInStage: 2,
  },
  {
    id: "D-210",
    title: "Подключение рассылок",
    company: "ООО «Мята»",
    owner: "Анна",
    amount: 132000,
    stage: "qualified",
    daysInStage: 8,
  },
  {
    id: "D-209",
    title: "Обучение менеджеров",
    company: "ГК «Опора»",
    owner: "Мария",
    amount: 148000,
    stage: "won",
    daysInStage: 3,
  },
  {
    id: "D-208",
    title: "Настройка отчётов",
    company: "Логистика «Трасса»",
    owner: "Илья",
    amount: 264000,
    stage: "qualified",
    daysInStage: 1,
  },
  {
    id: "D-207",
    title: "Годовая лицензия",
    company: "Клиника «Дар»",
    owner: "Павел",
    amount: 390000,
    stage: "won",
    daysInStage: 5,
  },
];

export type CustomerStatus = "active" | "trial" | "churned";

export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  owner: string;
  revenue: number;
  lastContact: string;
  status: CustomerStatus;
}

export const customers: Customer[] = [
  {
    id: "C-01",
    name: "Анна Смирнова",
    company: "ООО «Вектор»",
    email: "anna@vektor.example",
    owner: "Анна",
    revenue: 1840000,
    lastContact: "Сегодня",
    status: "active",
  },
  {
    id: "C-02",
    name: "Игорь Левин",
    company: "ГК «Опора»",
    email: "levin@opora.example",
    owner: "Мария",
    revenue: 3120000,
    lastContact: "Вчера",
    status: "active",
  },
  {
    id: "C-03",
    name: "Ольга Белова",
    company: "Клиника «Дар»",
    email: "belova@dar.example",
    owner: "Павел",
    revenue: 618000,
    lastContact: "3 нояб.",
    status: "active",
  },
  {
    id: "C-04",
    name: "Денис Соколов",
    company: "ООО «Лента»",
    email: "sokolov@lenta.example",
    owner: "Анна",
    revenue: 412000,
    lastContact: "28 окт.",
    status: "trial",
  },
  {
    id: "C-05",
    name: "Мария Ким",
    company: "Студия «Север»",
    email: "kim@sever.example",
    owner: "Илья",
    revenue: 186000,
    lastContact: "Вчера",
    status: "active",
  },
  {
    id: "C-06",
    name: "Павел Орлов",
    company: "ИП Лебедев",
    email: "orlov@lebedev.example",
    owner: "Мария",
    revenue: 96000,
    lastContact: "2 нояб.",
    status: "trial",
  },
  {
    id: "C-07",
    name: "Елена Жукова",
    company: "Школа «Кампус»",
    email: "zhukova@campus.example",
    owner: "Павел",
    revenue: 58000,
    lastContact: "15 окт.",
    status: "churned",
  },
  {
    id: "C-08",
    name: "Роман Титов",
    company: "Логистика «Трасса»",
    email: "titov@trassa.example",
    owner: "Илья",
    revenue: 1264000,
    lastContact: "4 нояб.",
    status: "active",
  },
  {
    id: "C-09",
    name: "Вера Нестерова",
    company: "ООО «Мята»",
    email: "vera@myata.example",
    owner: "Анна",
    revenue: 132000,
    lastContact: "30 окт.",
    status: "trial",
  },
];

export type TaskGroup = "today" | "tomorrow" | "later";

export interface Task {
  id: string;
  title: string;
  company: string;
  group: TaskGroup;
  isDone: boolean;
}

export const initialTasks: Task[] = [
  {
    id: "T-1",
    title: "Позвонить по продлению",
    company: "ООО «Вектор»",
    group: "today",
    isDone: false,
  },
  {
    id: "T-2",
    title: "Отправить коммерческое предложение",
    company: "ООО «Лента»",
    group: "today",
    isDone: false,
  },
  {
    id: "T-3",
    title: "Согласовать договор с юристом",
    company: "ГК «Опора»",
    group: "today",
    isDone: true,
  },
  {
    id: "T-4",
    title: "Провести демо",
    company: "Агентство «Пульс»",
    group: "tomorrow",
    isDone: false,
  },
  {
    id: "T-5",
    title: "Подготовить отчёт для директора",
    company: "Клиника «Дар»",
    group: "tomorrow",
    isDone: false,
  },
  {
    id: "T-6",
    title: "Вернуться к клиенту после отпуска",
    company: "Школа «Кампус»",
    group: "later",
    isDone: false,
  },
];

export const revenueByMonth = [
  { month: "Дек", revenue: 2100000, plan: 2000000 },
  { month: "Янв", revenue: 1760000, plan: 2000000 },
  { month: "Фев", revenue: 2240000, plan: 2200000 },
  { month: "Мар", revenue: 2510000, plan: 2400000 },
  { month: "Апр", revenue: 2380000, plan: 2500000 },
  { month: "Май", revenue: 2720000, plan: 2600000 },
  { month: "Июн", revenue: 2960000, plan: 2800000 },
  { month: "Июл", revenue: 2840000, plan: 3000000 },
  { month: "Авг", revenue: 3180000, plan: 3100000 },
  { month: "Сен", revenue: 3420000, plan: 3300000 },
  { month: "Окт", revenue: 3710000, plan: 3500000 },
  { month: "Ноя", revenue: 3960000, plan: 3700000 },
];

export const dealsByMonth = [
  { month: "Июн", won: 18, lost: 7 },
  { month: "Июл", won: 16, lost: 9 },
  { month: "Авг", won: 21, lost: 8 },
  { month: "Сен", won: 24, lost: 6 },
  { month: "Окт", won: 27, lost: 7 },
  { month: "Ноя", won: 29, lost: 5 },
];

export const sources = [
  { label: "Сайт", value: 48 },
  { label: "Рекомендации", value: 32 },
  { label: "Реклама", value: 20 },
] as const;

export const managers = [
  { name: "Мария", image: `${AVATARS}/purple.jpg`, won: 1408000, deals: 9, conversion: 34 },
  { name: "Анна", image: `${AVATARS}/blue.jpg`, won: 1184000, deals: 11, conversion: 29 },
  { name: "Илья", image: `${AVATARS}/green.jpg`, won: 524000, deals: 6, conversion: 24 },
  { name: "Павел", image: `${AVATARS}/orange.jpg`, won: 448000, deals: 7, conversion: 21 },
];

export const pipelineByWeek = [
  { week: "1 нед", incoming: 42, qualified: 21 },
  { week: "2 нед", incoming: 38, qualified: 24 },
  { week: "3 нед", incoming: 51, qualified: 27 },
  { week: "4 нед", incoming: 47, qualified: 31 },
  { week: "5 нед", incoming: 58, qualified: 33 },
  { week: "6 нед", incoming: 63, qualified: 38 },
];

export const trends = {
  revenue: [212, 228, 219, 246, 261, 254, 280, 296, 312, 330, 351, 398],
  deals: [12, 14, 13, 15, 18, 16, 21, 24, 23, 27, 26, 29],
  conversion: [22, 23, 23, 24, 25, 24, 26, 27, 27, 28, 29, 31],
  cycle: [34, 33, 33, 32, 31, 31, 30, 29, 29, 28, 27, 26],
};

export const activityByWeekday = [
  [3, 5, 2, 4, 6, 1, 0],
  [4, 6, 5, 3, 5, 2, 0],
  [2, 4, 6, 6, 4, 1, 1],
  [5, 3, 4, 6, 6, 2, 0],
  [6, 5, 6, 4, 5, 1, 0],
  [4, 6, 3, 5, 6, 2, 1],
];

export const weekdays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

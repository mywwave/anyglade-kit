export const AVATARS = "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars";

export const stages = [
  { id: "new", label: "New" },
  { id: "qualified", label: "Qualified" },
  { id: "proposal", label: "Proposal" },
  { id: "negotiation", label: "Negotiation" },
  { id: "won", label: "Won" },
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
    title: "Rollout for 40 seats",
    company: "Vector Labs",
    owner: "Anna",
    amount: 8400,
    stage: "negotiation",
    daysInStage: 9,
  },
  {
    id: "D-217",
    title: "One-year renewal",
    company: "North Studio",
    owner: "Ethan",
    amount: 1860,
    stage: "won",
    daysInStage: 1,
  },
  {
    id: "D-216",
    title: "Sales team pilot",
    company: "Hayes Consulting",
    owner: "Maria",
    amount: 960,
    stage: "proposal",
    daysInStage: 3,
  },
  {
    id: "D-215",
    title: "Phone system integration",
    company: "Ribbon Retail",
    owner: "Anna",
    amount: 4120,
    stage: "proposal",
    daysInStage: 11,
  },
  {
    id: "D-214",
    title: "Move off spreadsheets",
    company: "Cedar Clinic",
    owner: "Paul",
    amount: 2280,
    stage: "qualified",
    daysInStage: 2,
  },
  {
    id: "D-213",
    title: "Expansion to branch offices",
    company: "Pillar Group",
    owner: "Maria",
    amount: 12600,
    stage: "negotiation",
    daysInStage: 4,
  },
  {
    id: "D-212",
    title: "Demo for the CEO",
    company: "Pulse Agency",
    owner: "Ethan",
    amount: 740,
    stage: "new",
    daysInStage: 1,
  },
  {
    id: "D-211",
    title: "Funnel audit",
    company: "Campus Academy",
    owner: "Paul",
    amount: 580,
    stage: "new",
    daysInStage: 2,
  },
  {
    id: "D-210",
    title: "Email campaigns setup",
    company: "Mint & Co",
    owner: "Anna",
    amount: 1320,
    stage: "qualified",
    daysInStage: 8,
  },
  {
    id: "D-209",
    title: "Sales team training",
    company: "Pillar Group",
    owner: "Maria",
    amount: 1480,
    stage: "won",
    daysInStage: 3,
  },
  {
    id: "D-208",
    title: "Reporting setup",
    company: "Route Logistics",
    owner: "Ethan",
    amount: 2640,
    stage: "qualified",
    daysInStage: 1,
  },
  {
    id: "D-207",
    title: "Annual license",
    company: "Cedar Clinic",
    owner: "Paul",
    amount: 3900,
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
  contactDaysAgo: number;
  status: CustomerStatus;
}

export const customers: Customer[] = [
  {
    id: "C-01",
    name: "Emily Carter",
    company: "Vector Labs",
    email: "emily@vectorlabs.example",
    owner: "Anna",
    revenue: 18400,
    lastContact: "Today",
    contactDaysAgo: 0,
    status: "active",
  },
  {
    id: "C-02",
    name: "Ian Lewis",
    company: "Pillar Group",
    email: "lewis@pillar.example",
    owner: "Maria",
    revenue: 31200,
    lastContact: "Yesterday",
    contactDaysAgo: 1,
    status: "active",
  },
  {
    id: "C-03",
    name: "Olivia Bell",
    company: "Cedar Clinic",
    email: "bell@cedarclinic.example",
    owner: "Paul",
    revenue: 6180,
    lastContact: "Nov 3",
    contactDaysAgo: 2,
    status: "active",
  },
  {
    id: "C-04",
    name: "Daniel Brooks",
    company: "Ribbon Retail",
    email: "brooks@ribbon.example",
    owner: "Anna",
    revenue: 4120,
    lastContact: "Oct 28",
    contactDaysAgo: 8,
    status: "trial",
  },
  {
    id: "C-05",
    name: "Grace Kim",
    company: "North Studio",
    email: "kim@northstudio.example",
    owner: "Ethan",
    revenue: 1860,
    lastContact: "Yesterday",
    contactDaysAgo: 1,
    status: "active",
  },
  {
    id: "C-06",
    name: "Peter Hayes",
    company: "Hayes Consulting",
    email: "peter@hayes.example",
    owner: "Maria",
    revenue: 960,
    lastContact: "Nov 2",
    contactDaysAgo: 3,
    status: "trial",
  },
  {
    id: "C-07",
    name: "Ellen Hughes",
    company: "Campus Academy",
    email: "hughes@campus.example",
    owner: "Paul",
    revenue: 580,
    lastContact: "Oct 15",
    contactDaysAgo: 21,
    status: "churned",
  },
  {
    id: "C-08",
    name: "Ryan Turner",
    company: "Route Logistics",
    email: "turner@route.example",
    owner: "Ethan",
    revenue: 12640,
    lastContact: "Nov 4",
    contactDaysAgo: 1,
    status: "active",
  },
  {
    id: "C-09",
    name: "Vera Nash",
    company: "Mint & Co",
    email: "vera@mint.example",
    owner: "Anna",
    revenue: 1320,
    lastContact: "Oct 30",
    contactDaysAgo: 6,
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
    title: "Call about the renewal",
    company: "Vector Labs",
    group: "today",
    isDone: false,
  },
  {
    id: "T-2",
    title: "Send the proposal",
    company: "Ribbon Retail",
    group: "today",
    isDone: false,
  },
  {
    id: "T-3",
    title: "Review the contract with legal",
    company: "Pillar Group",
    group: "today",
    isDone: true,
  },
  {
    id: "T-4",
    title: "Run the demo",
    company: "Pulse Agency",
    group: "tomorrow",
    isDone: false,
  },
  {
    id: "T-5",
    title: "Prepare a report for the CEO",
    company: "Cedar Clinic",
    group: "tomorrow",
    isDone: false,
  },
  {
    id: "T-6",
    title: "Follow up after their vacation",
    company: "Campus Academy",
    group: "later",
    isDone: false,
  },
];

export const revenueByMonth = [
  { month: "Dec", revenue: 105000, plan: 100000 },
  { month: "Jan", revenue: 88000, plan: 100000 },
  { month: "Feb", revenue: 112000, plan: 110000 },
  { month: "Mar", revenue: 125500, plan: 120000 },
  { month: "Apr", revenue: 119000, plan: 125000 },
  { month: "May", revenue: 136000, plan: 130000 },
  { month: "Jun", revenue: 148000, plan: 140000 },
  { month: "Jul", revenue: 142000, plan: 150000 },
  { month: "Aug", revenue: 159000, plan: 155000 },
  { month: "Sep", revenue: 171000, plan: 165000 },
  { month: "Oct", revenue: 185500, plan: 175000 },
  { month: "Nov", revenue: 198000, plan: 185000 },
];

export const dealsByMonth = [
  { month: "Jun", won: 18, lost: 7 },
  { month: "Jul", won: 16, lost: 9 },
  { month: "Aug", won: 21, lost: 8 },
  { month: "Sep", won: 24, lost: 6 },
  { month: "Oct", won: 27, lost: 7 },
  { month: "Nov", won: 29, lost: 5 },
];

export const sources = [
  { label: "Website", value: 48 },
  { label: "Referrals", value: 32 },
  { label: "Ads", value: 20 },
] as const;

export const managers = [
  { name: "Maria", image: `${AVATARS}/purple.jpg`, won: 14080, deals: 9, conversion: 34 },
  { name: "Anna", image: `${AVATARS}/blue.jpg`, won: 11840, deals: 11, conversion: 29 },
  { name: "Ethan", image: `${AVATARS}/green.jpg`, won: 5240, deals: 6, conversion: 24 },
  { name: "Paul", image: `${AVATARS}/orange.jpg`, won: 4480, deals: 7, conversion: 21 },
];

export const pipelineByWeek = [
  { week: "Wk 1", incoming: 42, qualified: 21 },
  { week: "Wk 2", incoming: 38, qualified: 24 },
  { week: "Wk 3", incoming: 51, qualified: 27 },
  { week: "Wk 4", incoming: 47, qualified: 31 },
  { week: "Wk 5", incoming: 58, qualified: 33 },
  { week: "Wk 6", incoming: 63, qualified: 38 },
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

export const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

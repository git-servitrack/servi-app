export type KpiStat = {
  label: string;
  value: string;
  trend: string;
  highlight: boolean;
  href: string;
};

export type ActivityItem = {
  id: string;
  source: string;
  task: string;
  status: string;
  initials: string;
  color: string;
};

export type RecentRequestItem = {
  id: string;
  source: string;
  date: string;
  dot: string;
};

export const KPI_STATS: KpiStat[] = [
  {
    label: "Open Requests",
    value: "128",
    trend: "+14% from last week",
    highlight: true,
    href: "/service-requests",
  },
  {
    label: "Completion Rate",
    value: "93%",
    trend: "+4% within SLA",
    highlight: false,
    href: "/maintenance",
  },
  {
    label: "Attention Needed",
    value: "17",
    trend: "-6 from prior cycle",
    highlight: false,
    href: "/assets",
  },
  {
    label: "Low Stock Parts",
    value: "09",
    trend: "2 urgent restocks",
    highlight: false,
    href: "/spare-parts",
  },
];

export const ACTIVITY_ITEMS: ActivityItem[] = [
  {
    id: "MW-204",
    source: "R. Santos",
    task: "Generator GEN-104 — critical repair in progress",
    status: "In Progress",
    initials: "RS",
    color: "#145d66",
  },
  {
    id: "SR-783",
    source: "M. Garcia",
    task: "Badge scanner intermittently offline — Central Office",
    status: "Scheduled",
    initials: "MG",
    color: "#7c3aed",
  },
  {
    id: "MW-198",
    source: "L. Ramos",
    task: "Elevator ELV-14 — awaiting replacement parts",
    status: "Awaiting Parts",
    initials: "LR",
    color: "#0891b2",
  },
  {
    id: "SR-779",
    source: "A. Cruz",
    task: "Roll-up door sensor misalignment — North Warehouse",
    status: "Under Review",
    initials: "AC",
    color: "#d97706",
  },
  {
    id: "MW-191",
    source: "J. Navarro",
    task: "HVAC AHU-08 — preventive maintenance assigned",
    status: "Assigned",
    initials: "JN",
    color: "#145d66",
  },
];

export const RECENT_REQUESTS: RecentRequestItem[] = [
  { id: "SR-783", source: "Badge scanner — Central Office", date: "Today, 8:20 AM", dot: "#145d66" },
  { id: "SR-779", source: "Door sensor — North Warehouse", date: "Today, 7:45 AM", dot: "#7c3aed" },
  { id: "SR-774", source: "Cooling alarm — Annex Building", date: "Yesterday, 4:10 PM", dot: "#0891b2" },
  { id: "SR-770", source: "Fire panel relay — Main Office", date: "Yesterday, 1:30 PM", dot: "#d97706" },
  { id: "SR-766", source: "Lighting outage — Parking Deck", date: "Mar 28, 2026", dot: "#145d66" },
];

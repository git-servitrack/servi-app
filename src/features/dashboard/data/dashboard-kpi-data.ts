export type KpiStat = {
  label: string;
  value: string;
  trend: string;
  highlight: boolean;
  href?: string;
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

export type ServiceActivityPoint = {
  day: string;
  requests: number;
};

export type MaintenanceTrendPoint = {
  date: string;
  requested: number;
  completed: number;
};

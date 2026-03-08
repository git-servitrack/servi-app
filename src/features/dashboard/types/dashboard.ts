export type TrendDirection = "up" | "down" | "neutral";

export interface DashboardSummaryMetric {
  label: string;
  value: string;
  change: string;
  changeLabel: string;
  trend: TrendDirection;
}

export interface DashboardQuickStat {
  label: string;
  value: string;
  detail: string;
}

export interface DashboardActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  category: "maintenance" | "request" | "inventory" | "documentation";
}

export interface DashboardMaintenanceItem {
  id: string;
  asset: string;
  technician: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  status: "Assigned" | "In Progress" | "Awaiting Parts" | "Completed";
  dueDate: string;
}

export interface DashboardRequestItem {
  id: string;
  requester: string;
  site: string;
  issue: string;
  status: "New" | "Under Review" | "Scheduled" | "Resolved";
  submittedAt: string;
}

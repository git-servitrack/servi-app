import type {
  DashboardActivityItem,
  DashboardMaintenanceItem,
  DashboardQuickStat,
  DashboardRequestItem,
  DashboardSummaryMetric,
} from "@/features/dashboard/types/dashboard";

export const dashboardSummaryMetrics: DashboardSummaryMetric[] = [
  {
    label: "Open service requests",
    value: "128",
    change: "+14%",
    changeLabel: "vs last week",
    trend: "up",
  },
  {
    label: "Maintenance completion rate",
    value: "93%",
    change: "+4%",
    changeLabel: "within SLA",
    trend: "up",
  },
  {
    label: "Assets requiring attention",
    value: "17",
    change: "-6",
    changeLabel: "from prior cycle",
    trend: "down",
  },
  {
    label: "Parts at low stock",
    value: "9",
    change: "2 urgent",
    changeLabel: "restock needed",
    trend: "neutral",
  },
];

export const dashboardQuickStats: DashboardQuickStat[] = [
  {
    label: "Active technicians",
    value: "24",
    detail: "18 on field assignments today",
  },
  {
    label: "Average response time",
    value: "1.8h",
    detail: "Improved from 2.4h last week",
  },
  {
    label: "Preventive jobs due",
    value: "31",
    detail: "12 due in the next 48 hours",
  },
  {
    label: "Documents uploaded",
    value: "46",
    detail: "Inspection files added this week",
  },
];

export const dashboardRecentActivity: DashboardActivityItem[] = [
  {
    id: "ACT-1001",
    title: "Cooling unit inspection completed",
    description: "Technician D. Cruz closed the preventive maintenance checklist for Asset AC-221.",
    timestamp: "12 minutes ago",
    category: "maintenance",
  },
  {
    id: "ACT-1002",
    title: "Urgent service request escalated",
    description: "HQ lobby access reader issue was promoted to critical priority for same-day handling.",
    timestamp: "28 minutes ago",
    category: "request",
  },
  {
    id: "ACT-1003",
    title: "Low stock threshold triggered",
    description: "Relay switch inventory dropped below the configured safety level.",
    timestamp: "1 hour ago",
    category: "inventory",
  },
  {
    id: "ACT-1004",
    title: "Site report uploaded",
    description: "A new maintenance completion report was attached for the North Warehouse generator check.",
    timestamp: "2 hours ago",
    category: "documentation",
  },
];

export const dashboardMaintenanceItems: DashboardMaintenanceItem[] = [
  {
    id: "MW-204",
    asset: "Generator GEN-104",
    technician: "R. Santos",
    priority: "Critical",
    status: "In Progress",
    dueDate: "Today, 4:00 PM",
  },
  {
    id: "MW-198",
    asset: "Elevator ELV-14",
    technician: "L. Ramos",
    priority: "High",
    status: "Awaiting Parts",
    dueDate: "Mar 9",
  },
  {
    id: "MW-191",
    asset: "HVAC AHU-08",
    technician: "J. Navarro",
    priority: "Medium",
    status: "Assigned",
    dueDate: "Mar 10",
  },
];

export const dashboardRequestItems: DashboardRequestItem[] = [
  {
    id: "SR-783",
    requester: "M. Garcia",
    site: "Central Office",
    issue: "Badge scanner intermittently offline",
    status: "Scheduled",
    submittedAt: "Today, 8:20 AM",
  },
  {
    id: "SR-779",
    requester: "A. Cruz",
    site: "North Warehouse",
    issue: "Roll-up door sensor misalignment",
    status: "Under Review",
    submittedAt: "Today, 7:45 AM",
  },
  {
    id: "SR-774",
    requester: "P. Fernandez",
    site: "Annex Building",
    issue: "Server room cooling alarm warning",
    status: "New",
    submittedAt: "Yesterday, 4:10 PM",
  },
];

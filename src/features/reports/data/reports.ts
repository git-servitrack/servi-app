import type {
  CompletionRateReportRow,
  MaintenanceHistoryReportRow,
  ReportFilterState,
  ReportMetric,
  RequestVolumeReportRow,
  SparePartsUsageReportRow,
  TechnicianPerformanceReportRow,
} from "@/features/reports/types/reports";

export const defaultReportFilters: ReportFilterState = {
  period: "Last 30 days",
  site: "All sites",
  team: "All teams",
  from: "",
  to: "",
  limit: "10",
};

export const reportMetrics: ReportMetric[] = [
  {
    label: "Maintenance completed",
    value: "42",
    hint: "Closed work orders in the current reporting window",
    color: "#145d66",
  },
  {
    label: "Average SLA rate",
    value: "94%",
    hint: "Combined technician and maintenance completion target adherence",
    color: "#059669",
  },
  {
    label: "Parts issued",
    value: "67",
    hint: "Spare-part issue transactions tied to maintenance work",
    color: "#d97706",
  },
  {
    label: "Request intake",
    value: "58",
    hint: "New service requests logged during the active period",
    color: "#1e293b",
  },
];

export const maintenanceHistoryReport: MaintenanceHistoryReportRow[] = [
  { id: "MR-101", workOrder: "MW-204", asset: "Generator GEN-104", site: "Central Office", status: "Repair In Progress", completedAt: "Mar 8" },
  { id: "MR-102", workOrder: "MW-188", asset: "Switchgear SG-02", site: "Annex Building", status: "Completed", completedAt: "Mar 6" },
  { id: "MR-103", workOrder: "MW-176", asset: "Cooling Unit CU-12", site: "North Warehouse", status: "Completed", completedAt: "Mar 4" },
];

export const technicianPerformanceReport: TechnicianPerformanceReportRow[] = [
  { id: "TR-101", technician: "R. Santos", team: "Electrical Response", completedJobs: "28", responseTime: "1.4h", slaRate: "96%" },
  { id: "TR-102", technician: "L. Ramos", team: "Mechanical Systems", completedJobs: "21", responseTime: "2.1h", slaRate: "93%" },
  { id: "TR-103", technician: "J. Navarro", team: "Facilities", completedJobs: "19", responseTime: "2.5h", slaRate: "91%" },
];

export const sparePartsUsageReport: SparePartsUsageReportRow[] = [
  { id: "PR-101", part: "Compressor Relay", category: "HVAC Electrical", issuedUnits: "3 pcs", linkedWorkOrders: "2", site: "Central Office" },
  { id: "PR-102", part: "Breaker Handle Kit", category: "Power Systems", issuedUnits: "1 kit", linkedWorkOrders: "1", site: "Annex Building" },
  { id: "PR-103", part: "Lift Door Sensor", category: "Mechanical Systems", issuedUnits: "1 pc", linkedWorkOrders: "1", site: "Annex Building" },
];

export const requestVolumeReport: RequestVolumeReportRow[] = [
  { id: "RR-101", category: "Electrical", newRequests: "14", inProgress: "6", resolved: "9", site: "Central Office" },
  { id: "RR-102", category: "Mechanical", newRequests: "11", inProgress: "4", resolved: "7", site: "Annex Building" },
  { id: "RR-103", category: "Facilities", newRequests: "9", inProgress: "3", resolved: "8", site: "North Warehouse" },
];

export const completionRateReport: CompletionRateReportRow[] = [
  { id: "CR-101", team: "Electrical Response", completed: "15", overdue: "1", completionRate: "94%", qaReady: "3" },
  { id: "CR-102", team: "Mechanical Systems", completed: "13", overdue: "2", completionRate: "87%", qaReady: "2" },
  { id: "CR-103", team: "Facilities", completed: "14", overdue: "1", completionRate: "93%", qaReady: "4" },
];

export interface ReportFilterState {
  period: string;
  site: string;
  team: string;
}

export interface ReportMetric {
  label: string;
  value: string;
  hint: string;
  /** Accent bar color (hex) for KPI card */
  color?: string;
}

export interface MaintenanceHistoryReportRow {
  id: string;
  workOrder: string;
  asset: string;
  site: string;
  status: string;
  completedAt: string;
}

export interface TechnicianPerformanceReportRow {
  id: string;
  technician: string;
  team: string;
  completedJobs: string;
  responseTime: string;
  slaRate: string;
}

export interface SparePartsUsageReportRow {
  id: string;
  part: string;
  category: string;
  issuedUnits: string;
  linkedWorkOrders: string;
  site: string;
}

export interface RequestVolumeReportRow {
  id: string;
  category: string;
  newRequests: string;
  inProgress: string;
  resolved: string;
  site: string;
}

export interface CompletionRateReportRow {
  id: string;
  team: string;
  completed: string;
  overdue: string;
  completionRate: string;
  qaReady: string;
}

export interface ReportFilterState {
  period: string;
  site: string;
  team: string;
  from: string;
  to: string;
  limit: string;
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

export interface DowntimeReportRow {
  id: string;
  asset: string;
  site: string;
  incidents: string;
  downtimeHours: string;
  lastDowntimeAt: string;
}

export interface HighRiskEquipmentReportRow {
  id: string;
  asset: string;
  site: string;
  riskLevel: string;
  riskScore: string;
  recommendation: string;
  forecastedAt: string;
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

export interface ReportingOverview {
  metrics: ReportMetric[];
  maintenanceHistory: MaintenanceHistoryReportRow[];
  technicianPerformance: TechnicianPerformanceReportRow[];
  sparePartsUsage: SparePartsUsageReportRow[];
  downtime: DowntimeReportRow[];
  highRiskEquipment: HighRiskEquipmentReportRow[];
  requestVolume: RequestVolumeReportRow[];
  completionRate: CompletionRateReportRow[];
}

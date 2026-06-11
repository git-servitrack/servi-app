import type {
  CompletionRateReportRow,
  DowntimeReportRow,
  HighRiskEquipmentReportRow,
  MaintenanceHistoryReportRow,
  ReportFilterState,
  ReportMetric,
  ReportingOverview,
  RequestVolumeReportRow,
  SparePartsUsageReportRow,
  TechnicianPerformanceReportRow,
} from "@/features/reports/types/reports";

export type ApiReportMetric = ReportMetric;
export type ApiMaintenanceHistoryReportRow = MaintenanceHistoryReportRow;
export type ApiTechnicianPerformanceReportRow = TechnicianPerformanceReportRow;
export type ApiSparePartsUsageReportRow = SparePartsUsageReportRow;
export type ApiDowntimeReportRow = DowntimeReportRow;
export type ApiHighRiskEquipmentReportRow = HighRiskEquipmentReportRow;
export type ApiRequestVolumeReportRow = RequestVolumeReportRow;
export type ApiCompletionRateReportRow = CompletionRateReportRow;
export type ApiReportingOverview = ReportingOverview;

export type ReportQueryPayload = Partial<ReportFilterState>;

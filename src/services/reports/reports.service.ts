import { createApiResult, requestJson } from "@/services/http/client";
import type { ApiResult, QueryParams } from "@/services/http/types";
import type {
  ApiCompletionRateReportRow,
  ApiDowntimeReportRow,
  ApiHighRiskEquipmentReportRow,
  ApiMaintenanceHistoryReportRow,
  ApiReportMetric,
  ApiReportingOverview,
  ApiRequestVolumeReportRow,
  ApiSparePartsUsageReportRow,
  ApiTechnicianPerformanceReportRow,
  ReportQueryPayload,
} from "@/services/reports/contracts";

function normalizeReportQuery(query?: ReportQueryPayload): QueryParams {
  return {
    period: query?.period,
    site: query?.site,
    team: query?.team,
    from: query?.from,
    to: query?.to,
    limit: query?.limit ? Number(query.limit) : undefined,
  };
}

export const reportsService = {
  async overview(query?: ReportQueryPayload): Promise<ApiResult<ApiReportingOverview>> {
    return createApiResult(async () => {
      return requestJson<ApiReportingOverview>("/reports/overview", {
        query: normalizeReportQuery(query),
      });
    });
  },

  async metrics(query?: ReportQueryPayload): Promise<ApiResult<ApiReportMetric[]>> {
    return createApiResult(async () => {
      return requestJson<ApiReportMetric[]>("/reports/metrics", {
        query: normalizeReportQuery(query),
      });
    });
  },

  async maintenanceHistory(query?: ReportQueryPayload): Promise<ApiResult<ApiMaintenanceHistoryReportRow[]>> {
    return createApiResult(async () => {
      return requestJson<ApiMaintenanceHistoryReportRow[]>("/reports/maintenance-history", {
        query: normalizeReportQuery(query),
      });
    });
  },

  async technicianPerformance(query?: ReportQueryPayload): Promise<ApiResult<ApiTechnicianPerformanceReportRow[]>> {
    return createApiResult(async () => {
      return requestJson<ApiTechnicianPerformanceReportRow[]>("/reports/technician-performance", {
        query: normalizeReportQuery(query),
      });
    });
  },

  async sparePartsUsage(query?: ReportQueryPayload): Promise<ApiResult<ApiSparePartsUsageReportRow[]>> {
    return createApiResult(async () => {
      return requestJson<ApiSparePartsUsageReportRow[]>("/reports/spare-parts-usage", {
        query: normalizeReportQuery(query),
      });
    });
  },

  async downtime(query?: ReportQueryPayload): Promise<ApiResult<ApiDowntimeReportRow[]>> {
    return createApiResult(async () => {
      return requestJson<ApiDowntimeReportRow[]>("/reports/downtime", {
        query: normalizeReportQuery(query),
      });
    });
  },

  async highRiskEquipment(query?: ReportQueryPayload): Promise<ApiResult<ApiHighRiskEquipmentReportRow[]>> {
    return createApiResult(async () => {
      return requestJson<ApiHighRiskEquipmentReportRow[]>("/reports/high-risk-equipment", {
        query: normalizeReportQuery(query),
      });
    });
  },

  async requestVolume(query?: ReportQueryPayload): Promise<ApiResult<ApiRequestVolumeReportRow[]>> {
    return createApiResult(async () => {
      return requestJson<ApiRequestVolumeReportRow[]>("/reports/request-volume", {
        query: normalizeReportQuery(query),
      });
    });
  },

  async completionRate(query?: ReportQueryPayload): Promise<ApiResult<ApiCompletionRateReportRow[]>> {
    return createApiResult(async () => {
      return requestJson<ApiCompletionRateReportRow[]>("/reports/completion-rate", {
        query: normalizeReportQuery(query),
      });
    });
  },
};

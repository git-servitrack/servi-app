import { AppRequestError } from "@/services/http/errors";
import { getAccessToken } from "@/services/auth/session";
import { buildApiUrl, createApiResult, requestJson } from "@/services/http/client";
import type { ApiResult, QueryParams } from "@/services/http/types";
import type {
  ApiCompletionRateReportRow,
  ApiDowntimeReportRow,
  ApiHighRiskEquipmentReportRow,
  ApiMaintenanceHistoryReportRow,
  ApiReportMetric,
  ApiReportSummary,
  ApiReportingOverview,
  ApiRequestVolumeReportRow,
  ApiSparePartsUsageReportRow,
  ApiTechnicianPerformanceReportRow,
  ReportQueryPayload,
  ReportExportResponse,
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

function getFilenameFromDisposition(value: string | null) {
  const match = value?.match(/filename="?([^"]+)"?/i);
  return match?.[1] ?? "servi-report-pack.csv";
}

async function requestReportExport(query?: ReportQueryPayload): Promise<ReportExportResponse> {
  const token = getAccessToken();
  const response = await fetch(buildApiUrl("/reports/export", normalizeReportQuery(query)), {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new AppRequestError({
      code: response.status === 403 ? "FORBIDDEN" : response.status === 401 ? "UNAUTHORIZED" : "BAD_REQUEST",
      message: payload?.message ?? "Report export failed.",
      status: response.status,
      meta: payload?.meta,
    });
  }

  return {
    blob: await response.blob(),
    filename: getFilenameFromDisposition(response.headers.get("Content-Disposition")),
  };
}

export const reportsService = {
  async summary(query?: ReportQueryPayload): Promise<ApiResult<ApiReportSummary>> {
    return createApiResult(async () => {
      return requestJson<ApiReportSummary>("/reports/summary", {
        query: normalizeReportQuery(query),
      });
    });
  },

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

  async exportPack(query?: ReportQueryPayload): Promise<ApiResult<ReportExportResponse>> {
    return createApiResult(() => requestReportExport(query));
  },
};

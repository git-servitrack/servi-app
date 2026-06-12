"use client";

import { BarChart3, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { sileo } from "sileo";

import { ApiErrorAlert } from "@/components/feedback/api-error-alert";
import { CompletionRateReportUi } from "@/features/reports/components/completion-rate-report-ui";
import { DowntimeReportUi } from "@/features/reports/components/downtime-report-ui";
import { HighRiskEquipmentReportUi } from "@/features/reports/components/high-risk-equipment-report-ui";
import { MaintenanceHistoryReportUi } from "@/features/reports/components/maintenance-history-report-ui";
import { ReportFilterToolbar } from "@/features/reports/components/report-filter-toolbar";
import { ReportMetricCard } from "@/features/reports/components/report-metric-card";
import { ReportSectionCard } from "@/features/reports/components/report-section-card";
import { ReportSummaryPanel } from "@/features/reports/components/report-summary-panel";
import { RequestVolumeReportUi } from "@/features/reports/components/request-volume-report-ui";
import { SparePartsUsageReportUi } from "@/features/reports/components/spare-parts-usage-report-ui";
import { TechnicianPerformanceReportUi } from "@/features/reports/components/technician-performance-report-ui";
import { defaultReportFilters } from "@/features/reports/data/reports";
import type { ReportFilterState, ReportSummary, ReportingOverview } from "@/features/reports/types/reports";
import { reportsService } from "@/services";
import type { ApiErrorShape } from "@/services/http/types";

const emptyOverview: ReportingOverview = {
  metrics: [],
  maintenanceHistory: [],
  technicianPerformance: [],
  sparePartsUsage: [],
  downtime: [],
  highRiskEquipment: [],
  requestVolume: [],
  completionRate: [],
};

export function ReportsOverviewView() {
  const [filters, setFilters] = useState<ReportFilterState>(defaultReportFilters);
  const [overview, setOverview] = useState<ReportingOverview>(emptyOverview);
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [error, setError] = useState<ApiErrorShape | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  async function loadReports(nextFilters = filters) {
    setIsLoading(true);

    const result = await reportsService.overview(nextFilters);

    if (result.error) {
      setError(result.error);
      setOverview(emptyOverview);
    } else {
      setError(null);
      setOverview(result.data);
    }

    setIsLoading(false);
  }

  async function generateSummary() {
    setIsGeneratingSummary(true);

    const result = await reportsService.summary(filters);

    if (result.error) {
      setError(result.error);
    } else {
      setError(null);
      setSummary(result.data);
      await loadReports(filters);
    }

    setIsGeneratingSummary(false);
  }

  function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  async function exportReports() {
    setIsExporting(true);

    const exported = await sileo
      .promise(
        async () => {
          const result = await reportsService.exportPack(filters);

          if (result.error) {
            throw result.error;
          }

          return result.data;
        },
        {
          loading: {
            title: "Exporting report pack...",
            description: "Preparing the CSV file from the reporting API.",
          },
          success: {
            title: "Report pack ready",
            description: "Your CSV download has started.",
          },
          error: (errorValue) => ({
            title: "Export failed",
            description:
              typeof errorValue === "object" && errorValue !== null && "message" in errorValue
                ? String((errorValue as { message?: unknown }).message)
                : "The report pack could not be exported.",
          }),
        },
      )
      .catch((errorValue: ApiErrorShape) => {
        setError(errorValue);
        return null;
      });

    setIsExporting(false);

    if (!exported) return;

    downloadBlob(exported.blob, exported.filename);
    setError(null);
  }

  useEffect(() => {
    let active = true;

    async function loadInitialReports() {
      const result = await reportsService.overview(defaultReportFilters);

      if (!active) return;

      if (result.error) {
        setError(result.error);
        setOverview(emptyOverview);
      } else {
        setError(null);
        setOverview(result.data);
      }

      setIsLoading(false);
    }

    void loadInitialReports();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-stone-100">
              Reports
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm text-slate-500 dark:text-stone-400">
              Maintenance throughput, technician performance, parts usage, request volume, downtime,
              and predictive risk from the reporting API.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void generateSummary()}
            disabled={isLoading || isGeneratingSummary}
            className="flex w-fit items-center gap-1.5 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-60 dark:border-white/10 dark:text-stone-300 dark:hover:bg-white/6"
          >
            {isLoading || isGeneratingSummary ? (
              <LoaderCircle className="h-4 w-4 animate-spin text-[#145d66] dark:text-[#86d0d8]" />
            ) : (
              <BarChart3 className="h-4 w-4 text-[#145d66] dark:text-[#86d0d8]" />
            )}
            {isGeneratingSummary ? "Generating..." : isLoading ? "Loading reports" : "Generate summary"}
          </button>
        </div>

        {error ? (
          <div className="mt-5">
            <ApiErrorAlert message={error.message} />
          </div>
        ) : null}

        <div className="mt-6 space-y-2">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-stone-100">
            Report filters
          </h2>
          <p className="text-sm text-slate-400 dark:text-stone-500">
            Sent to the reports API as period, from, to, site, team, and limit query params.
          </p>
          <ReportFilterToolbar
            filters={filters}
            isLoading={isLoading}
            isExporting={isExporting}
            onChange={setFilters}
            onRefresh={() => void loadReports()}
            onExport={() => void exportReports()}
          />
        </div>

        {summary ? (
          <div className="mt-5">
            <ReportSummaryPanel summary={summary} onClose={() => setSummary(null)} />
          </div>
        ) : null}

        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {overview.metrics.map((metric) => (
            <ReportMetricCard key={metric.label} metric={metric} />
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:mt-8 sm:gap-6">
          <ReportSectionCard
            title="Maintenance history"
            description="Work order progression by asset and site, export-friendly."
          >
            <MaintenanceHistoryReportUi items={overview.maintenanceHistory} />
          </ReportSectionCard>

          <ReportSectionCard
            title="Technician performance"
            description="Completed jobs, response time, and SLA rate by technician."
          >
            <TechnicianPerformanceReportUi items={overview.technicianPerformance} />
          </ReportSectionCard>

          <ReportSectionCard
            title="Spare parts usage"
            description="Issue volume with linked work orders and site context."
          >
            <SparePartsUsageReportUi items={overview.sparePartsUsage} />
          </ReportSectionCard>

          <ReportSectionCard
            title="Downtime"
            description="Assets with downtime incidents and operating impact."
          >
            <DowntimeReportUi items={overview.downtime} />
          </ReportSectionCard>

          <ReportSectionCard
            title="High-risk equipment"
            description="Predictive maintenance results that need inspection or follow-up."
          >
            <HighRiskEquipmentReportUi items={overview.highRiskEquipment} />
          </ReportSectionCard>

          <ReportSectionCard
            title="Request volume"
            description="Intake flow by category and site for triage planning."
          >
            <RequestVolumeReportUi items={overview.requestVolume} />
          </ReportSectionCard>

          <ReportSectionCard
            title="Completion rate"
            description="Team delivery quality separate from raw volume."
          >
            <CompletionRateReportUi items={overview.completionRate} />
          </ReportSectionCard>
        </div>
      </div>
    </div>
  );
}

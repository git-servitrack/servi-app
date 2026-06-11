import { BarChart3 } from "lucide-react";

import {
  completionRateReport,
  defaultReportFilters,
  maintenanceHistoryReport,
  reportMetrics,
  requestVolumeReport,
  sparePartsUsageReport,
  technicianPerformanceReport,
} from "@/features/reports/data/reports";
import { CompletionRateReportUi } from "@/features/reports/components/completion-rate-report-ui";
import { ExportLayoutPlaceholder } from "@/features/reports/components/export-layout-placeholder";
import { MaintenanceHistoryReportUi } from "@/features/reports/components/maintenance-history-report-ui";
import { ReportFilterToolbar } from "@/features/reports/components/report-filter-toolbar";
import { ReportMetricCard } from "@/features/reports/components/report-metric-card";
import { ReportSectionCard } from "@/features/reports/components/report-section-card";
import { RequestVolumeReportUi } from "@/features/reports/components/request-volume-report-ui";
import { SparePartsUsageReportUi } from "@/features/reports/components/spare-parts-usage-report-ui";
import { TechnicianPerformanceReportUi } from "@/features/reports/components/technician-performance-report-ui";

export function ReportsOverviewView() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-stone-100">Reports</h1>
            <p className="mt-1.5 max-w-2xl text-sm text-slate-500 dark:text-stone-400">
              Maintenance throughput, technician performance, parts usage, request volume, and completion efficiency — structured for future API-backed analytics and exports.
            </p>
          </div>
          <button
            type="button"
            className="flex w-fit items-center gap-1.5 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-white/10 dark:text-stone-300 dark:hover:bg-white/6"
          >
            <BarChart3 className="h-4 w-4 text-[#145d66] dark:text-[#86d0d8]" />
            Generate summary
          </button>
        </div>

        <div className="mt-6 space-y-2">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-stone-100">Report filters</h2>
          <p className="text-sm text-slate-400 dark:text-stone-500">
            Centralized filters for reuse with server queries and export payloads.
          </p>
          <ReportFilterToolbar filters={defaultReportFilters} />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {reportMetrics.map((metric) => (
            <ReportMetricCard key={metric.label} metric={metric} />
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:mt-8 sm:gap-6">
          <ReportSectionCard
            title="Maintenance history"
            description="Work order progression by asset and site, export-friendly."
          >
            <MaintenanceHistoryReportUi items={maintenanceHistoryReport} />
          </ReportSectionCard>

          <ReportSectionCard
            title="Technician performance"
            description="Completed jobs, response time, and SLA rate by technician."
          >
            <TechnicianPerformanceReportUi items={technicianPerformanceReport} />
          </ReportSectionCard>

          <ReportSectionCard
            title="Spare parts usage"
            description="Issue volume with linked work orders and site context."
          >
            <SparePartsUsageReportUi items={sparePartsUsageReport} />
          </ReportSectionCard>

          <ReportSectionCard
            title="Request volume"
            description="Intake flow by category and site for triage planning."
          >
            <RequestVolumeReportUi items={requestVolumeReport} />
          </ReportSectionCard>

          <ReportSectionCard
            title="Completion rate"
            description="Team delivery quality separate from raw volume."
          >
            <CompletionRateReportUi items={completionRateReport} />
          </ReportSectionCard>

          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-stone-100">Export preparation</h2>
            <p className="text-sm text-slate-400 dark:text-stone-500">Dedicated print and spreadsheet layouts vs. interactive view.</p>
            <ExportLayoutPlaceholder />
          </div>
        </div>
      </div>
    </div>
  );
}

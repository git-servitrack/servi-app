import { BarChart3 } from "lucide-react";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { RequestVolumeReportUi } from "@/features/reports/components/request-volume-report-ui";
import { SparePartsUsageReportUi } from "@/features/reports/components/spare-parts-usage-report-ui";
import { TechnicianPerformanceReportUi } from "@/features/reports/components/technician-performance-report-ui";

export function ReportsOverviewView() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Reports Module"
        title="Operational reporting"
        description="Review maintenance throughput, technician performance, inventory usage, request volume, and completion efficiency from a structured reporting workspace."
        actions={
          <>
            <Badge variant="accent">Analytics-ready structure</Badge>
            <Button type="button" variant="outline">
              <BarChart3 className="size-4" />
              Generate summary
            </Button>
          </>
        }
      />

      <SectionWrapper
        title="Report filters"
        description="Keep filters centralized so later server-side analytics queries and export payloads can reuse the same request state."
      >
        <ReportFilterToolbar filters={defaultReportFilters} />
      </SectionWrapper>

      <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {reportMetrics.map((metric) => (
          <ReportMetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <div className="grid gap-6">
        <SectionWrapper title="Maintenance history report" description="Tabular maintenance history keeps asset-level work progression readable and export friendly.">
          <MaintenanceHistoryReportUi items={maintenanceHistoryReport} />
        </SectionWrapper>

        <SectionWrapper title="Technician performance report" description="A compact performance table is the right baseline before adding trend lines or team-comparison visuals later.">
          <TechnicianPerformanceReportUi items={technicianPerformanceReport} />
        </SectionWrapper>

        <SectionWrapper title="Spare parts usage report" description="Inventory issue volume is presented alongside linked work-order counts so consumption patterns stay operationally useful.">
          <SparePartsUsageReportUi items={sparePartsUsageReport} />
        </SectionWrapper>

        <SectionWrapper title="Request volume report" description="Service request flow is grouped by category and site to support intake planning and triage reviews.">
          <RequestVolumeReportUi items={requestVolumeReport} />
        </SectionWrapper>

        <SectionWrapper title="Completion rate report" description="Completion efficiency stays isolated from raw volume so team-level delivery quality is easier to compare.">
          <CompletionRateReportUi items={completionRateReport} />
        </SectionWrapper>
      </div>

      <SectionWrapper
        title="Export preparation"
        description="Report exports should eventually use dedicated print and spreadsheet layouts rather than reusing the interactive dashboard view."
      >
        <ExportLayoutPlaceholder />
      </SectionWrapper>
    </PageContainer>
  );
}

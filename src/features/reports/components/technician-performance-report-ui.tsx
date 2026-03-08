import { ReportTableView } from "@/features/reports/components/report-table-view";
import type { TechnicianPerformanceReportRow } from "@/features/reports/types/reports";

export function TechnicianPerformanceReportUi({ items }: { items: TechnicianPerformanceReportRow[] }) {
  return (
    <ReportTableView
      columns={["Technician", "Team", "Completed Jobs", "Avg. Response", "SLA Rate"]}
      rows={items.map((item) => [item.technician, item.team, item.completedJobs, item.responseTime, item.slaRate])}
    />
  );
}

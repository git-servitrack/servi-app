import { ReportTableView } from "@/features/reports/components/report-table-view";
import type { RequestVolumeReportRow } from "@/features/reports/types/reports";

export function RequestVolumeReportUi({ items }: { items: RequestVolumeReportRow[] }) {
  return (
    <ReportTableView
      columns={["Category", "New Requests", "In Progress", "Resolved", "Site"]}
      rows={items.map((item) => [item.category, item.newRequests, item.inProgress, item.resolved, item.site])}
    />
  );
}

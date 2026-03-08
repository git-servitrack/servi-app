import { ReportTableView } from "@/features/reports/components/report-table-view";
import type { MaintenanceHistoryReportRow } from "@/features/reports/types/reports";

export function MaintenanceHistoryReportUi({ items }: { items: MaintenanceHistoryReportRow[] }) {
  return (
    <ReportTableView
      columns={["Work Order", "Asset", "Site", "Status", "Completed / Updated"]}
      rows={items.map((item) => [item.workOrder, item.asset, item.site, item.status, item.completedAt])}
    />
  );
}

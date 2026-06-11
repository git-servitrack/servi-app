import { ReportTableView } from "@/features/reports/components/report-table-view";
import type { DowntimeReportRow } from "@/features/reports/types/reports";

export function DowntimeReportUi({ items }: { items: DowntimeReportRow[] }) {
  return (
    <ReportTableView
      columns={["Asset", "Site", "Incidents", "Downtime", "Last Downtime"]}
      rows={items.map((item) => [
        item.asset,
        item.site,
        item.incidents,
        item.downtimeHours,
        item.lastDowntimeAt,
      ])}
    />
  );
}

import { ReportTableView } from "@/features/reports/components/report-table-view";
import type { SparePartsUsageReportRow } from "@/features/reports/types/reports";

export function SparePartsUsageReportUi({ items }: { items: SparePartsUsageReportRow[] }) {
  return (
    <ReportTableView
      columns={["Part", "Category", "Issued Units", "Linked Work Orders", "Site"]}
      rows={items.map((item) => [item.part, item.category, item.issuedUnits, item.linkedWorkOrders, item.site])}
    />
  );
}

import { ReportTableView } from "@/features/reports/components/report-table-view";
import type { CompletionRateReportRow } from "@/features/reports/types/reports";

export function CompletionRateReportUi({ items }: { items: CompletionRateReportRow[] }) {
  return (
    <ReportTableView
      columns={["Team", "Completed", "Overdue", "Completion Rate", "QA Ready"]}
      rows={items.map((item) => [item.team, item.completed, item.overdue, item.completionRate, item.qaReady])}
    />
  );
}

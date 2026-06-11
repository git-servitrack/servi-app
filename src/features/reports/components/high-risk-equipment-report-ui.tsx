import { ReportTableView } from "@/features/reports/components/report-table-view";
import type { HighRiskEquipmentReportRow } from "@/features/reports/types/reports";

export function HighRiskEquipmentReportUi({ items }: { items: HighRiskEquipmentReportRow[] }) {
  return (
    <ReportTableView
      columns={["Asset", "Site", "Risk Level", "Risk Score", "Recommendation", "Forecasted"]}
      rows={items.map((item) => [
        item.asset,
        item.site,
        item.riskLevel,
        `${item.riskScore}%`,
        item.recommendation,
        item.forecastedAt,
      ])}
    />
  );
}

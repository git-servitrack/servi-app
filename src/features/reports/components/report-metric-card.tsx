import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReportMetric } from "@/features/reports/types/reports";

export function ReportMetricCard({ metric }: { metric: ReportMetric }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{metric.label}</CardDescription>
        <CardTitle className="text-4xl">{metric.value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-muted-foreground">{metric.hint}</p>
      </CardContent>
    </Card>
  );
}

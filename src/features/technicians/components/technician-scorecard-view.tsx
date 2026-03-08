import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { TechnicianScorecard } from "@/features/technicians/types/technicians";

export function TechnicianScorecardView({ scorecard }: { scorecard: TechnicianScorecard }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Performance snapshot</CardDescription>
        <CardTitle>Technician scorecard</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        {[
          {
            label: "Jobs Completed",
            value: scorecard.jobsCompleted,
            hint: "Closed work orders this cycle",
          },
          {
            label: "Open Assignments",
            value: scorecard.openAssignments,
            hint: "Current active job ownership",
          },
          {
            label: "Avg. Response Time",
            value: scorecard.responseTime,
            hint: "Time to first technician action",
          },
          {
            label: "SLA Rate",
            value: scorecard.slaRate,
            hint: "Completion within target window",
          },
        ].map((item) => (
          <div key={item.label} className="rounded-[calc(var(--radius)-0.15rem)] border border-border/70 bg-background/65 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold text-foreground">{item.value}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.hint}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

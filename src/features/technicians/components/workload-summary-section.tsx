import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { TechnicianWorkload } from "@/features/technicians/types/technicians";

export function WorkloadSummarySection({ workload }: { workload: TechnicianWorkload }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Workload</CardDescription>
        <CardTitle>Current assignment load</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Active Assignments", value: workload.activeAssignments },
          { label: "Due Today", value: workload.dueToday },
          { label: "Upcoming Visits", value: workload.upcomingVisits },
          { label: "Current Shift", value: workload.currentShift },
        ].map((item) => (
          <div key={item.label} className="rounded-[calc(var(--radius)-0.15rem)] border border-border/70 bg-background/65 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
            <p className="mt-2 text-xl font-semibold text-foreground">{item.value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

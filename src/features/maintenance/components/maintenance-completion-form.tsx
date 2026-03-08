import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { MaintenanceCompletionValues } from "@/features/maintenance/types/maintenance";

export function MaintenanceCompletionForm({ values }: { values: MaintenanceCompletionValues }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Completion</CardDescription>
        <CardTitle>Close-out form</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-5">
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Resolution Summary</span>
            <Textarea defaultValue={values.resolution} placeholder="Describe the repair outcome and operational status." />
          </label>

          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Parts Used</span>
            <Input defaultValue={values.partsUsed} placeholder="Relay assembly, insulated terminal set" />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Verified By</span>
              <Input defaultValue={values.verifiedBy} placeholder="QA Electrical" />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Completed At</span>
              <Input type="datetime-local" defaultValue={values.completedAt} />
            </label>
          </div>

          <div className="flex flex-col gap-3 rounded-[calc(var(--radius)-0.15rem)] border border-dashed border-border bg-muted/35 p-4 text-sm text-muted-foreground lg:flex-row lg:items-center lg:justify-between">
            <p>Completion mutation wiring and validation are intentionally deferred until the forms and API integration phase.</p>
            <Button type="button">Save completion</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

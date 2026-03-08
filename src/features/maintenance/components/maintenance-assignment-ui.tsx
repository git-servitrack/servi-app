import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { MaintenanceAssignment } from "@/features/maintenance/types/maintenance";

export function MaintenanceAssignmentUi({ assignment }: { assignment: MaintenanceAssignment }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Assignment</CardDescription>
        <CardTitle>Current owner</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Technician</p>
          <p className="text-sm font-medium text-foreground">{assignment.technician}</p>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Team</p>
          <p className="text-sm font-medium text-foreground">{assignment.team}</p>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Shift</p>
          <p className="text-sm font-medium text-foreground">{assignment.shift}</p>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">ETA</p>
          <p className="text-sm font-medium text-foreground">{assignment.eta}</p>
        </div>
      </CardContent>
    </Card>
  );
}

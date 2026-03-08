import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getInitials } from "@/lib/utils";
import type { TechnicianRecord } from "@/features/technicians/types/technicians";
import { TechnicianStatusBadge } from "@/features/technicians/components/technician-status-badge";

export function TechnicianProfileCard({ technician }: { technician: TechnicianRecord }) {
  return (
    <Card>
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-3xl bg-primary text-lg font-semibold text-primary-foreground">
              {getInitials(technician.name)}
            </div>
            <div className="space-y-2">
              <CardDescription>{technician.role}</CardDescription>
              <CardTitle className="text-3xl">{technician.name}</CardTitle>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{technician.employeeId}</p>
            </div>
          </div>
          <TechnicianStatusBadge status={technician.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-muted-foreground">{technician.bio}</p>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Team", value: technician.team },
            { label: "Primary Skill", value: technician.primarySkill },
            { label: "Coverage", value: technician.siteCoverage },
            { label: "Contact", value: technician.phone },
          ].map((item) => (
            <div key={item.label} className="rounded-[calc(var(--radius)-0.15rem)] border border-border/70 bg-background/65 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
              <p className="mt-2 text-sm font-medium text-foreground">{item.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

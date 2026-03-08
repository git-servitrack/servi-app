import { CheckCircle2, Circle, LoaderCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RepairAction } from "@/features/maintenance/types/maintenance";

const actionMeta = {
  Pending: {
    icon: Circle,
    className: "text-muted-foreground",
  },
  "In Progress": {
    icon: LoaderCircle,
    className: "text-primary",
  },
  Done: {
    icon: CheckCircle2,
    className: "text-accent",
  },
} as const;

export function RepairActionList({ actions }: { actions: RepairAction[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Repair action list</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {actions.map((action) => {
          const meta = actionMeta[action.status];
          const Icon = meta.icon;

          return (
            <div key={action.id} className="rounded-[calc(var(--radius)-0.15rem)] border border-border/70 bg-background/65 p-4">
              <div className="flex items-start gap-3">
                <Icon className={`mt-0.5 size-5 ${meta.className}`} />
                <div className="space-y-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-semibold text-foreground">{action.title}</p>
                    <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{action.status}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Owner: {action.owner}</p>
                  <p className="text-sm leading-6 text-muted-foreground">{action.note}</p>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

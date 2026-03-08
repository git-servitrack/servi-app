import { BellDot, Boxes, ClipboardList, Wrench } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DashboardActivityItem } from "@/features/dashboard/types/dashboard";

const categoryMeta = {
  maintenance: {
    icon: Wrench,
    className: "bg-primary/10 text-primary",
  },
  request: {
    icon: ClipboardList,
    className: "bg-accent/10 text-accent",
  },
  inventory: {
    icon: Boxes,
    className: "bg-secondary/80 text-secondary-foreground",
  },
  documentation: {
    icon: BellDot,
    className: "bg-muted text-foreground",
  },
} as const;

export function DashboardActivityFeed({ items }: { items: DashboardActivityItem[] }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => {
          const meta = categoryMeta[item.category];
          const Icon = meta.icon;

          return (
            <div
              key={item.id}
              className="flex gap-4 rounded-[calc(var(--radius)-0.15rem)] border border-border/70 bg-background/65 p-4"
            >
              <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-2xl", meta.className)}>
                <Icon className="size-5" />
              </div>
              <div className="min-w-0 space-y-1">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-semibold text-foreground">{item.title}</p>
                  <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{item.timestamp}</span>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

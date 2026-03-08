import { Clock3 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RequestTimelineEvent } from "@/features/service-requests/types/service-requests";

export function RequestTimeline({ events }: { events: RequestTimelineEvent[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Request timeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="flex gap-4 rounded-[calc(var(--radius)-0.15rem)] border border-border/70 bg-background/65 p-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Clock3 className="size-5" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-semibold text-foreground">{event.title}</p>
                <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{event.createdAt}</span>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">{event.description}</p>
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Actor: {event.actor}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

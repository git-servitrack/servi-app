import { MessageSquareText } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RequestRemark } from "@/features/service-requests/types/service-requests";

export function RequestRemarksSection({ remarks }: { remarks: RequestRemark[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Remarks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {remarks.map((remark) => (
          <div key={remark.id} className="rounded-[calc(var(--radius)-0.15rem)] border border-border/70 bg-background/65 p-4">
            <div className="flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                <MessageSquareText className="size-5" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-semibold text-foreground">
                    {remark.author} <span className="text-muted-foreground">· {remark.role}</span>
                  </p>
                  <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{remark.createdAt}</span>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">{remark.message}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

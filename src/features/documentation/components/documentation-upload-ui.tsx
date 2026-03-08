import { FileUp, Link2, Tag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { UploadQueueItem } from "@/features/documentation/types/documentation";
import { cn } from "@/lib/utils";

const queueToneMap: Record<UploadQueueItem["status"], string> = {
  Ready: "bg-emerald-500",
  Processing: "bg-accent",
  Blocked: "bg-rose-500",
};

export function DocumentationUploadUi({ queue }: { queue: UploadQueueItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Upload workspace</CardDescription>
        <CardTitle>Drop files or stage records</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-[calc(var(--radius)+0.1rem)] border border-dashed border-border bg-[linear-gradient(160deg,rgba(245,239,228,0.75),rgba(255,255,255,0.96))] p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <FileUp className="size-5" />
              </div>
              <h3 className="text-xl text-foreground">Upload documentation package</h3>
              <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                Prepare image evidence, manuals, checklists, and supporting PDFs with enough linked context for later retrieval.
              </p>
            </div>
            <Button type="button">Select files</Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Link to asset or work order</span>
            <Input placeholder="GEN-104 or MW-204" />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Tags</span>
            <Input placeholder="Electrical, Inspection, Approved" />
          </label>
        </div>

        <div className="grid gap-3">
          {queue.map((item) => (
            <div key={item.id} className="rounded-[calc(var(--radius)-0.15rem)] border border-border/70 bg-background/70 p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">{item.name}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    <span>{item.type}</span>
                    <span>{item.size}</span>
                    <span>{item.status}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Link2 className="size-4" />
                    Link ready
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Tag className="size-4" />
                    Tagged
                  </span>
                </div>
              </div>
              <div className="mt-4 h-2 rounded-full bg-muted">
                <div className={cn("h-2 rounded-full transition-all", queueToneMap[item.status])} style={{ width: `${item.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

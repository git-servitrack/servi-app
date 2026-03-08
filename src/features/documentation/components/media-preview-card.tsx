import { FileImage, FileSpreadsheet, FileText, Images } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DocumentationFile } from "@/features/documentation/types/documentation";

const iconMap = {
  Image: Images,
  PDF: FileText,
  Manual: FileText,
  Checklist: FileSpreadsheet,
} as const;

export function MediaPreviewCard({ file }: { file: DocumentationFile }) {
  const Icon = iconMap[file.type] ?? FileImage;

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-border/70 bg-[radial-gradient(circle_at_top_left,rgba(23,78,79,0.18),transparent_55%),linear-gradient(160deg,rgba(244,237,225,0.88),rgba(255,255,255,0.98))] p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Icon className="size-5" />
          </div>
          <Badge variant={file.status === "Verified" ? "default" : "secondary"}>{file.status}</Badge>
        </div>
        <div className="mt-8 rounded-[calc(var(--radius)-0.15rem)] border border-white/60 bg-white/70 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Preview</p>
          <p className="mt-2 text-lg font-medium text-foreground">{file.previewLabel}</p>
        </div>
      </div>
      <CardHeader>
        <CardDescription>{file.type}</CardDescription>
        <CardTitle className="text-xl">{file.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-muted-foreground">{file.summary}</p>
        <div className="flex flex-wrap gap-2">
          {file.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">Preview file</Button>
          </DialogTrigger>
          <DialogContent className="w-[min(94vw,48rem)]">
            <DialogHeader>
              <DialogTitle>{file.title}</DialogTitle>
              <DialogDescription>{file.summary}</DialogDescription>
            </DialogHeader>
            <div className="rounded-[calc(var(--radius)+0.1rem)] border border-border bg-[linear-gradient(160deg,rgba(244,237,225,0.7),rgba(255,255,255,1))] p-6">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <Icon className="size-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{file.fileName}</p>
                  <p className="text-sm text-muted-foreground">{file.size} · {file.uploadedAt}</p>
                </div>
              </div>
              <div className="mt-6 rounded-[calc(var(--radius)-0.15rem)] border border-dashed border-border bg-background/85 p-8 text-center">
                <p className="text-sm leading-6 text-muted-foreground">
                  Preview rendering is intentionally static in Phase 9. Connect this dialog to signed file URLs or blob previews during backend upload integration.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

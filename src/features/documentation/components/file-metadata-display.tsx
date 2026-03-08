import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DocumentationFile } from "@/features/documentation/types/documentation";

export function FileMetadataDisplay({ file }: { file: DocumentationFile }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>File metadata</CardDescription>
        <CardTitle>{file.fileName}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        {[
          { label: "File type", value: file.type },
          { label: "File size", value: file.size },
          { label: "Uploaded by", value: file.uploadedBy },
          { label: "Uploaded at", value: file.uploadedAt },
          { label: "Status", value: file.status },
        ].map((item) => (
          <div key={item.label} className="rounded-[calc(var(--radius)-0.15rem)] border border-border/70 bg-background/65 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
            <p className="mt-2 text-sm font-medium text-foreground">{item.value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

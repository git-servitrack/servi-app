import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DocumentationFile } from "@/features/documentation/types/documentation";

export function LinkedDocumentationSection({ files }: { files: DocumentationFile[] }) {
  return (
    <div className="grid gap-4">
      {files.map((file) => (
        <Card key={file.id}>
          <CardHeader className="pb-3">
            <CardDescription>{file.type}</CardDescription>
            <CardTitle className="text-xl">{file.title}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {file.links.map((link) => (
              <div key={`${file.id}-${link.label}`} className="rounded-[calc(var(--radius)-0.15rem)] border border-border/70 bg-background/65 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{link.label}</p>
                <p className="mt-2 text-sm font-medium text-foreground">{link.value}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

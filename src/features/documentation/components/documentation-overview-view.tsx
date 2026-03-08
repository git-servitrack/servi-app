import { FolderOpen, Upload } from "lucide-react";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { documentationFiles, uploadQueueItems, uploadValidationItems } from "@/features/documentation/data/documentation";
import { DocumentationUploadUi } from "@/features/documentation/components/documentation-upload-ui";
import { FileGalleryGrid } from "@/features/documentation/components/file-gallery-grid";
import { FileMetadataDisplay } from "@/features/documentation/components/file-metadata-display";
import { LinkedDocumentationSection } from "@/features/documentation/components/linked-documentation-section";
import { UploadValidationFeedback } from "@/features/documentation/components/upload-validation-feedback";

export function DocumentationOverviewView() {
  const featuredFile = documentationFiles[0];

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Documentation Module"
        title="Documentation workspace"
        description="Stage uploads, review file quality, and keep linked operational documents readable before the storage and signed-URL backend arrives."
        actions={
          <>
            <Badge variant="accent">{documentationFiles.length} active records</Badge>
            <Button type="button" variant="outline">
              <Upload className="size-4" />
              Upload batch
            </Button>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            label: "Verified files",
            value: documentationFiles.filter((item) => item.status === "Verified").length.toString(),
            hint: "Ready for operational reference",
          },
          {
            label: "Pending review",
            value: documentationFiles.filter((item) => item.status === "Pending Review").length.toString(),
            hint: "Needs validation or approval",
          },
          {
            label: "Queued uploads",
            value: uploadQueueItems.length.toString(),
            hint: "Current staged items in upload flow",
          },
        ].map((item) => (
          <Card key={item.label}>
            <CardHeader>
              <CardDescription>{item.label}</CardDescription>
              <CardTitle className="text-4xl">{item.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">{item.hint}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <SectionWrapper title="Upload staging" description="Use one shared upload surface so later validation, storage, and linking flows can connect without changing the page contract.">
          <DocumentationUploadUi queue={uploadQueueItems} />
        </SectionWrapper>

        <SectionWrapper title="Validation and metadata" description="Keep validation feedback and metadata visible together so operators can correct issues before the backend rejects files.">
          <UploadValidationFeedback items={uploadValidationItems} />
          <FileMetadataDisplay file={featuredFile} />
        </SectionWrapper>
      </div>

      <SectionWrapper
        title="File gallery"
        description="Preview cards keep uploaded records scannable across mixed file types while preserving room for later file thumbnails and signed-link previews."
        actions={
          <Button type="button" variant="ghost" className="px-0 text-muted-foreground hover:text-foreground">
            <FolderOpen className="size-4" />
            Browse library
          </Button>
        }
      >
        <FileGalleryGrid files={documentationFiles} />
      </SectionWrapper>

      <SectionWrapper
        title="Linked documentation"
        description="Operational links show where each file belongs without forcing users to open a separate detail page for routine context checks."
      >
        <LinkedDocumentationSection files={documentationFiles} />
      </SectionWrapper>
    </PageContainer>
  );
}

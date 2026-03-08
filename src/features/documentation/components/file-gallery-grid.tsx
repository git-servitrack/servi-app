import type { DocumentationFile } from "@/features/documentation/types/documentation";
import { MediaPreviewCard } from "@/features/documentation/components/media-preview-card";

export function FileGalleryGrid({ files }: { files: DocumentationFile[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {files.map((file) => (
        <MediaPreviewCard key={file.id} file={file} />
      ))}
    </div>
  );
}

export type DocumentationFileType = "Image" | "PDF" | "Manual" | "Checklist";
export type UploadValidationLevel = "success" | "warning" | "error";

export interface DocumentationLink {
  label: string;
  value: string;
}

export interface DocumentationFile {
  id: string;
  title: string;
  fileName: string;
  type: DocumentationFileType;
  size: string;
  uploadedAt: string;
  uploadedBy: string;
  status: "Verified" | "Pending Review";
  summary: string;
  previewLabel: string;
  tags: string[];
  links: DocumentationLink[];
}

export interface UploadValidationItem {
  id: string;
  label: string;
  message: string;
  level: UploadValidationLevel;
}

export interface UploadQueueItem {
  id: string;
  name: string;
  type: DocumentationFileType;
  size: string;
  progress: number;
  status: "Ready" | "Processing" | "Blocked";
}

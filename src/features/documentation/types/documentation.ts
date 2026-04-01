/** Gallery accepts equipment photos only (PNG / JPEG in production). */
export type DocumentationFileType = "Image";

export type VisionSeverity = "Minor" | "Moderate" | "Critical";

export interface VisionFinding {
  label: string;
  confidence: number;
  detail: string;
}

/** Stored snapshot from a vision pass (simulated in UI until a model is wired). */
export interface DocumentationVisionAnalysis {
  applicable: boolean;
  severity?: VisionSeverity;
  modelProfile?: string;
  analyzedAt?: string;
  summary?: string;
  findings?: VisionFinding[];
  actions?: string[];
  /** When applicable is false — e.g. queued, model not run */
  skipReason?: string;
}

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
  visionAnalysis: DocumentationVisionAnalysis;
}

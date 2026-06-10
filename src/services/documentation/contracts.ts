import type {
  DocumentationFile,
  DocumentationPurpose,
  DocumentationRelatedModel,
  DocumentationStatus,
  DocumentationUploadValues,
} from "@/features/documentation/types/documentation";
import type { ApiAuthUser } from "@/services/auth/session";

export interface ApiDocumentationRelatedRecord {
  _id: string;
  name?: string;
  code?: string;
  title?: string;
  workOrder?: string;
  site?: string;
}

export interface ApiDocumentationRecord {
  _id: string;
  title: string;
  fileName: string;
  originalName: string;
  type: "Image";
  mimeType: string;
  size: number;
  url: string;
  uploadedBy: string | Pick<ApiAuthUser, "_id" | "username" | "firstName" | "lastName" | "email">;
  status: DocumentationStatus;
  summary?: string;
  purpose: DocumentationPurpose;
  tags?: string[];
  relatedTo: {
    model: DocumentationRelatedModel;
    id: string | ApiDocumentationRelatedRecord;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface DocumentationUploadResponse {
  file: DocumentationFile;
  message: string;
}

export type DocumentationSearchPayload = Partial<{
  _id: string;
  title: string;
  status: DocumentationStatus;
  purpose: DocumentationPurpose;
  "relatedTo.model": DocumentationRelatedModel;
  "relatedTo.id": string;
}>;

export type DocumentationUploadPayload = DocumentationUploadValues;

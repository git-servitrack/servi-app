import type { DocumentationFile, DocumentationUploadValues } from "@/features/documentation/types/documentation";
import type { ApiAuthUser } from "@/services/auth/session";
import type { ApiDocumentationRecord } from "@/services/documentation/contracts";

export type ApiDamageSeverityLevel = "Low" | "Medium" | "High" | "Critical";
export type ApiDamageDetectionStatus = "Detected" | "No Damage" | "Low Confidence" | "Failed";

export interface ApiDamageDetectionScore {
  label: string;
  confidence: number;
}

export interface ApiDamageDetectionRecord {
  _id: string;
  mediaFile: string | Pick<ApiDocumentationRecord, "_id" | "title" | "url" | "purpose">;
  asset?: string;
  serviceRequest?: string;
  maintenance?: string;
  modelName: string;
  modelVersion: string;
  modelPath: string;
  topLabel: string;
  confidenceScore: number;
  allPredictions: ApiDamageDetectionScore[];
  severityLevel: ApiDamageSeverityLevel;
  detectedDamageLabels: string[];
  suggestedMaintenanceAction: string;
  status: ApiDamageDetectionStatus;
  errorMessage?: string;
  createdBy: string | Pick<ApiAuthUser, "_id" | "username" | "firstName" | "lastName" | "email">;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiDamageUploadAnalyzeData {
  mediaFile: ApiDocumentationRecord;
  damageDetection: ApiDamageDetectionRecord | null;
}

export type DamageUploadAnalyzePayload = Omit<DocumentationUploadValues, "purpose">;

export interface DamageUploadAnalyzeResponse {
  file: DocumentationFile;
  damageDetection: ApiDamageDetectionRecord | null;
  message: string;
}

export type DamageDetectionSearchPayload = Partial<{
  _id: string;
  mediaFile: string;
  asset: string;
  serviceRequest: string;
  maintenance: string;
  topLabel: string;
  severityLevel: ApiDamageSeverityLevel;
  status: ApiDamageDetectionStatus;
}>;

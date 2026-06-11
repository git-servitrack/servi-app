import type {
  PredictiveFeatureSnapshot,
  PredictiveMaintenanceRecord,
  PredictivePredictionResult,
  PredictiveTrainingResult,
} from "@/features/predictive-maintenance/types/predictive-maintenance";
import type { ApiAssetRecord } from "@/services/assets/contracts";
import type { ApiAuthUser } from "@/services/auth/session";
import type { ApiMaintenanceRecord } from "@/services/maintenance/contracts";
import type { ApiServiceRequestRecord } from "@/services/service-requests/contracts";

export interface ApiPredictiveMaintenanceRecord {
  _id: string;
  asset?: string | Pick<ApiAssetRecord, "_id" | "name" | "code" | "site">;
  maintenance?: string | Pick<ApiMaintenanceRecord, "_id" | "workOrder">;
  serviceRequest?: string | Pick<ApiServiceRequestRecord, "_id" | "title">;
  modelVersion: string;
  sourceDataset: string;
  inputFeatures: PredictiveFeatureSnapshot;
  prediction: PredictivePredictionResult;
  explanation: {
    summary: string;
    factors: string[];
    modelMetrics?: Record<string, unknown>;
  };
  featureSnapshot?: Record<string, unknown>;
  createdBy: string | Pick<ApiAuthUser, "_id" | "username" | "firstName" | "lastName" | "email">;
  createdAt?: string;
  updatedAt?: string;
}

export interface PredictiveFeaturePayload extends PredictiveFeatureSnapshot {
  asset?: string;
  maintenance?: string;
  serviceRequest?: string;
}

export type AssetPredictiveFeaturePayload = Omit<PredictiveFeaturePayload, "asset">;

export interface PredictiveTrainPayload {
  datasetPath?: string;
  validationRatio?: number;
  maxDepth?: number;
  minNumSamples?: number;
}

export interface PredictiveMutationResponse {
  prediction: PredictiveMaintenanceRecord;
  message: string;
}

export interface PredictiveTrainingResponse {
  training: PredictiveTrainingResult;
  message: string;
}

export type PredictiveSearchPayload = Partial<{
  _id: string;
  asset: string;
  maintenance: string;
  serviceRequest: string;
  "prediction.riskLevel": PredictivePredictionResult["riskLevel"];
  "prediction.failureType": string;
}>;

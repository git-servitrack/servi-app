export type PredictiveMachineType = "L" | "M" | "H";
export type PredictiveRiskLevel = "Low" | "Medium" | "High" | "Critical";

export interface PredictiveFeatureValues {
  type: PredictiveMachineType;
  airTemperature: string;
  processTemperature: string;
  rotationalSpeed: string;
  torque: string;
  toolWear: string;
  assetId: string;
}

export interface PredictiveFeatureSnapshot {
  type: PredictiveMachineType;
  airTemperature: number;
  processTemperature: number;
  rotationalSpeed: number;
  torque: number;
  toolWear: number;
}

export interface PredictivePredictionResult {
  target: 0 | 1;
  hasFailureRisk: boolean;
  failureType: string;
  riskLevel: PredictiveRiskLevel;
  riskScore: number;
  failureLikelihood: number;
  recommendedMaintenanceWindow: string;
  nextMaintenanceRecommendation: string;
}

export interface PredictiveExplanation {
  summary: string;
  factors: string[];
  modelMetrics?: Record<string, unknown>;
}

export interface PredictiveMaintenanceRecord {
  id: string;
  assetId?: string;
  assetName: string;
  maintenanceId?: string;
  serviceRequestId?: string;
  modelVersion: string;
  sourceDataset: string;
  inputFeatures: PredictiveFeatureSnapshot;
  prediction: PredictivePredictionResult;
  explanation: PredictiveExplanation;
  createdBy: string;
  createdAt: string;
}

export interface PredictiveAssetOption {
  id: string;
  name: string;
  code: string;
  site: string;
}

export interface PredictiveTrainValues {
  validationRatio: string;
  maxDepth: string;
  minNumSamples: string;
}

export interface PredictiveTrainingResult {
  version: string;
  trainedAt: string;
  datasetPath: string;
  featureColumns: string[];
  metrics: {
    rowCount: number;
    trainingRows: number;
    validationRows: number;
    targetAccuracy: number;
    failureTypeAccuracy: number;
    targetDistribution: Record<string, number>;
    failureTypeDistribution: Record<string, number>;
  };
}

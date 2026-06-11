import type { AssetRecord } from "@/features/assets/types/assets";
import type {
  PredictiveAssetOption,
  PredictiveFeatureValues,
  PredictiveMaintenanceRecord,
  PredictiveTrainValues,
} from "@/features/predictive-maintenance/types/predictive-maintenance";
import { assetsService } from "@/services/assets/assets.service";
import { createApiResult, requestEnvelope, requestJson } from "@/services/http/client";
import type { ApiResult, QueryParams } from "@/services/http/types";
import type {
  ApiPredictiveMaintenanceRecord,
  AssetPredictiveFeaturePayload,
  PredictiveFeaturePayload,
  PredictiveMutationResponse,
  PredictiveSearchPayload,
  PredictiveTrainPayload,
  PredictiveTrainingResponse,
} from "@/services/predictive-maintenance/contracts";

const PREDICTIVE_FIELDS = [
  "_id",
  "asset",
  "maintenance",
  "serviceRequest",
  "modelVersion",
  "sourceDataset",
  "inputFeatures",
  "prediction",
  "explanation",
  "createdBy",
  "createdAt",
  "updatedAt",
].join(",");

const PREDICTIVE_POPULATE = [
  "asset.name",
  "asset.code",
  "asset.site",
  "maintenance.workOrder",
  "serviceRequest.title",
  "createdBy.username",
  "createdBy.firstName",
  "createdBy.lastName",
  "createdBy.email",
].join(",");

function formatDateTime(value?: string) {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getPersonName(person: ApiPredictiveMaintenanceRecord["createdBy"]) {
  if (typeof person === "string") return "System user";

  return [person.firstName, person.lastName].filter(Boolean).join(" ") || person.username || person.email;
}

function getLinkedId<T extends { _id: string }>(value?: string | T) {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  return value._id;
}

function getAssetName(asset?: ApiPredictiveMaintenanceRecord["asset"]) {
  if (!asset) return "Manual reading";
  if (typeof asset === "string") return `Asset ${asset.slice(-6).toUpperCase()}`;
  return [asset.name, asset.code ? `(${asset.code})` : ""].filter(Boolean).join(" ");
}

function mapApiPredictionToRecord(item: ApiPredictiveMaintenanceRecord): PredictiveMaintenanceRecord {
  return {
    id: item._id,
    assetId: getLinkedId(item.asset),
    assetName: getAssetName(item.asset),
    maintenanceId: getLinkedId(item.maintenance),
    serviceRequestId: getLinkedId(item.serviceRequest),
    modelVersion: item.modelVersion,
    sourceDataset: item.sourceDataset,
    inputFeatures: item.inputFeatures,
    prediction: item.prediction,
    explanation: item.explanation,
    createdBy: getPersonName(item.createdBy),
    createdAt: formatDateTime(item.createdAt),
  };
}

function toNumber(value: string) {
  return Number(value);
}

function mapFeatureValues(values: PredictiveFeatureValues): PredictiveFeaturePayload {
  return {
    type: values.type,
    airTemperature: toNumber(values.airTemperature),
    processTemperature: toNumber(values.processTemperature),
    rotationalSpeed: toNumber(values.rotationalSpeed),
    torque: toNumber(values.torque),
    toolWear: toNumber(values.toolWear),
  };
}

function buildPredictiveQuery(query?: QueryParams): QueryParams {
  return {
    fields: PREDICTIVE_FIELDS,
    populate: PREDICTIVE_POPULATE,
    limit: 20,
    sort: "createdAt",
    order: "desc",
    ...query,
  };
}

function mapAssetOption(asset: AssetRecord): PredictiveAssetOption {
  return {
    id: asset.id,
    name: asset.name,
    code: asset.code,
    site: asset.site,
  };
}

function optionalNumber(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return Number(trimmed);
}

function mapTrainValues(values: PredictiveTrainValues): PredictiveTrainPayload {
  return {
    validationRatio: optionalNumber(values.validationRatio),
    maxDepth: optionalNumber(values.maxDepth),
    minNumSamples: optionalNumber(values.minNumSamples),
  };
}

function mapMutationResponse(message: string, item: ApiPredictiveMaintenanceRecord | null): PredictiveMutationResponse {
  if (!item) {
    throw new Error("Predictive maintenance response did not include result data.");
  }

  return {
    prediction: mapApiPredictionToRecord(item),
    message,
  };
}

export const predictiveMaintenanceService = {
  async list(query?: QueryParams): Promise<ApiResult<PredictiveMaintenanceRecord[]>> {
    return createApiResult(async () => {
      const predictions = await requestJson<ApiPredictiveMaintenanceRecord[]>("/predictive-maintenance", {
        query: buildPredictiveQuery(query),
      });

      return predictions.map(mapApiPredictionToRecord);
    });
  },

  async listByAsset(assetId: string): Promise<ApiResult<PredictiveMaintenanceRecord[]>> {
    return this.list({
      filter: `asset:${assetId}`,
      limit: 5,
    });
  },

  async listByServiceRequest(serviceRequestId: string): Promise<ApiResult<PredictiveMaintenanceRecord[]>> {
    return this.list({
      filter: `serviceRequest:${serviceRequestId}`,
      limit: 5,
    });
  },

  async listByMaintenance(maintenanceId: string): Promise<ApiResult<PredictiveMaintenanceRecord[]>> {
    return this.list({
      filter: `maintenance:${maintenanceId}`,
      limit: 5,
    });
  },

  async highRisk(limit = 5): Promise<ApiResult<PredictiveMaintenanceRecord[]>> {
    return this.list({
      filter: "prediction.riskLevel:Critical",
      limit,
    });
  },

  async getById(predictionId: string): Promise<ApiResult<PredictiveMaintenanceRecord>> {
    return createApiResult(async () => {
      const prediction = await requestJson<ApiPredictiveMaintenanceRecord>(`/predictive-maintenance/${predictionId}`, {
        query: {
          fields: PREDICTIVE_FIELDS,
          populate: PREDICTIVE_POPULATE,
        },
      });

      return mapApiPredictionToRecord(prediction);
    });
  },

  async search(payload: PredictiveSearchPayload): Promise<ApiResult<PredictiveMaintenanceRecord>> {
    return createApiResult(async () => {
      const prediction = await requestJson<ApiPredictiveMaintenanceRecord, PredictiveSearchPayload>("/predictive-maintenance/search", {
        method: "POST",
        body: payload,
        query: {
          fields: PREDICTIVE_FIELDS,
          populate: PREDICTIVE_POPULATE,
        },
      });

      return mapApiPredictionToRecord(prediction);
    });
  },

  async predict(values: PredictiveFeatureValues): Promise<ApiResult<PredictiveMutationResponse>> {
    return createApiResult(async () => {
      const result = await requestEnvelope<ApiPredictiveMaintenanceRecord, PredictiveFeaturePayload>("/predictive-maintenance/predict", {
        method: "POST",
        body: {
          ...mapFeatureValues(values),
          asset: values.assetId || undefined,
        },
      });

      return mapMutationResponse(result.message, result.data);
    });
  },

  async predictAsset(
    assetId: string,
    values: PredictiveFeatureValues,
  ): Promise<ApiResult<PredictiveMutationResponse>> {
    return createApiResult(async () => {
      const payload: AssetPredictiveFeaturePayload = mapFeatureValues(values);
      const result = await requestEnvelope<ApiPredictiveMaintenanceRecord, AssetPredictiveFeaturePayload>(
        `/predictive-maintenance/assets/${assetId}/predict`,
        {
          method: "POST",
          body: payload,
        },
      );

      return mapMutationResponse(result.message, result.data);
    });
  },

  async train(values: PredictiveTrainValues): Promise<ApiResult<PredictiveTrainingResponse>> {
    return createApiResult(async () => {
      const result = await requestEnvelope<PredictiveTrainingResponse["training"], PredictiveTrainPayload>(
        "/predictive-maintenance/train",
        {
          method: "POST",
          body: mapTrainValues(values),
        },
      );

      if (!result.data) {
        throw new Error("Predictive maintenance training response did not include model data.");
      }

      return {
        training: result.data,
        message: result.message,
      };
    });
  },

  async delete(predictionId: string): Promise<ApiResult<{ id: string; message: string }>> {
    return createApiResult(async () => {
      const result = await requestEnvelope<null>(`/predictive-maintenance/${predictionId}`, {
        method: "DELETE",
      });

      return {
        id: predictionId,
        message: result.message,
      };
    });
  },

  async assetOptions(): Promise<ApiResult<PredictiveAssetOption[]>> {
    return createApiResult(async () => {
      const assets = await assetsService.list();

      if (assets.error) throw assets.error;

      return assets.data.map(mapAssetOption);
    });
  },
};

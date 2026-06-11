import type { DocumentationFile } from "@/features/documentation/types/documentation";
import { createApiResult, requestEnvelope, requestFormData, requestJson } from "@/services/http/client";
import type { ApiResult, QueryParams } from "@/services/http/types";
import { mapApiDocumentationToFile } from "@/services/documentation/documentation.service";
import type {
  ApiDamageDetectionRecord,
  ApiDamageUploadAnalyzeData,
  DamageDetectionSearchPayload,
  DamageUploadAnalyzePayload,
  DamageUploadAnalyzeResponse,
} from "@/services/damage-detection/contracts";
import {
  DAMAGE_DETECTION_FIELDS,
  DAMAGE_DETECTION_POPULATE,
  mapApiDamageDetectionToVisionAnalysis,
} from "@/services/damage-detection/mappers";

function appendOptional(formData: FormData, key: string, value?: string) {
  const trimmed = value?.trim();
  if (trimmed) formData.append(key, trimmed);
}

function buildUploadAnalyzeFormData(payload: DamageUploadAnalyzePayload) {
  const formData = new FormData();

  formData.append("image", payload.image);
  appendOptional(formData, "title", payload.title);
  appendOptional(formData, "summary", payload.summary);
  appendOptional(formData, "tags", payload.tags);
  formData.append("relatedModel", payload.relatedModel);
  formData.append("relatedId", payload.relatedId);
  appendOptional(formData, "status", payload.status);

  return formData;
}

function buildDamageDetectionQuery(query?: QueryParams): QueryParams {
  return {
    fields: DAMAGE_DETECTION_FIELDS,
    populate: DAMAGE_DETECTION_POPULATE,
    limit: 20,
    sort: "createdAt",
    order: "desc",
    ...query,
  };
}

function mapUploadAnalyzeResponse(
  data: ApiDamageUploadAnalyzeData | null,
  message: string,
): DamageUploadAnalyzeResponse {
  if (!data?.mediaFile) {
    throw new Error("Damage upload response did not include media data.");
  }

  return {
    file: mapApiDocumentationToFile(data.mediaFile, data.damageDetection),
    damageDetection: data.damageDetection,
    message,
  };
}

export const damageDetectionService = {
  async list(query?: QueryParams): Promise<ApiResult<ApiDamageDetectionRecord[]>> {
    return createApiResult(async () =>
      requestJson<ApiDamageDetectionRecord[]>("/damage-detection", {
        query: buildDamageDetectionQuery(query),
      }),
    );
  },

  async getById(detectionId: string): Promise<ApiResult<ApiDamageDetectionRecord>> {
    return createApiResult(async () =>
      requestJson<ApiDamageDetectionRecord>(`/damage-detection/${detectionId}`, {
        query: {
          fields: DAMAGE_DETECTION_FIELDS,
          populate: DAMAGE_DETECTION_POPULATE,
        },
      }),
    );
  },

  async search(payload: DamageDetectionSearchPayload): Promise<ApiResult<ApiDamageDetectionRecord>> {
    return createApiResult(async () =>
      requestJson<ApiDamageDetectionRecord, DamageDetectionSearchPayload>("/damage-detection/search", {
        method: "POST",
        body: payload,
        query: {
          fields: DAMAGE_DETECTION_FIELDS,
          populate: DAMAGE_DETECTION_POPULATE,
        },
      }),
    );
  },

  async analyzeMediaFile(mediaFileId: string): Promise<ApiResult<ApiDamageDetectionRecord>> {
    return createApiResult(async () => {
      const result = await requestEnvelope<ApiDamageDetectionRecord>(`/damage-detection/media/${mediaFileId}/analyze`, {
        method: "POST",
      });

      if (!result.data) {
        throw new Error("Damage detection response did not include result data.");
      }

      return result.data;
    });
  },

  async uploadAndAnalyze(payload: DamageUploadAnalyzePayload): Promise<ApiResult<DamageUploadAnalyzeResponse>> {
    return createApiResult(async () => {
      const result = await requestFormData<ApiDamageUploadAnalyzeData>(
        "/damage-detection/upload-analyze",
        buildUploadAnalyzeFormData(payload),
      );

      return mapUploadAnalyzeResponse(result.data, result.message);
    });
  },

  toVisionAnalysis(record: ApiDamageDetectionRecord) {
    return mapApiDamageDetectionToVisionAnalysis(record);
  },

  toDocumentationFile(file: DocumentationFile, record: ApiDamageDetectionRecord): DocumentationFile {
    return {
      ...file,
      visionAnalysis: mapApiDamageDetectionToVisionAnalysis(record),
    };
  },
};

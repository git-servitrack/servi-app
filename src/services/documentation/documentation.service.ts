import type { AssetRecord } from "@/features/assets/types/assets";
import type { DocumentationFile, DocumentationRelatedOption, DocumentationUploadOptions } from "@/features/documentation/types/documentation";
import { assetsService } from "@/services/assets/assets.service";
import type { ApiDamageDetectionRecord } from "@/services/damage-detection/contracts";
import {
  DAMAGE_DETECTION_FIELDS,
  DAMAGE_DETECTION_POPULATE,
  getLatestDamageDetectionByMediaFile,
  mapApiDamageDetectionToVisionAnalysis,
} from "@/services/damage-detection/mappers";
import { createApiResult, requestEnvelope, requestFormData, requestJson } from "@/services/http/client";
import type { ApiResult, QueryParams } from "@/services/http/types";
import { maintenanceService } from "@/services/maintenance/maintenance.service";
import { serviceRequestsService } from "@/services/service-requests/service-requests.service";
import type {
  ApiDocumentationRecord,
  ApiDocumentationUploadData,
  DocumentationSearchPayload,
  DocumentationStatusUpdatePayload,
  DocumentationUploadPayload,
  DocumentationUploadResponse,
} from "@/services/documentation/contracts";

const DOCUMENTATION_FIELDS = [
  "_id",
  "title",
  "fileName",
  "originalName",
  "type",
  "mimeType",
  "size",
  "url",
  "uploadedBy",
  "status",
  "summary",
  "purpose",
  "tags",
  "relatedTo",
  "createdAt",
  "updatedAt",
].join(",");

const DOCUMENTATION_POPULATE = [
  "uploadedBy.username",
  "uploadedBy.firstName",
  "uploadedBy.lastName",
  "uploadedBy.email",
  "relatedTo.id.name",
  "relatedTo.id.code",
  "relatedTo.id.title",
  "relatedTo.id.workOrder",
  "relatedTo.id.site",
].join(",");

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "N/A";

  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;

  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

function formatDate(value?: string) {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getUserName(user: ApiDocumentationRecord["uploadedBy"]) {
  if (typeof user === "string") return "System user";

  return [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username || user.email;
}

function getRelatedLabel(item: ApiDocumentationRecord["relatedTo"]["id"]) {
  if (typeof item === "string") return item;

  return item.name || item.title || item.workOrder || item.code || item._id;
}

function getRelatedDetail(item: ApiDocumentationRecord["relatedTo"]["id"]) {
  if (typeof item === "string") return "";

  return [item.code, item.workOrder, item.site].filter(Boolean).join(" - ");
}

function getRelatedLinkLabel(model: ApiDocumentationRecord["relatedTo"]["model"]) {
  if (model === "Asset") return "Linked asset";
  if (model === "ServiceRequest") return "Service request";
  return "Maintenance job";
}

export function mapApiDocumentationToFile(
  file: ApiDocumentationRecord,
  damageDetection?: ApiDamageDetectionRecord | null,
): DocumentationFile {
  const relatedLabel = getRelatedLabel(file.relatedTo.id);
  const relatedDetail = getRelatedDetail(file.relatedTo.id);
  const summary = file.summary || "No documentation summary provided.";

  return {
    id: file._id,
    title: file.title,
    fileName: file.originalName || file.fileName,
    type: file.type,
    size: formatBytes(file.size),
    url: file.url,
    uploadedAt: formatDate(file.createdAt),
    uploadedBy: getUserName(file.uploadedBy),
    status: file.status,
    summary,
    purpose: file.purpose,
    previewLabel: file.purpose,
    tags: file.tags ?? [],
    links: [
      {
        label: getRelatedLinkLabel(file.relatedTo.model),
        value: relatedDetail ? `${relatedLabel} (${relatedDetail})` : relatedLabel,
      },
    ],
    visionAnalysis: mapApiDamageDetectionToVisionAnalysis(damageDetection),
  };
}

function buildDocumentationQuery(query?: QueryParams): QueryParams {
  return {
    fields: DOCUMENTATION_FIELDS,
    populate: DOCUMENTATION_POPULATE,
    limit: 100,
    sort: "createdAt",
    order: "desc",
    ...query,
  };
}

function appendOptional(formData: FormData, key: string, value?: string) {
  const trimmed = value?.trim();
  if (trimmed) formData.append(key, trimmed);
}

function buildUploadFormData(payload: DocumentationUploadPayload) {
  const formData = new FormData();

  formData.append("image", payload.image);
  appendOptional(formData, "title", payload.title);
  appendOptional(formData, "summary", payload.summary);
  formData.append("purpose", payload.purpose);
  appendOptional(formData, "tags", payload.tags);
  formData.append("relatedModel", payload.relatedModel);
  formData.append("relatedId", payload.relatedId);
  appendOptional(formData, "status", payload.status);

  return formData;
}

function getUploadMediaFile(data: ApiDocumentationUploadData): ApiDocumentationRecord {
  return "mediaFile" in data ? data.mediaFile : data;
}

function getUploadDamageDetection(data: ApiDocumentationUploadData): ApiDamageDetectionRecord | null {
  return "mediaFile" in data ? data.damageDetection : null;
}

async function getRecentDamageDetections(query?: QueryParams) {
  return requestJson<ApiDamageDetectionRecord[]>("/damage-detection", {
    query: {
      fields: DAMAGE_DETECTION_FIELDS,
      populate: DAMAGE_DETECTION_POPULATE,
      limit: 100,
      sort: "createdAt",
      order: "desc",
      ...query,
    },
  });
}

function mapAssetOption(asset: AssetRecord): DocumentationRelatedOption {
  return {
    id: asset.id,
    label: asset.name,
    detail: [asset.code, asset.site].filter(Boolean).join(" - "),
  };
}

export const documentationService = {
  async list(query?: QueryParams): Promise<ApiResult<DocumentationFile[]>> {
    return createApiResult(async () => {
      const [files, detections] = await Promise.all([
        requestJson<ApiDocumentationRecord[]>("/documentation", {
          query: buildDocumentationQuery(query),
        }),
        getRecentDamageDetections(),
      ]);
      const detectionsByMediaFile = getLatestDamageDetectionByMediaFile(detections);

      return files.map((file) => mapApiDocumentationToFile(file, detectionsByMediaFile.get(file._id)));
    });
  },

  async getById(fileId: string): Promise<ApiResult<DocumentationFile>> {
    return createApiResult(async () => {
      const [file, detections] = await Promise.all([
        requestJson<ApiDocumentationRecord>(`/documentation/${fileId}`, {
          query: {
            fields: DOCUMENTATION_FIELDS,
            populate: DOCUMENTATION_POPULATE,
          },
        }),
        getRecentDamageDetections({
          filter: `mediaFile:${fileId}`,
          limit: 1,
        }),
      ]);

      return mapApiDocumentationToFile(file, detections[0]);
    });
  },

  async search(payload: DocumentationSearchPayload): Promise<ApiResult<DocumentationFile>> {
    return createApiResult(async () => {
      const file = await requestJson<ApiDocumentationRecord, DocumentationSearchPayload>("/documentation/search", {
        method: "POST",
        body: payload,
        query: {
          fields: DOCUMENTATION_FIELDS,
          populate: DOCUMENTATION_POPULATE,
        },
      });

      return mapApiDocumentationToFile(file);
    });
  },

  async upload(payload: DocumentationUploadPayload): Promise<ApiResult<DocumentationUploadResponse>> {
    return createApiResult(async () => {
      const result = await requestFormData<ApiDocumentationUploadData>(
        "/documentation/upload",
        buildUploadFormData(payload),
      );

      if (!result.data) {
        throw new Error("Documentation upload response did not include file data.");
      }
      const mediaFile = getUploadMediaFile(result.data);
      const damageDetection = getUploadDamageDetection(result.data);

      return {
        file: mapApiDocumentationToFile(mediaFile, damageDetection),
        damageDetection,
        message: result.message,
      };
    });
  },

  async updateStatus(
    fileId: string,
    status: DocumentationUploadPayload["status"],
  ): Promise<ApiResult<DocumentationUploadResponse>> {
    return createApiResult(async () => {
      if (!status) {
        throw new Error("Choose a valid documentation status.");
      }

      const result = await requestEnvelope<ApiDocumentationRecord, DocumentationStatusUpdatePayload>(
        `/documentation/${fileId}/status`,
        {
          method: "PATCH",
          body: { status },
        },
      );

      if (!result.data) {
        throw new Error("Documentation status response did not include file data.");
      }

      return {
        file: mapApiDocumentationToFile(result.data),
        message: result.message,
      };
    });
  },

  async delete(fileId: string): Promise<ApiResult<{ id: string; message: string }>> {
    return createApiResult(async () => {
      const result = await requestEnvelope<null>(`/documentation/${fileId}`, {
        method: "DELETE",
      });

      return {
        id: fileId,
        message: result.message,
      };
    });
  },

  async uploadOptions(): Promise<ApiResult<DocumentationUploadOptions>> {
    return createApiResult(async () => {
      const [assetResult, requestResult, maintenanceResult] = await Promise.all([
        assetsService.list(),
        serviceRequestsService.list(),
        maintenanceService.list(),
      ]);

      if (assetResult.error) throw assetResult.error;
      if (requestResult.error) throw requestResult.error;
      if (maintenanceResult.error) throw maintenanceResult.error;

      return {
        Asset: assetResult.data.map(mapAssetOption),
        ServiceRequest: requestResult.data.map((request) => ({
          id: request.id,
          label: request.title,
          detail: [request.ticketNumber, request.site].filter(Boolean).join(" - "),
        })),
        Maintenance: maintenanceResult.data.map((maintenance) => ({
          id: maintenance.id,
          label: maintenance.workOrder,
          detail: [maintenance.assetName, maintenance.status].filter(Boolean).join(" - "),
        })),
      };
    });
  },
};

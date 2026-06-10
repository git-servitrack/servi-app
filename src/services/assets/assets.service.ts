import type {
  AssetCategoryOption,
  AssetRecord,
} from "@/features/assets/types/assets";
import { createApiResult, requestEnvelope, requestJson } from "@/services/http/client";
import type { ApiResult, QueryParams } from "@/services/http/types";
import type {
  ApiAssetPayload,
  ApiAssetRecord,
  ApiCategoryRecord,
  AssetMutationResponse,
  AssetUpsertPayload,
} from "@/services/assets/contracts";

const ASSET_FIELDS = [
  "_id",
  "name",
  "code",
  "category.name",
  "category.code",
  "category.isActive",
  "assetType",
  "site",
  "assignedTeam",
  "status",
  "criticality",
  "condition",
  "manufacturer",
  "model",
  "serialNumber",
  "quantity",
  "unitOfMeasure",
  "supplier",
  "acquisitionDate",
  "lastServiceDate",
  "nextServiceDate",
  "notes",
].join(",");

const CATEGORY_FIELDS = "_id,name,code,description,isActive";

function formatDate(value?: string) {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toISOString().slice(0, 10);
}

function normalizeCategory(category: ApiAssetRecord["category"]) {
  if (typeof category === "string") {
    return {
      id: category,
      name: "Uncategorized",
    };
  }

  return {
    id: category._id,
    name: category.name,
  };
}

function mapApiCategoryToOption(category: ApiCategoryRecord): AssetCategoryOption {
  return {
    id: category._id,
    name: category.name,
    code: category.code,
    description: category.description,
    isActive: category.isActive ?? true,
  };
}

function mapApiAssetToRecord(asset: ApiAssetRecord): AssetRecord {
  const category = normalizeCategory(asset.category);

  return {
    id: asset._id,
    name: asset.name,
    code: asset.code ?? asset._id.slice(-6).toUpperCase(),
    categoryId: category.id,
    category: category.name,
    assetType: asset.assetType,
    site: asset.site,
    assignedTeam: asset.assignedTeam,
    status: asset.status,
    criticality: asset.criticality,
    condition: asset.condition ?? "No condition summary provided.",
    lastServiceDate: formatDate(asset.lastServiceDate),
    nextServiceDate: formatDate(asset.nextServiceDate),
    manufacturer: asset.manufacturer,
    model: asset.model,
    serialNumber: asset.serialNumber,
    quantity: asset.quantity,
    unitOfMeasure: asset.unitOfMeasure,
    supplier: asset.supplier,
    acquisitionDate: formatDate(asset.acquisitionDate),
    notes: asset.notes ?? "No notes provided.",
  };
}

function optionalString(value?: string) {
  if (!value) return undefined;

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : undefined;
}

function optionalDate(value?: string) {
  return value && value.trim().length > 0 ? value : undefined;
}

function optionalNumber(value?: string) {
  if (!value || value.trim().length === 0) return undefined;
  return Number(value);
}

function mapPayloadToApiAsset(payload: AssetUpsertPayload, assetId?: string): ApiAssetPayload {
  return {
    ...(assetId ? { _id: assetId } : {}),
    name: payload.name,
    code: optionalString(payload.code),
    category: payload.category,
    assetType: optionalString(payload.assetType),
    site: payload.site,
    assignedTeam: payload.assignedTeam,
    status: payload.status,
    criticality: payload.criticality,
    condition: optionalString(payload.condition),
    manufacturer: payload.manufacturer,
    model: payload.model,
    serialNumber: payload.serialNumber,
    quantity: optionalNumber(payload.quantity),
    unitOfMeasure: optionalString(payload.unitOfMeasure),
    supplier: optionalString(payload.supplier),
    acquisitionDate: optionalDate(payload.acquisitionDate),
    lastServiceDate: optionalDate(payload.lastServiceDate),
    nextServiceDate: optionalDate(payload.nextServiceDate),
    notes: optionalString(payload.notes),
  };
}

function buildAssetQuery(query?: QueryParams): QueryParams {
  return {
    fields: ASSET_FIELDS,
    limit: 100,
    sort: "createdAt",
    order: "desc",
    ...query,
  };
}

export const assetsService = {
  async list(query?: QueryParams): Promise<ApiResult<AssetRecord[]>> {
    return createApiResult(async () => {
      const assets = await requestJson<ApiAssetRecord[]>("/asset", {
        query: buildAssetQuery(query),
      });

      return assets.map(mapApiAssetToRecord);
    });
  },

  async getById(assetId: string): Promise<ApiResult<AssetRecord>> {
    return createApiResult(async () => {
      const asset = await requestJson<ApiAssetRecord>(`/asset/${assetId}`, {
        query: {
          fields: ASSET_FIELDS,
        },
      });

      return mapApiAssetToRecord(asset);
    });
  },

  async categories(): Promise<ApiResult<AssetCategoryOption[]>> {
    return createApiResult(async () => {
      const categories = await requestJson<ApiCategoryRecord[]>("/category", {
        query: {
          fields: CATEGORY_FIELDS,
          limit: 100,
          sort: "name",
          order: "asc",
        },
      });

      return categories.map(mapApiCategoryToOption);
    });
  },

  async save(payload: AssetUpsertPayload, assetId?: string): Promise<ApiResult<AssetMutationResponse>> {
    return createApiResult(async () => {
      const result = await requestEnvelope<ApiAssetRecord, ApiAssetPayload>("/asset", {
        method: assetId ? "PUT" : "POST",
        body: mapPayloadToApiAsset(payload, assetId),
      });

      if (!result.data) {
        throw new Error("Asset response did not include record data.");
      }

      return {
        asset: mapApiAssetToRecord(result.data),
        message: result.message,
      };
    });
  },

  async delete(assetId: string): Promise<ApiResult<{ id: string; message: string }>> {
    return createApiResult(async () => {
      const result = await requestEnvelope<null>(`/asset/${assetId}`, {
        method: "DELETE",
      });

      return {
        id: assetId,
        message: result.message,
      };
    });
  },
};

import type { AssetRecord } from "@/features/assets/types/assets";
import type { CategoryRecord } from "@/features/categories/types/categories";
import type { MaintenanceRecord } from "@/features/maintenance/types/maintenance";
import type {
  PartUsageItem,
  SparePartAssetOption,
  SparePartCategoryOption,
  SparePartFormOptions,
  SparePartRecord,
  StockMovementItem,
  StockOperationValues,
} from "@/features/spare-parts/types/spare-parts";
import { assetsService } from "@/services/assets/assets.service";
import { categoriesService } from "@/services/categories/categories.service";
import { createApiResult, requestEnvelope, requestJson } from "@/services/http/client";
import type { ApiResult, QueryParams } from "@/services/http/types";
import { maintenanceService } from "@/services/maintenance/maintenance.service";
import type {
  ApiPartUsageRecord,
  ApiPartUsageResult,
  ApiSparePartPayload,
  ApiSparePartRecord,
  ApiStockMovementRecord,
  ApiStockOperationResult,
  PartUsageMutationResponse,
  PartUsagePayload,
  SparePartMutationResponse,
  SparePartUpsertPayload,
  StockOperationPayload,
  StockOperationResponse,
} from "@/services/spare-parts/contracts";

const SPARE_PART_FIELDS = [
  "_id",
  "partNumber",
  "name",
  "category.name",
  "category.code",
  "category.isActive",
  "site",
  "compatibleAssets.name",
  "compatibleAssets.code",
  "unit",
  "stockOnHand",
  "reservedStock",
  "reorderPoint",
  "status",
  "binLocation",
  "supplier",
  "notes",
].join(",");

const STOCK_MOVEMENT_FIELDS = "_id,type,quantity,reference,note,createdAt";

const PART_USAGE_FIELDS = [
  "_id",
  "maintenanceJob.workOrder",
  "asset.name",
  "asset.code",
  "technician.username",
  "technician.firstName",
  "technician.lastName",
  "technician.email",
  "quantity",
  "unit",
  "note",
  "usedAt",
  "createdAt",
].join(",");

function optionalString(value: string) {
  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : undefined;
}

function formatDateTime(value?: string) {
  if (!value) return "Not dated";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toISOString().slice(0, 16);
}

function normalizeCategory(category: ApiSparePartRecord["category"]) {
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

function normalizeAsset(asset: NonNullable<ApiSparePartRecord["compatibleAssets"]>[number]) {
  if (typeof asset === "string") {
    return {
      id: asset,
      label: `Asset ${asset.slice(-6).toUpperCase()}`,
    };
  }

  return {
    id: asset._id,
    label: asset.code ? `${asset.name} (${asset.code})` : asset.name,
  };
}

function getPersonName(person: ApiPartUsageRecord["technician"]) {
  if (typeof person === "string") {
    return `User ${person.slice(-6).toUpperCase()}`;
  }

  return [person.firstName, person.lastName].filter(Boolean).join(" ") || person.username || person.email;
}

function getMaintenanceLabel(maintenanceJob: ApiPartUsageRecord["maintenanceJob"]) {
  if (typeof maintenanceJob === "string") {
    return `MW-${maintenanceJob.slice(-6).toUpperCase()}`;
  }

  return maintenanceJob.workOrder;
}

function getAssetLabel(asset: ApiPartUsageRecord["asset"]) {
  if (typeof asset === "string") {
    return `Asset ${asset.slice(-6).toUpperCase()}`;
  }

  return asset.code ? `${asset.name} (${asset.code})` : asset.name;
}

function mapStockMovement(item: ApiStockMovementRecord): StockMovementItem {
  const quantity = item.quantity > 0 ? `+${item.quantity}` : item.quantity.toString();

  return {
    id: item._id,
    date: formatDateTime(item.createdAt),
    type: item.type,
    quantity,
    reference: item.reference,
    note: item.note ?? "",
  };
}

function mapPartUsage(item: ApiPartUsageRecord): PartUsageItem {
  return {
    id: item._id,
    workOrder: getMaintenanceLabel(item.maintenanceJob),
    asset: getAssetLabel(item.asset),
    quantity: `${item.quantity} ${item.unit}`,
    date: formatDateTime(item.usedAt ?? item.createdAt),
    technician: getPersonName(item.technician),
  };
}

function mapApiSparePartToRecord(
  part: ApiSparePartRecord,
  options: {
    movements?: StockMovementItem[];
    usage?: PartUsageItem[];
  } = {},
): SparePartRecord {
  const category = normalizeCategory(part.category);
  const compatibleAssets = part.compatibleAssets ?? [];
  const normalizedAssets = compatibleAssets.map(normalizeAsset);

  return {
    id: part._id,
    partNumber: part.partNumber,
    name: part.name,
    categoryId: category.id,
    category: category.name,
    site: part.site,
    compatibleAssetIds: normalizedAssets.map((asset) => asset.id),
    compatibleAssets: normalizedAssets.length > 0
      ? normalizedAssets.map((asset) => asset.label).join(", ")
      : "No compatible assets assigned",
    unit: part.unit,
    stockOnHand: part.stockOnHand,
    reservedStock: part.reservedStock,
    reorderPoint: part.reorderPoint,
    status: part.status,
    binLocation: part.binLocation,
    supplier: part.supplier,
    notes: part.notes ?? "",
    movements: options.movements ?? [],
    usage: options.usage ?? [],
  };
}

function toNumber(value: string) {
  return Number(value);
}

function mapPayloadToApiSparePart(payload: SparePartUpsertPayload, partId?: string): ApiSparePartPayload {
  return {
    ...(partId ? { _id: partId } : {}),
    partNumber: payload.partNumber,
    name: payload.name,
    category: payload.category,
    site: payload.site,
    compatibleAssets: payload.compatibleAssets,
    unit: payload.unit,
    stockOnHand: toNumber(payload.stockOnHand),
    reservedStock: toNumber(payload.reservedStock),
    reorderPoint: toNumber(payload.reorderPoint),
    binLocation: payload.binLocation,
    supplier: payload.supplier,
    notes: optionalString(payload.notes),
  };
}

function buildSparePartQuery(query?: QueryParams): QueryParams {
  return {
    fields: SPARE_PART_FIELDS,
    limit: 100,
    sort: "createdAt",
    order: "desc",
    ...query,
  };
}

function mapCategoryOption(category: CategoryRecord): SparePartCategoryOption {
  return {
    id: category.id,
    name: category.name,
    isActive: category.isActive,
  };
}

function mapAssetOption(asset: AssetRecord): SparePartAssetOption {
  return {
    id: asset.id,
    name: asset.name,
    code: asset.code,
    site: asset.site,
  };
}

function mapMaintenanceOption(job: MaintenanceRecord) {
  return {
    id: job.id,
    workOrder: job.workOrder,
    assetName: job.assetName,
    technician: job.assignment.technician,
  };
}

async function getPartHistory(partId: string) {
  const [movementResult, usageResult] = await Promise.all([
    sparePartsService.stockMovements(partId),
    sparePartsService.partUsage(partId),
  ]);

  if (movementResult.error) throw movementResult.error;
  if (usageResult.error) throw usageResult.error;

  return {
    movements: movementResult.data,
    usage: usageResult.data,
  };
}

function mapStockOperationPayload(payload: StockOperationPayload) {
  return {
    quantity: toNumber(payload.quantity),
    reference: payload.reference,
    note: optionalString(payload.note),
  };
}

function getStockOperationPath(partId: string, operation: StockOperationValues["operation"]) {
  if (operation === "add") return `/spare-parts/${partId}/stock/add`;
  if (operation === "deduct") return `/spare-parts/${partId}/stock/deduct`;
  if (operation === "adjust") return `/spare-parts/${partId}/stock/adjust`;

  return `/spare-parts/${partId}/reserve`;
}

export const sparePartsService = {
  async list(query?: QueryParams): Promise<ApiResult<SparePartRecord[]>> {
    return createApiResult(async () => {
      const parts = await requestJson<ApiSparePartRecord[]>("/spare-parts", {
        query: buildSparePartQuery(query),
      });

      return parts.map((part) => mapApiSparePartToRecord(part));
    });
  },

  async lowStock(query?: QueryParams): Promise<ApiResult<SparePartRecord[]>> {
    return createApiResult(async () => {
      const parts = await requestJson<ApiSparePartRecord[]>("/spare-parts/low-stock", {
        query: buildSparePartQuery(query),
      });

      return parts.map((part) => mapApiSparePartToRecord(part));
    });
  },

  async getById(partId: string): Promise<ApiResult<SparePartRecord>> {
    return createApiResult(async () => {
      const [part, history] = await Promise.all([
        requestJson<ApiSparePartRecord>(`/spare-parts/${partId}`, {
          query: {
            fields: SPARE_PART_FIELDS,
          },
        }),
        getPartHistory(partId),
      ]);

      return mapApiSparePartToRecord(part, history);
    });
  },

  async formOptions(): Promise<ApiResult<SparePartFormOptions>> {
    return createApiResult(async () => {
      const [categoryResult, assetResult, maintenanceResult] = await Promise.all([
        categoriesService.list(),
        assetsService.list(),
        maintenanceService.list(),
      ]);

      if (categoryResult.error) throw categoryResult.error;
      if (assetResult.error) throw assetResult.error;
      if (maintenanceResult.error) throw maintenanceResult.error;

      return {
        categories: categoryResult.data.map(mapCategoryOption),
        assets: assetResult.data.map(mapAssetOption),
        maintenanceJobs: maintenanceResult.data.map(mapMaintenanceOption),
      };
    });
  },

  async stockMovements(partId: string): Promise<ApiResult<StockMovementItem[]>> {
    return createApiResult(async () => {
      const movements = await requestJson<ApiStockMovementRecord[]>(`/spare-parts/${partId}/movements`, {
        query: {
          fields: STOCK_MOVEMENT_FIELDS,
          limit: 100,
          sort: "createdAt",
          order: "desc",
        },
      });

      return movements.map(mapStockMovement);
    });
  },

  async partUsage(partId: string): Promise<ApiResult<PartUsageItem[]>> {
    return createApiResult(async () => {
      const usage = await requestJson<ApiPartUsageRecord[]>(`/spare-parts/${partId}/usage`, {
        query: {
          fields: PART_USAGE_FIELDS,
          limit: 100,
          sort: "usedAt",
          order: "desc",
        },
      });

      return usage.map(mapPartUsage);
    });
  },

  async save(payload: SparePartUpsertPayload, partId?: string): Promise<ApiResult<SparePartMutationResponse>> {
    return createApiResult(async () => {
      const result = await requestEnvelope<ApiSparePartRecord | ApiStockOperationResult, ApiSparePartPayload>("/spare-parts", {
        method: partId ? "PUT" : "POST",
        body: mapPayloadToApiSparePart(payload, partId),
      });

      if (!result.data) {
        throw new Error("Spare part response did not include record data.");
      }

      const part = "sparePart" in result.data ? result.data.sparePart : result.data;

      return {
        part: mapApiSparePartToRecord(part),
        message: result.message,
      };
    });
  },

  async delete(partId: string): Promise<ApiResult<{ id: string; message: string }>> {
    return createApiResult(async () => {
      const result = await requestEnvelope<null>(`/spare-parts/${partId}`, {
        method: "DELETE",
      });

      return {
        id: partId,
        message: result.message,
      };
    });
  },

  async stockOperation(partId: string, payload: StockOperationPayload): Promise<ApiResult<StockOperationResponse>> {
    return createApiResult(async () => {
      const result = await requestEnvelope<ApiStockOperationResult, ReturnType<typeof mapStockOperationPayload>>(
        getStockOperationPath(partId, payload.operation),
        {
          method: "PATCH",
          body: mapStockOperationPayload(payload),
        },
      );

      if (!result.data) {
        throw new Error("Stock operation response did not include record data.");
      }

      return {
        part: mapApiSparePartToRecord(result.data.sparePart),
        movement: mapStockMovement(result.data.movement),
        message: result.message,
      };
    });
  },

  async recordUsage(partId: string, payload: PartUsagePayload): Promise<ApiResult<PartUsageMutationResponse>> {
    return createApiResult(async () => {
      const result = await requestEnvelope<ApiPartUsageResult, {
        maintenanceJob: string;
        quantity: number;
        note?: string;
        usedAt?: string;
      }>(`/spare-parts/${partId}/usage`, {
        method: "POST",
        body: {
          maintenanceJob: payload.maintenanceJob,
          quantity: toNumber(payload.quantity),
          note: optionalString(payload.note),
          usedAt: optionalString(payload.usedAt),
        },
      });

      if (!result.data) {
        throw new Error("Part usage response did not include record data.");
      }

      return {
        part: mapApiSparePartToRecord(result.data.sparePart),
        usage: mapPartUsage(result.data.usage),
        movement: mapStockMovement(result.data.movement),
        message: result.message,
      };
    });
  },
};

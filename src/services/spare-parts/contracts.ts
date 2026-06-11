import type {
  PartUsageFormValues,
  PartUsageItem,
  SparePartFormValues,
  SparePartRecord,
  StockMovementItem,
  StockMovementType,
  StockOperationValues,
  StockStatus,
} from "@/features/spare-parts/types/spare-parts";
import type { ApiAssetRecord, ApiCategoryRecord } from "@/services/assets/contracts";
import type { ApiMaintenanceRecord } from "@/services/maintenance/contracts";
import type { ApiAuthUser } from "@/services/auth/session";

export interface ApiSparePartRecord {
  _id: string;
  partNumber: string;
  name: string;
  category: string | ApiCategoryRecord;
  site: string;
  compatibleAssets?: Array<string | ApiAssetRecord>;
  unit: string;
  stockOnHand: number;
  reservedStock: number;
  reorderPoint: number;
  status: StockStatus;
  binLocation: string;
  supplier: string;
  notes?: string;
}

export interface ApiSparePartPayload {
  _id?: string;
  partNumber: string;
  name: string;
  category: string;
  site: string;
  compatibleAssets?: string[];
  unit: string;
  stockOnHand: number;
  reservedStock?: number;
  reorderPoint: number;
  binLocation: string;
  supplier: string;
  notes?: string;
}

export interface ApiStockMovementRecord {
  _id: string;
  type: StockMovementType;
  quantity: number;
  reference: string;
  note?: string;
  createdAt?: string;
}

export interface ApiPartUsageRecord {
  _id: string;
  maintenanceJob: string | Pick<ApiMaintenanceRecord, "_id" | "workOrder">;
  asset: string | Pick<ApiAssetRecord, "_id" | "name" | "code">;
  technician: string | Pick<ApiAuthUser, "_id" | "username" | "firstName" | "lastName" | "email">;
  quantity: number;
  unit: string;
  note?: string;
  usedAt?: string;
  createdAt?: string;
}

export interface ApiStockOperationResult {
  sparePart: ApiSparePartRecord;
  movement: ApiStockMovementRecord;
}

export interface ApiPartUsageResult {
  sparePart: ApiSparePartRecord;
  usage: ApiPartUsageRecord;
  movement: ApiStockMovementRecord;
}

export type SparePartUpsertPayload = SparePartFormValues;

export type StockOperationPayload = StockOperationValues;

export type PartUsagePayload = PartUsageFormValues;

export interface SparePartMutationResponse {
  part: SparePartRecord;
  message: string;
}

export interface StockOperationResponse {
  part: SparePartRecord;
  movement: StockMovementItem;
  message: string;
}

export interface PartUsageMutationResponse {
  part: SparePartRecord;
  usage: PartUsageItem;
  movement: StockMovementItem;
  message: string;
}

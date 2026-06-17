import type { AssetFormValues, AssetRecord, AssetStatus, AssetCriticality } from "@/features/assets/types/assets";

export interface ApiCategoryRecord {
  _id: string;
  name: string;
  code?: string;
  description?: string;
  isActive?: boolean;
}

export interface ApiAssetRecord {
  _id: string;
  name: string;
  code?: string;
  category: string | ApiCategoryRecord | null;
  assetType?: string;
  site: string;
  assignedTeam: string;
  status: AssetStatus;
  criticality: AssetCriticality;
  condition?: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  quantity?: number;
  unitOfMeasure?: string;
  supplier?: string;
  acquisitionDate?: string;
  lastServiceDate?: string;
  nextServiceDate?: string;
  notes?: string;
}

export interface ApiAssetPayload {
  _id?: string;
  name: string;
  code?: string;
  category: string;
  assetType?: string;
  site: string;
  assignedTeam: string;
  status: AssetStatus;
  criticality: AssetCriticality;
  condition?: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  quantity?: number;
  unitOfMeasure?: string;
  supplier?: string;
  acquisitionDate?: string;
  lastServiceDate?: string;
  nextServiceDate?: string;
  notes?: string;
}

export type AssetUpsertPayload = Omit<
  AssetFormValues,
  | "code"
  | "assetType"
  | "quantity"
  | "unitOfMeasure"
  | "supplier"
  | "acquisitionDate"
  | "lastServiceDate"
  | "nextServiceDate"
> & {
  code?: string;
  assetType?: string;
  quantity?: string;
  unitOfMeasure?: string;
  supplier?: string;
  acquisitionDate?: string;
  lastServiceDate?: string;
  nextServiceDate?: string;
};

export interface AssetMutationResponse {
  asset: AssetRecord;
  message: string;
}

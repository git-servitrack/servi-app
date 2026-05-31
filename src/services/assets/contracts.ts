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
  category: string | ApiCategoryRecord;
  site: string;
  assignedTeam: string;
  status: AssetStatus;
  criticality: AssetCriticality;
  condition?: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  lastServiceDate?: string;
  nextServiceDate?: string;
  notes?: string;
}

export interface ApiAssetPayload {
  _id?: string;
  name: string;
  code?: string;
  category: string;
  site: string;
  assignedTeam: string;
  status: AssetStatus;
  criticality: AssetCriticality;
  condition?: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  lastServiceDate?: string;
  nextServiceDate?: string;
  notes?: string;
}

export type AssetUpsertPayload = Omit<AssetFormValues, "lastServiceDate" | "nextServiceDate"> & {
  lastServiceDate?: string;
  nextServiceDate?: string;
};

export interface AssetMutationResponse {
  asset: AssetRecord;
  message: string;
}

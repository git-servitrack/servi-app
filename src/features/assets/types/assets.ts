export type AssetStatus = "Active" | "Operational" | "Maintenance Due" | "Under Repair" | "Decommissioned";
export type AssetCriticality = "Critical" | "High" | "Medium" | "Low";

export interface AssetRecord {
  id: string;
  name: string;
  code: string;
  categoryId: string;
  category: string;
  assetType?: string;
  site: string;
  assignedTeam: string;
  status: AssetStatus;
  criticality: AssetCriticality;
  condition: string;
  lastServiceDate: string;
  nextServiceDate: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  quantity?: number;
  unitOfMeasure?: string;
  supplier?: string;
  acquisitionDate?: string;
  notes: string;
}

export interface AssetFilterState {
  query: string;
  category: string;
  site: string;
  status: AssetStatus | "All";
}

export interface AssetFormValues {
  name: string;
  code: string;
  category: string;
  assetType: string;
  site: string;
  assignedTeam: string;
  status: AssetStatus;
  criticality: AssetCriticality;
  condition: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  quantity: string;
  unitOfMeasure: string;
  supplier: string;
  acquisitionDate: string;
  lastServiceDate: string;
  nextServiceDate: string;
  notes: string;
}

export interface AssetCategoryOption {
  id: string;
  name: string;
  code?: string;
  description?: string;
  isActive: boolean;
}

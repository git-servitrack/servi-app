export type AssetStatus = "Operational" | "Maintenance Due" | "Under Repair" | "Decommissioned";
export type AssetCriticality = "Critical" | "High" | "Medium" | "Low";

export interface AssetRecord {
  id: string;
  name: string;
  code: string;
  category: string;
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
  site: string;
  assignedTeam: string;
  status: AssetStatus;
  criticality: AssetCriticality;
  condition: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  lastServiceDate: string;
  nextServiceDate: string;
  notes: string;
}

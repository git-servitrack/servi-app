export type StockStatus = "In Stock" | "Low Stock" | "Critical" | "Out of Stock";

export type StockMovementType = "Received" | "Issued" | "Adjusted" | "Reserved";

export interface StockMovementItem {
  id: string;
  date: string;
  type: StockMovementType;
  quantity: string;
  reference: string;
  note: string;
}

export interface PartUsageItem {
  id: string;
  workOrder: string;
  asset: string;
  quantity: string;
  date: string;
  technician: string;
}

export interface SparePartRecord {
  id: string;
  partNumber: string;
  name: string;
  categoryId: string;
  category: string;
  site: string;
  compatibleAssetIds: string[];
  compatibleAssets: string;
  unit: string;
  stockOnHand: number;
  reservedStock: number;
  reorderPoint: number;
  status: StockStatus;
  binLocation: string;
  supplier: string;
  notes: string;
  movements: StockMovementItem[];
  usage: PartUsageItem[];
}

export interface SparePartFormValues {
  partNumber: string;
  name: string;
  category: string;
  site: string;
  compatibleAssets: string[];
  unit: string;
  stockOnHand: string;
  reservedStock: string;
  reorderPoint: string;
  binLocation: string;
  supplier: string;
  notes: string;
}

export interface SparePartCategoryOption {
  id: string;
  name: string;
  isActive: boolean;
}

export interface SparePartAssetOption {
  id: string;
  name: string;
  code: string;
  site: string;
}

export interface SparePartMaintenanceOption {
  id: string;
  workOrder: string;
  assetName: string;
  technician: string;
}

export interface SparePartFormOptions {
  categories: SparePartCategoryOption[];
  assets: SparePartAssetOption[];
  maintenanceJobs: SparePartMaintenanceOption[];
}

export interface StockOperationValues {
  operation: "add" | "deduct" | "adjust" | "reserve";
  quantity: string;
  reference: string;
  note: string;
}

export interface PartUsageFormValues {
  maintenanceJob: string;
  quantity: string;
  note: string;
  usedAt: string;
}

export type StockStatus = "In Stock" | "Low Stock" | "Critical" | "Out of Stock";

export interface StockMovementItem {
  id: string;
  date: string;
  type: "Received" | "Issued" | "Adjusted";
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
  category: string;
  site: string;
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
  compatibleAssets: string;
  unit: string;
  stockOnHand: string;
  reservedStock: string;
  reorderPoint: string;
  status: StockStatus;
  binLocation: string;
  supplier: string;
  notes: string;
}

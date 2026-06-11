import type { SparePartFormValues, PartUsageFormValues, StockOperationValues } from "@/features/spare-parts/types/spare-parts";

export const emptySparePartFormValues: SparePartFormValues = {
  partNumber: "",
  name: "",
  category: "",
  site: "",
  compatibleAssets: [],
  unit: "",
  stockOnHand: "",
  reservedStock: "",
  reorderPoint: "",
  binLocation: "",
  supplier: "",
  notes: "",
};

export const emptyStockOperationValues: StockOperationValues = {
  operation: "add",
  quantity: "",
  reference: "",
  note: "",
};

export const emptyPartUsageFormValues: PartUsageFormValues = {
  maintenanceJob: "",
  quantity: "",
  note: "",
  usedAt: "",
};

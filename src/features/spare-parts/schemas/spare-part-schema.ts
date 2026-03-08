import { z } from "zod";

import type { StockStatus } from "@/features/spare-parts/types/spare-parts";

const statusOptions: [StockStatus, ...StockStatus[]] = ["In Stock", "Low Stock", "Critical", "Out of Stock"];

export const sparePartFormSchema = z.object({
  partNumber: z.string().min(3, "Part number is required."),
  name: z.string().min(2, "Part name is required."),
  category: z.string().min(2, "Category is required."),
  site: z.string().min(2, "Site is required."),
  compatibleAssets: z.string().min(2, "Compatible assets are required."),
  unit: z.string().min(1, "Unit is required."),
  stockOnHand: z.string().min(1, "Stock on hand is required."),
  reservedStock: z.string().min(1, "Reserved stock is required."),
  reorderPoint: z.string().min(1, "Reorder point is required."),
  status: z.enum(statusOptions),
  binLocation: z.string().min(2, "Bin location is required."),
  supplier: z.string().min(2, "Supplier is required."),
  notes: z.string().min(10, "Inventory notes must be at least 10 characters."),
}).superRefine((values, context) => {
  const stockOnHand = Number(values.stockOnHand);
  const reservedStock = Number(values.reservedStock);
  const reorderPoint = Number(values.reorderPoint);

  if (Number.isNaN(stockOnHand) || stockOnHand < 0) {
    context.addIssue({
      code: "custom",
      path: ["stockOnHand"],
      message: "Stock on hand must be a valid non-negative number.",
    });
  }

  if (Number.isNaN(reservedStock) || reservedStock < 0) {
    context.addIssue({
      code: "custom",
      path: ["reservedStock"],
      message: "Reserved stock must be a valid non-negative number.",
    });
  }

  if (Number.isNaN(reorderPoint) || reorderPoint < 0) {
    context.addIssue({
      code: "custom",
      path: ["reorderPoint"],
      message: "Reorder point must be a valid non-negative number.",
    });
  }

  if (!Number.isNaN(stockOnHand) && !Number.isNaN(reservedStock) && reservedStock > stockOnHand) {
    context.addIssue({
      code: "custom",
      path: ["reservedStock"],
      message: "Reserved stock cannot exceed stock on hand.",
    });
  }
});

export type SparePartFormSchemaValues = z.infer<typeof sparePartFormSchema>;

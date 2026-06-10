import { z } from "zod";

export const sparePartFormSchema = z.object({
  partNumber: z.string().min(3, "Part number is required."),
  name: z.string().min(2, "Part name is required."),
  category: z.string().min(1, "Category is required."),
  site: z.string().min(2, "Site is required."),
  compatibleAssets: z.array(z.string()),
  unit: z.string().min(1, "Unit is required."),
  stockOnHand: z.string().min(1, "Stock on hand is required."),
  reservedStock: z.string().min(1, "Reserved stock is required."),
  reorderPoint: z.string().min(1, "Reorder point is required."),
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

export const stockOperationSchema = z.object({
  operation: z.enum(["add", "deduct", "adjust", "reserve"]),
  quantity: z.string().min(1, "Quantity is required."),
  reference: z.string().min(2, "Movement reference is required."),
  note: z.string(),
}).superRefine((values, context) => {
  const quantity = Number(values.quantity);

  if (!Number.isInteger(quantity)) {
    context.addIssue({
      code: "custom",
      path: ["quantity"],
      message: "Quantity must be a whole number.",
    });
    return;
  }

  if (values.operation === "adjust") {
    if (quantity === 0) {
      context.addIssue({
        code: "custom",
        path: ["quantity"],
        message: "Adjustment quantity cannot be zero.",
      });
    }
    return;
  }

  if (quantity <= 0) {
    context.addIssue({
      code: "custom",
      path: ["quantity"],
      message: "Quantity must be greater than zero.",
    });
  }
});

export const partUsageSchema = z.object({
  maintenanceJob: z.string().min(1, "Maintenance job is required."),
  quantity: z.string().min(1, "Quantity is required."),
  note: z.string(),
  usedAt: z.string(),
}).superRefine((values, context) => {
  const quantity = Number(values.quantity);

  if (!Number.isInteger(quantity) || quantity <= 0) {
    context.addIssue({
      code: "custom",
      path: ["quantity"],
      message: "Quantity must be a positive whole number.",
    });
  }
});

export type StockOperationSchemaValues = z.infer<typeof stockOperationSchema>;
export type PartUsageSchemaValues = z.infer<typeof partUsageSchema>;

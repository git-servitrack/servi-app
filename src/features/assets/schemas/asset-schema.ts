import { z } from "zod";

import type { AssetCriticality, AssetStatus } from "@/features/assets/types/assets";

const statusOptions: [AssetStatus, ...AssetStatus[]] = ["Active", "Operational", "Maintenance Due", "Under Repair", "Decommissioned"];
const criticalityOptions: [AssetCriticality, ...AssetCriticality[]] = ["Critical", "High", "Medium", "Low"];
const optionalCodeSchema = z.string().refine(
  (value) => value.trim().length === 0 || value.trim().length >= 3,
  "Asset code must be at least 3 characters when provided.",
);

export const assetFormSchema = z.object({
  name: z.string().min(2, "Asset name must be at least 2 characters."),
  code: optionalCodeSchema,
  category: z.string().min(2, "Category is required."),
  assetType: z.string().optional(),
  site: z.string().min(2, "Site is required."),
  assignedTeam: z.string().min(2, "Assigned team is required."),
  status: z.enum(statusOptions, { error: "Select a valid asset status." }),
  criticality: z.enum(criticalityOptions, { error: "Select a valid criticality level." }),
  condition: z.string().min(10, "Condition summary must be at least 10 characters."),
  manufacturer: z.string().min(2, "Brand is required."),
  model: z.string().min(2, "Model is required."),
  serialNumber: z.string().min(3, "Serial number is required."),
  quantity: z.string().optional(),
  unitOfMeasure: z.string().optional(),
  supplier: z.string().optional(),
  acquisitionDate: z.string().optional(),
  lastServiceDate: z.string().optional(),
  nextServiceDate: z.string().optional(),
  notes: z.string().min(10, "Notes must be at least 10 characters."),
}).superRefine((values, context) => {
  if (values.quantity && Number(values.quantity) < 0) {
    context.addIssue({
      code: "custom",
      path: ["quantity"],
      message: "Quantity cannot be negative.",
    });
  }

  if (values.quantity && Number.isNaN(Number(values.quantity))) {
    context.addIssue({
      code: "custom",
      path: ["quantity"],
      message: "Quantity must be a valid number.",
    });
  }

  if (values.lastServiceDate && values.nextServiceDate && values.nextServiceDate < values.lastServiceDate) {
    context.addIssue({
      code: "custom",
      path: ["nextServiceDate"],
      message: "Next service date cannot be earlier than the last service date.",
    });
  }
});

export type AssetFormSchemaValues = z.infer<typeof assetFormSchema>;

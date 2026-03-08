import { z } from "zod";

import type { AssetCriticality, AssetStatus } from "@/features/assets/types/assets";

const statusOptions: [AssetStatus, ...AssetStatus[]] = ["Operational", "Maintenance Due", "Under Repair", "Decommissioned"];
const criticalityOptions: [AssetCriticality, ...AssetCriticality[]] = ["Critical", "High", "Medium", "Low"];

export const assetFormSchema = z.object({
  name: z.string().min(2, "Asset name must be at least 2 characters."),
  code: z.string().min(3, "Asset code is required."),
  category: z.string().min(2, "Category is required."),
  site: z.string().min(2, "Site is required."),
  assignedTeam: z.string().min(2, "Assigned team is required."),
  status: z.enum(statusOptions, { error: "Select a valid asset status." }),
  criticality: z.enum(criticalityOptions, { error: "Select a valid criticality level." }),
  condition: z.string().min(10, "Condition summary must be at least 10 characters."),
  manufacturer: z.string().min(2, "Manufacturer is required."),
  model: z.string().min(2, "Model is required."),
  serialNumber: z.string().min(3, "Serial number is required."),
  lastServiceDate: z.string().optional(),
  nextServiceDate: z.string().optional(),
  notes: z.string().min(10, "Notes must be at least 10 characters."),
}).superRefine((values, context) => {
  if (values.lastServiceDate && values.nextServiceDate && values.nextServiceDate < values.lastServiceDate) {
    context.addIssue({
      code: "custom",
      path: ["nextServiceDate"],
      message: "Next service date cannot be earlier than the last service date.",
    });
  }
});

export type AssetFormSchemaValues = z.infer<typeof assetFormSchema>;

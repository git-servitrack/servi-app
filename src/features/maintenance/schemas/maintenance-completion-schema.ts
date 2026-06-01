import { z } from "zod";

export const maintenanceCompletionSchema = z.object({
  resolution: z.string().min(12, "Resolution summary must be at least 12 characters."),
  partsUsed: z.string().min(2, "Parts used is required."),
  verifiedBy: z.string().min(2, "Verifier is required."),
  completedAt: z.string().optional(),
});

export type MaintenanceCompletionSchemaValues = z.infer<typeof maintenanceCompletionSchema>;

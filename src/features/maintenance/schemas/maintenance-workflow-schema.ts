import { z } from "zod";

export const diagnosisNotesSchema = z.object({
  diagnosisNotes: z.string().min(8, "Diagnosis notes must be at least 8 characters."),
});

export const repairActionSchema = z.object({
  title: z.string().min(3, "Repair action title is required."),
  owner: z.string().min(2, "Owner is required."),
  status: z.enum(["Pending", "In Progress", "Done"]),
  note: z.string().optional(),
});

export const holdMaintenanceSchema = z.object({
  reason: z.string().min(6, "Hold reason is required."),
});

export type DiagnosisNotesSchemaValues = z.infer<typeof diagnosisNotesSchema>;
export type RepairActionSchemaValues = z.infer<typeof repairActionSchema>;
export type HoldMaintenanceSchemaValues = z.infer<typeof holdMaintenanceSchema>;

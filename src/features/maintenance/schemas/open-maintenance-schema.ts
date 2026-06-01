import { z } from "zod";

export const openMaintenanceSchema = z.object({
  workOrder: z.string().optional(),
  technicianId: z.string().min(1, "Technician is required."),
  team: z.string().min(2, "Team is required."),
  shift: z.string().min(2, "Shift is required."),
  eta: z.string().min(2, "ETA is required."),
  diagnosisNotes: z.string().optional(),
});

export const createMaintenanceSchema = openMaintenanceSchema.extend({
  serviceRequestId: z.string().min(1, "Service request is required."),
});

export type OpenMaintenanceSchemaValues = z.infer<typeof openMaintenanceSchema>;
export type CreateMaintenanceSchemaValues = z.infer<typeof createMaintenanceSchema>;

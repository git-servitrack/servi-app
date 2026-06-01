import { z } from "zod";

export const maintenanceAssignmentSchema = z.object({
  technicianId: z.string().min(1, "Technician is required."),
  technician: z.string().optional(),
  team: z.string().min(2, "Team is required."),
  shift: z.string().min(2, "Shift is required."),
  eta: z.string().min(2, "ETA is required."),
});

export type MaintenanceAssignmentSchemaValues = z.infer<typeof maintenanceAssignmentSchema>;

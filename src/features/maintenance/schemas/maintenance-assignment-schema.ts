import { z } from "zod";

export const maintenanceAssignmentSchema = z.object({
  technician: z.string().min(2, "Technician is required."),
  team: z.string().min(2, "Team is required."),
  shift: z.string().min(2, "Shift is required."),
  eta: z.string().min(2, "ETA is required."),
});

export type MaintenanceAssignmentSchemaValues = z.infer<typeof maintenanceAssignmentSchema>;

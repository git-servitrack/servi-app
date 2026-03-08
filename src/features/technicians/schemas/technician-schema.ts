import { z } from "zod";

import type { TechnicianStatus } from "@/features/technicians/types/technicians";

const statusOptions: [TechnicianStatus, ...TechnicianStatus[]] = ["Available", "On Assignment", "Off Shift", "Leave"];

export const technicianFormSchema = z.object({
  name: z.string().min(2, "Technician name is required."),
  employeeId: z.string().min(3, "Employee ID is required."),
  role: z.string().min(2, "Role is required."),
  team: z.string().min(2, "Team is required."),
  primarySkill: z.string().min(2, "Primary skill is required."),
  siteCoverage: z.string().min(2, "Site coverage is required."),
  status: z.enum(statusOptions),
  phone: z.string().min(7, "Phone number is required."),
  email: z.email("Enter a valid email address."),
  bio: z.string().min(12, "Professional summary must be at least 12 characters."),
});

export type TechnicianFormSchemaValues = z.infer<typeof technicianFormSchema>;

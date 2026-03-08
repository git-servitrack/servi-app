import { z } from "zod";

const roleIds = [
  "warehouse-staff",
  "admin-operator",
  "technician",
  "head-technician",
  "project-site",
  "management",
] as const;

const statusValues = ["Active", "Pending Activation", "Suspended"] as const;

export const userManagementFormSchema = z
  .object({
    fullName: z.string().min(3, "Enter the user's full name."),
    email: z.string().email("Enter a valid work email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(8, "Confirm the temporary password."),
    department: z.string().min(2, "Enter the assigned department or team."),
    roleId: z.enum(roleIds),
    status: z.enum(statusValues),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords must match.",
    path: ["confirmPassword"],
  });

export type UserManagementFormSchemaValues = z.infer<typeof userManagementFormSchema>;

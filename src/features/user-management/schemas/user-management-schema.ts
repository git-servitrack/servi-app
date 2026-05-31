import { z } from "zod";

const roleIds = [
  "warehouse-staff",
  "admin-operator",
  "technician",
  "head-technician",
  "project-site",
  "management",
] as const;

export const userManagementFormSchema = z
  .object({
    username: z.string().min(2, "Enter a username."),
    firstName: z.string().min(2, "Enter the user's first name."),
    lastName: z.string().min(2, "Enter the user's last name."),
    middleName: z.string(),
    email: z.string().email("Enter a valid work email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(8, "Confirm the temporary password."),
    roleId: z.enum(roleIds),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords must match.",
    path: ["confirmPassword"],
  });

export type UserManagementFormSchemaValues = z.infer<typeof userManagementFormSchema>;

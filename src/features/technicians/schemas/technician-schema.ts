import { z } from "zod";

const technicianBaseSchema = z.object({
  username: z.string().min(2, "Enter a username."),
  firstName: z.string().min(2, "Enter the technician's first name."),
  lastName: z.string().min(2, "Enter the technician's last name."),
  middleName: z.string(),
  email: z.email("Enter a valid email address."),
});

export const technicianFormSchema = technicianBaseSchema
  .extend({
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(8, "Confirm the temporary password."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords must match.",
    path: ["confirmPassword"],
  });

export const technicianEditFormSchema = technicianBaseSchema
  .extend({
    password: z.string(),
    confirmPassword: z.string(),
  })
  .superRefine((values, context) => {
    const password = values.password.trim();
    const confirmPassword = values.confirmPassword.trim();
    const shouldChangePassword = password.length > 0 || confirmPassword.length > 0;

    if (!shouldChangePassword) return;

    if (password.length < 8) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "Password must be at least 8 characters.",
      });
    }

    if (confirmPassword.length < 8) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Confirm the new password.",
      });
    }

    if (password !== confirmPassword) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords must match.",
      });
    }
  });

export type TechnicianFormSchemaValues = z.infer<typeof technicianFormSchema>;

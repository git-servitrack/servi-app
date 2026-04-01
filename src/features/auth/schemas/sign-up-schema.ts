import { z } from "zod";

export const signUpSchema = z.object({
  fullName: z.string().min(2, "Enter your full name."),
  email: z.string().email("Enter a valid work email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export type SignUpSchemaValues = z.infer<typeof signUpSchema>;

import { z } from "zod";

export const signInSchema = z.object({
  identifier: z.string().email("Enter your work email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export type SignInSchemaValues = z.infer<typeof signInSchema>;

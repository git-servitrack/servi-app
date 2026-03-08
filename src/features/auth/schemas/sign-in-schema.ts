import { z } from "zod";

export const signInSchema = z.object({
  identifier: z.string().min(3, "Enter your email or username."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export type SignInSchemaValues = z.infer<typeof signInSchema>;

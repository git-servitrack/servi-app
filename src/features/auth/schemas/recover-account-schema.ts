import { z } from "zod";

export const recoverAccountSchema = z.object({
  email: z.string().email("Enter the email tied to your account."),
});

export type RecoverAccountSchemaValues = z.infer<typeof recoverAccountSchema>;

import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters."),
  code: z.string(),
  description: z.string(),
  isActive: z.boolean(),
});

export type CategoryFormSchemaValues = z.infer<typeof categoryFormSchema>;

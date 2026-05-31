import type { CategoryFormValues, CategoryRecord } from "@/features/categories/types/categories";

export interface ApiCategoryRecord {
  _id: string;
  name: string;
  code?: string;
  description?: string;
  isActive?: boolean;
}

export interface ApiCategoryPayload {
  _id?: string;
  name: string;
  code?: string;
  description?: string;
  isActive?: boolean;
}

export type CategoryUpsertPayload = CategoryFormValues;

export interface CategoryMutationResponse {
  category: CategoryRecord;
  message: string;
}

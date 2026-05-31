import type { CategoryRecord } from "@/features/categories/types/categories";
import { createApiResult, requestEnvelope, requestJson } from "@/services/http/client";
import type { ApiResult } from "@/services/http/types";
import type {
  ApiCategoryPayload,
  ApiCategoryRecord,
  CategoryMutationResponse,
  CategoryUpsertPayload,
} from "@/services/categories/contracts";

const CATEGORY_FIELDS = "_id,name,code,description,isActive";

function mapApiCategoryToRecord(category: ApiCategoryRecord): CategoryRecord {
  return {
    id: category._id,
    name: category.name,
    code: category.code ?? category._id.slice(-6).toUpperCase(),
    description: category.description ?? "No description provided.",
    isActive: category.isActive ?? true,
  };
}

function optionalString(value: string) {
  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : undefined;
}

function mapPayloadToApiCategory(payload: CategoryUpsertPayload, categoryId?: string): ApiCategoryPayload {
  return {
    ...(categoryId ? { _id: categoryId } : {}),
    name: payload.name,
    code: optionalString(payload.code),
    description: optionalString(payload.description),
    isActive: payload.isActive,
  };
}

export const categoriesService = {
  async list(): Promise<ApiResult<CategoryRecord[]>> {
    return createApiResult(async () => {
      const categories = await requestJson<ApiCategoryRecord[]>("/category", {
        query: {
          fields: CATEGORY_FIELDS,
          limit: 100,
          sort: "name",
          order: "asc",
        },
      });

      return categories.map(mapApiCategoryToRecord);
    });
  },

  async save(payload: CategoryUpsertPayload, categoryId?: string): Promise<ApiResult<CategoryMutationResponse>> {
    return createApiResult(async () => {
      const result = await requestEnvelope<ApiCategoryRecord, ApiCategoryPayload>("/category", {
        method: categoryId ? "PUT" : "POST",
        body: mapPayloadToApiCategory(payload, categoryId),
      });

      if (!result.data) {
        throw new Error("Category response did not include record data.");
      }

      return {
        category: mapApiCategoryToRecord(result.data),
        message: result.message,
      };
    });
  },

  async delete(categoryId: string): Promise<ApiResult<{ id: string; message: string }>> {
    return createApiResult(async () => {
      const result = await requestEnvelope<null>(`/category/${categoryId}`, {
        method: "DELETE",
      });

      return {
        id: categoryId,
        message: result.message,
      };
    });
  },
};

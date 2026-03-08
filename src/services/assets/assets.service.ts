import { assetRecords } from "@/features/assets/data/assets";
import type { AssetRecord } from "@/features/assets/types/assets";
import { AppRequestError } from "@/services/http/errors";
import { createApiResult, simulateNetwork } from "@/services/http/client";
import type { ApiResult } from "@/services/http/types";
import type { AssetMutationResponse, AssetUpsertPayload } from "@/services/assets/contracts";

function buildAssetRecord(payload: AssetUpsertPayload, existingId?: string): AssetRecord {
  return {
    id: existingId ?? `AST-${String(assetRecords.length + 101).padStart(3, "0")}`,
    ...payload,
    lastServiceDate: payload.lastServiceDate || "N/A",
    nextServiceDate: payload.nextServiceDate || "N/A",
  };
}

export const assetsService = {
  async list(): Promise<ApiResult<AssetRecord[]>> {
    return createApiResult(async () => simulateNetwork(assetRecords));
  },

  async getById(assetId: string): Promise<ApiResult<AssetRecord>> {
    return createApiResult(async () => {
      const asset = assetRecords.find((item) => item.id === assetId);

      if (!asset) {
        throw new AppRequestError({
          code: "NOT_FOUND",
          message: "Asset record could not be found.",
          status: 404,
        });
      }

      return simulateNetwork(asset);
    });
  },

  async save(payload: AssetUpsertPayload, assetId?: string): Promise<ApiResult<AssetMutationResponse>> {
    return createApiResult(async () => {
      const duplicateCode = assetRecords.find((item) => item.code === payload.code && item.id !== assetId);

      if (duplicateCode) {
        throw new AppRequestError({
          code: "VALIDATION_ERROR",
          message: "Asset code must be unique.",
          status: 422,
          fieldErrors: {
            code: "This asset code is already in use.",
          },
        });
      }

      const asset = buildAssetRecord(payload, assetId);

      return simulateNetwork({
        asset,
        message: assetId ? "Asset record updated successfully." : "Asset record created successfully.",
      });
    });
  },
};

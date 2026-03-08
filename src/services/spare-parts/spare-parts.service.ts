import { sparePartRecords } from "@/features/spare-parts/data/spare-parts";
import type { SparePartRecord } from "@/features/spare-parts/types/spare-parts";
import { AppRequestError } from "@/services/http/errors";
import { createApiResult, simulateNetwork } from "@/services/http/client";
import type { ApiResult } from "@/services/http/types";
import type { SparePartMutationResponse, SparePartUpsertPayload } from "@/services/spare-parts/contracts";

function buildSparePart(payload: SparePartUpsertPayload, partId?: string): SparePartRecord {
  const existing = partId ? sparePartRecords.find((item) => item.id === partId) : undefined;
  const { stockOnHand, reservedStock, reorderPoint, ...rest } = payload;

  return {
    id: partId ?? `PART-${sparePartRecords.length + 101}`,
    movements: existing?.movements ?? [],
    usage: existing?.usage ?? [],
    ...rest,
    stockOnHand: Number(stockOnHand),
    reservedStock: Number(reservedStock),
    reorderPoint: Number(reorderPoint),
  };
}

export const sparePartsService = {
  async save(payload: SparePartUpsertPayload, partId?: string): Promise<ApiResult<SparePartMutationResponse>> {
    return createApiResult(async () => {
      const duplicatePartNumber = sparePartRecords.find((item) => item.partNumber === payload.partNumber && item.id !== partId);

      if (duplicatePartNumber) {
        throw new AppRequestError({
          code: "VALIDATION_ERROR",
          message: "Part number must be unique.",
          status: 422,
          fieldErrors: {
            partNumber: "This part number is already in use.",
          },
        });
      }

      const part = buildSparePart(payload, partId);

      return simulateNetwork({
        part,
        message: partId ? "Spare part updated successfully." : "Spare part created successfully.",
      });
    });
  },
};

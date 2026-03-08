import type { SparePartFormValues, SparePartRecord } from "@/features/spare-parts/types/spare-parts";

export type SparePartUpsertPayload = SparePartFormValues;

export interface SparePartMutationResponse {
  part: SparePartRecord;
  message: string;
}

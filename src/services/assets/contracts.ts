import type { AssetFormValues, AssetRecord } from "@/features/assets/types/assets";

export type AssetUpsertPayload = Omit<AssetFormValues, "lastServiceDate" | "nextServiceDate"> & {
  lastServiceDate?: string;
  nextServiceDate?: string;
};

export interface AssetMutationResponse {
  asset: AssetRecord;
  message: string;
}

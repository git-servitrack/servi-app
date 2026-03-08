import type { TechnicianFormValues, TechnicianRecord } from "@/features/technicians/types/technicians";

export type TechnicianUpsertPayload = TechnicianFormValues;

export interface TechnicianMutationResponse {
  technician: TechnicianRecord;
  message: string;
}

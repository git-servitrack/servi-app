import type { TechnicianFormValues, TechnicianRecord } from "@/features/technicians/types/technicians";

export type TechnicianUpsertPayload = Omit<TechnicianFormValues, "confirmPassword">;

export interface TechnicianMutationResponse {
  technician: TechnicianRecord;
  message: string;
}

import type { ServiceRequestFormValues, ServiceRequestRecord } from "@/features/service-requests/types/service-requests";

export type ServiceRequestUpsertPayload = Omit<ServiceRequestFormValues, "scheduledFor"> & {
  scheduledFor?: string;
};

export interface ServiceRequestMutationResponse {
  request: ServiceRequestRecord;
  message: string;
}

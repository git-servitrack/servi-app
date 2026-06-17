import type {
  RequestPriority,
  RequestStatus,
  ServiceRequestAssetOption,
  ServiceRequestFormValues,
  ServiceRequestRecord,
  ServiceRequestRequesterOption,
} from "@/features/service-requests/types/service-requests";
import type { ApiAuthUser } from "@/services/auth/session";
import type { ApiAssetRecord } from "@/services/assets/contracts";

export type ApiServiceRequestUser = Pick<
  ApiAuthUser,
  "_id" | "username" | "firstName" | "lastName" | "email"
>;

export interface ApiServiceRequestAssetCategory {
  _id: string;
  name: string;
  code?: string;
}

export type ApiServiceRequestAsset = Pick<ApiAssetRecord, "_id" | "name" | "code" | "site"> & {
  category?: string | ApiServiceRequestAssetCategory | null;
};

export interface ApiServiceRequestRecord {
  _id: string;
  title: string;
  requester: string | ApiServiceRequestUser | null;
  site: string;
  asset: string | ApiServiceRequestAsset | null;
  status: RequestStatus;
  priority: RequestPriority;
  scheduledFor?: string;
  summary: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiServiceRequestPayload {
  _id?: string;
  title: string;
  requester: string;
  site: string;
  asset: string;
  status?: RequestStatus;
  priority?: RequestPriority;
  scheduledFor?: string;
  summary: string;
}

export type ServiceRequestUpsertPayload = Omit<ServiceRequestFormValues, "scheduledFor"> & {
  scheduledFor?: string;
};

export interface ServiceRequestMutationResponse {
  request: ServiceRequestRecord;
  message: string;
}

export interface ServiceRequestFormOptions {
  assets: ServiceRequestAssetOption[];
  requesters: ServiceRequestRequesterOption[];
}

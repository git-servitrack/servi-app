import type {
  ServiceRequestAssetOption,
  ServiceRequestRecord,
  ServiceRequestRequesterOption,
} from "@/features/service-requests/types/service-requests";
import type { AssetRecord } from "@/features/assets/types/assets";
import type { UserManagementRecord } from "@/features/user-management/types/user-management";
import { createApiResult, requestEnvelope, requestJson } from "@/services/http/client";
import type { ApiResult, QueryParams } from "@/services/http/types";
import { assetsService } from "@/services/assets/assets.service";
import { userManagementService } from "@/services/user-management/user-management.service";
import type {
  ApiServiceRequestAsset,
  ApiServiceRequestPayload,
  ApiServiceRequestRecord,
  ApiServiceRequestUser,
  ServiceRequestFormOptions,
  ServiceRequestMutationResponse,
  ServiceRequestUpsertPayload,
} from "@/services/service-requests/contracts";

const SERVICE_REQUEST_FIELDS = [
  "_id",
  "title",
  "requester.username",
  "requester.firstName",
  "requester.lastName",
  "requester.email",
  "site",
  "asset.name",
  "asset.code",
  "asset.site",
  "asset.category",
  "status",
  "priority",
  "scheduledFor",
  "summary",
  "createdAt",
  "updatedAt",
].join(",");

function formatDateTime(value?: string) {
  if (!value) return "Pending review";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Pending review";

  return date.toISOString().slice(0, 16);
}

function getRequesterDetails(requester: string | ApiServiceRequestUser) {
  if (typeof requester === "string") {
    return {
      id: requester,
      name: "Unassigned requester",
    };
  }

  return {
    id: requester._id,
    name: [requester.firstName, requester.lastName].filter(Boolean).join(" ") || requester.username || requester.email,
  };
}

function getAssetDetails(asset: string | ApiServiceRequestAsset, fallbackSite: string) {
  if (typeof asset === "string") {
    return {
      id: asset,
      name: "Unassigned asset",
      category: "Uncategorized",
      site: fallbackSite,
    };
  }

  const category = asset.category;

  return {
    id: asset._id,
    name: asset.name,
    category: typeof category === "object" && category !== null ? category.name : "Uncategorized",
    site: asset.site || fallbackSite,
  };
}

function mapApiServiceRequestToRecord(request: ApiServiceRequestRecord): ServiceRequestRecord {
  const requester = getRequesterDetails(request.requester);
  const asset = getAssetDetails(request.asset, request.site);
  const submittedAt = formatDateTime(request.createdAt);
  const updatedAt = formatDateTime(request.updatedAt ?? request.createdAt);

  return {
    id: request._id,
    ticketNumber: `SR-${request._id.slice(-6).toUpperCase()}`,
    title: request.title,
    site: request.site,
    requesterId: requester.id,
    requester: requester.name,
    category: asset.category,
    assetId: asset.id,
    assetName: asset.name,
    status: request.status,
    priority: request.priority,
    submittedAt,
    scheduledFor: formatDateTime(request.scheduledFor),
    summary: request.summary,
    remarks: [],
    timeline: [
      {
        id: `${request._id}-created`,
        title: "Request created",
        description: request.summary,
        createdAt: submittedAt,
        actor: requester.name,
      },
      {
        id: `${request._id}-status`,
        title: `Status: ${request.status}`,
        description: `Priority marked as ${request.priority}.`,
        createdAt: updatedAt,
        actor: "Service Desk",
      },
    ],
  };
}

function mapPayloadToApiServiceRequest(
  payload: ServiceRequestUpsertPayload,
  requestId?: string,
): ApiServiceRequestPayload {
  return {
    ...(requestId ? { _id: requestId } : {}),
    title: payload.title,
    requester: payload.requester,
    site: payload.site,
    asset: payload.asset,
    status: payload.status,
    priority: payload.priority,
    scheduledFor: payload.scheduledFor?.trim() ? payload.scheduledFor : undefined,
    summary: payload.summary,
  };
}

function buildServiceRequestQuery(query?: QueryParams): QueryParams {
  return {
    fields: SERVICE_REQUEST_FIELDS,
    limit: 100,
    sort: "createdAt",
    order: "desc",
    ...query,
  };
}

function mapAssetOption(asset: AssetRecord): ServiceRequestAssetOption {
  return {
    id: asset.id,
    name: asset.name,
    code: asset.code,
    site: asset.site,
    category: asset.category,
  };
}

function mapRequesterOption(user: UserManagementRecord): ServiceRequestRequesterOption {
  return {
    id: user.id,
    name: user.fullName,
    email: user.email,
  };
}

export const serviceRequestsService = {
  async list(query?: QueryParams): Promise<ApiResult<ServiceRequestRecord[]>> {
    return createApiResult(async () => {
      const requests = await requestJson<ApiServiceRequestRecord[]>("/service-requests", {
        query: buildServiceRequestQuery(query),
      });

      return requests.map(mapApiServiceRequestToRecord);
    });
  },

  async getById(requestId: string): Promise<ApiResult<ServiceRequestRecord>> {
    return createApiResult(async () => {
      const request = await requestJson<ApiServiceRequestRecord>(`/service-requests/${requestId}`, {
        query: {
          fields: SERVICE_REQUEST_FIELDS,
        },
      });

      return mapApiServiceRequestToRecord(request);
    });
  },

  async formOptions(): Promise<ApiResult<ServiceRequestFormOptions>> {
    return createApiResult(async () => {
      const [assetResult, userResult] = await Promise.all([
        assetsService.list(),
        userManagementService.list(),
      ]);

      if (assetResult.error) {
        throw assetResult.error;
      }

      if (userResult.error) {
        throw userResult.error;
      }

      return {
        assets: assetResult.data.map(mapAssetOption),
        requesters: userResult.data.map(mapRequesterOption),
      };
    });
  },

  async save(
    payload: ServiceRequestUpsertPayload,
    requestId?: string,
  ): Promise<ApiResult<ServiceRequestMutationResponse>> {
    return createApiResult(async () => {
      const result = await requestEnvelope<ApiServiceRequestRecord, ApiServiceRequestPayload>("/service-requests", {
        method: requestId ? "PUT" : "POST",
        body: mapPayloadToApiServiceRequest(payload, requestId),
      });

      if (!result.data) {
        throw new Error("Service request response did not include record data.");
      }

      return {
        request: mapApiServiceRequestToRecord(result.data),
        message: result.message,
      };
    });
  },

  async delete(requestId: string): Promise<ApiResult<{ id: string; message: string }>> {
    return createApiResult(async () => {
      const result = await requestEnvelope<null>(`/service-requests/${requestId}`, {
        method: "DELETE",
      });

      return {
        id: requestId,
        message: result.message,
      };
    });
  },
};

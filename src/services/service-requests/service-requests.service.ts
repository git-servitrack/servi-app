import { serviceRequestRecords } from "@/features/service-requests/data/service-requests";
import type { ServiceRequestRecord } from "@/features/service-requests/types/service-requests";
import { AppRequestError } from "@/services/http/errors";
import { createApiResult, simulateNetwork } from "@/services/http/client";
import type { ApiResult } from "@/services/http/types";
import type { ServiceRequestMutationResponse, ServiceRequestUpsertPayload } from "@/services/service-requests/contracts";

function buildServiceRequest(payload: ServiceRequestUpsertPayload, requestId?: string): ServiceRequestRecord {
  const existing = requestId ? serviceRequestRecords.find((item) => item.id === requestId) : undefined;

  return {
    id: requestId ?? `REQ-${serviceRequestRecords.length + 101}`,
    ticketNumber: existing?.ticketNumber ?? `SR-${serviceRequestRecords.length + 800}`,
    submittedAt: existing?.submittedAt ?? "2026-03-08 10:00",
    remarks: existing?.remarks ?? [],
    timeline: existing?.timeline ?? [],
    ...payload,
    scheduledFor: payload.scheduledFor || "Pending review",
  };
}

export const serviceRequestsService = {
  async save(payload: ServiceRequestUpsertPayload, requestId?: string): Promise<ApiResult<ServiceRequestMutationResponse>> {
    return createApiResult(async () => {
      const duplicateTitle = serviceRequestRecords.find((item) => item.title === payload.title && item.id !== requestId);

      if (duplicateTitle) {
        throw new AppRequestError({
          code: "VALIDATION_ERROR",
          message: "A request with the same title already exists.",
          status: 422,
          fieldErrors: {
            title: "Use a more specific request title.",
          },
        });
      }

      const request = buildServiceRequest(payload, requestId);

      return simulateNetwork({
        request,
        message: requestId ? "Service request updated successfully." : "Service request created successfully.",
      });
    });
  },
};

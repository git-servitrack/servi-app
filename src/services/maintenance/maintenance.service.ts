import { maintenanceRecords } from "@/features/maintenance/data/maintenance";
import type { MaintenanceRecord } from "@/features/maintenance/types/maintenance";
import { AppRequestError } from "@/services/http/errors";
import { createApiResult, simulateNetwork } from "@/services/http/client";
import type { ApiResult } from "@/services/http/types";
import type {
  MaintenanceAssignmentMutationResponse,
  MaintenanceAssignmentPayload,
  MaintenanceCompletionMutationResponse,
  MaintenanceCompletionPayload,
} from "@/services/maintenance/contracts";

function getMaintenanceOrThrow(maintenanceId: string) {
  const item = maintenanceRecords.find((record) => record.id === maintenanceId);

  if (!item) {
    throw new AppRequestError({
      code: "NOT_FOUND",
      message: "Maintenance work order could not be found.",
      status: 404,
    });
  }

  return item;
}

function mergeAssignment(item: MaintenanceRecord, assignment: MaintenanceAssignmentPayload): MaintenanceRecord {
  return {
    ...item,
    assignedTeam: assignment.team,
    assignment,
  };
}

function mergeCompletion(item: MaintenanceRecord, completion: MaintenanceCompletionPayload): MaintenanceRecord {
  return {
    ...item,
    status: "Completed",
    completion,
  };
}

export const maintenanceService = {
  async updateAssignment(
    maintenanceId: string,
    payload: MaintenanceAssignmentPayload,
  ): Promise<ApiResult<MaintenanceAssignmentMutationResponse>> {
    return createApiResult(async () => {
      const item = getMaintenanceOrThrow(maintenanceId);
      const updatedItem = mergeAssignment(item, payload);

      return simulateNetwork({
        item: updatedItem,
        message: "Maintenance assignment updated successfully.",
      });
    });
  },

  async updateCompletion(
    maintenanceId: string,
    payload: MaintenanceCompletionPayload,
  ): Promise<ApiResult<MaintenanceCompletionMutationResponse>> {
    return createApiResult(async () => {
      if (!payload.completedAt) {
        throw new AppRequestError({
          code: "VALIDATION_ERROR",
          message: "Completion date is required.",
          status: 422,
          fieldErrors: {
            completedAt: "Completion date is required to close the work order.",
          },
        });
      }

      const item = getMaintenanceOrThrow(maintenanceId);
      const updatedItem = mergeCompletion(item, payload);

      return simulateNetwork({
        item: updatedItem,
        message: "Maintenance completion saved successfully.",
      });
    });
  },
};

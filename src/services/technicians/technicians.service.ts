import { technicianRecords } from "@/features/technicians/data/technicians";
import type { TechnicianRecord } from "@/features/technicians/types/technicians";
import { AppRequestError } from "@/services/http/errors";
import { createApiResult, simulateNetwork } from "@/services/http/client";
import type { ApiResult } from "@/services/http/types";
import type { TechnicianMutationResponse, TechnicianUpsertPayload } from "@/services/technicians/contracts";

function buildTechnician(payload: TechnicianUpsertPayload, technicianId?: string): TechnicianRecord {
  const existing = technicianId ? technicianRecords.find((item) => item.id === technicianId) : undefined;

  return {
    id: technicianId ?? `TECH-${technicianRecords.length + 101}`,
    workload: existing?.workload ?? {
      activeAssignments: "0",
      dueToday: "0",
      upcomingVisits: "0",
      currentShift: "Day Shift",
    },
    scorecard: existing?.scorecard ?? {
      jobsCompleted: "0",
      openAssignments: "0",
      responseTime: "0h",
      slaRate: "0%",
    },
    history: existing?.history ?? [],
    ...payload,
  };
}

export const techniciansService = {
  async save(payload: TechnicianUpsertPayload, technicianId?: string): Promise<ApiResult<TechnicianMutationResponse>> {
    return createApiResult(async () => {
      const duplicateEmployeeId = technicianRecords.find((item) => item.employeeId === payload.employeeId && item.id !== technicianId);

      if (duplicateEmployeeId) {
        throw new AppRequestError({
          code: "VALIDATION_ERROR",
          message: "Employee ID must be unique.",
          status: 422,
          fieldErrors: {
            employeeId: "This employee ID is already assigned to another technician.",
          },
        });
      }

      const technician = buildTechnician(payload, technicianId);

      return simulateNetwork({
        technician,
        message: technicianId ? "Technician profile updated successfully." : "Technician profile created successfully.",
      });
    });
  },
};

import type { MaintenanceRecord, MaintenanceStatus } from "@/features/maintenance/types/maintenance";
import type {
  TechnicianHistoryItem,
  TechnicianRecord,
  TechnicianScorecard,
  TechnicianStatus,
  TechnicianWorkload,
} from "@/features/technicians/types/technicians";
import type { ApiAuthUser } from "@/services/auth/session";
import { createApiResult, requestEnvelope, requestJson } from "@/services/http/client";
import type { ApiResult } from "@/services/http/types";
import type { TechnicianScorecardSummary, TechnicianWorkloadSummary } from "@/services/maintenance/contracts";
import { maintenanceService } from "@/services/maintenance/maintenance.service";
import type { TechnicianMutationResponse, TechnicianUpsertPayload } from "@/services/technicians/contracts";
import type { ApiUserPayload } from "@/services/user-management/contracts";

const TECHNICIAN_FIELDS = "_id,username,firstName,lastName,middleName,email,avatar,role";
const ACTIVE_STATUSES: MaintenanceStatus[] = [
  "Assigned",
  "Diagnosing",
  "Awaiting Parts",
  "Repair In Progress",
  "On Hold",
  "Ready for QA",
];

function getFullName(user: Pick<ApiAuthUser, "firstName" | "lastName" | "username">) {
  return [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username;
}

function getEmployeeId(userId: string) {
  return `TECH-${userId.slice(-6).toUpperCase()}`;
}

function formatNumber(value?: number) {
  return String(value ?? 0);
}

function formatPercent(value?: number) {
  if (value === undefined || Number.isNaN(value)) return "0%";

  return `${Math.round(value)}%`;
}

function isScheduledToday(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;

  const today = new Date();

  return date.toDateString() === today.toDateString();
}

function getActiveJobs(history: MaintenanceRecord[]) {
  return history.filter((item) => ACTIVE_STATUSES.includes(item.status));
}

function deriveStatus(workload?: TechnicianWorkloadSummary, history: MaintenanceRecord[] = []): TechnicianStatus {
  if ((workload?.activeJobs ?? getActiveJobs(history).length) > 0) return "On Assignment";

  return "Available";
}

function deriveTeam(history: MaintenanceRecord[]) {
  return history.find((item) => item.assignedTeam)?.assignedTeam || "Maintenance Team";
}

function deriveCoverage(history: MaintenanceRecord[]) {
  const sites = Array.from(new Set(history.map((item) => item.site).filter(Boolean)));

  return sites.length > 0 ? sites.join(", ") : "Assigned from maintenance queue";
}

function mapHistoryItem(item: MaintenanceRecord): TechnicianHistoryItem {
  return {
    id: item.id,
    date: item.scheduledFor || item.completion.completedAt || "Unscheduled",
    workOrder: item.workOrder,
    asset: item.assetName,
    result: item.status,
  };
}

function buildWorkload(workload?: TechnicianWorkloadSummary, history: MaintenanceRecord[] = []): TechnicianWorkload {
  const activeJobs = getActiveJobs(history);

  return {
    activeAssignments: formatNumber(workload?.activeJobs ?? activeJobs.length),
    dueToday: formatNumber(activeJobs.filter((item) => isScheduledToday(item.scheduledFor)).length),
    upcomingVisits: formatNumber(activeJobs.filter((item) => !isScheduledToday(item.scheduledFor)).length),
    currentShift: activeJobs[0]?.assignment.shift || "Not assigned",
  };
}

function buildScorecard(
  scorecard?: TechnicianScorecardSummary,
  workload?: TechnicianWorkloadSummary,
): TechnicianScorecard {
  return {
    jobsCompleted: formatNumber(scorecard?.completedJobs ?? workload?.completedJobs),
    openAssignments: formatNumber(scorecard?.activeJobs ?? workload?.activeJobs),
    responseTime: "Not tracked",
    slaRate: formatPercent(scorecard?.completionRate),
  };
}

function mapUserToTechnicianRecord(
  user: ApiAuthUser,
  options: {
    workload?: TechnicianWorkloadSummary;
    scorecard?: TechnicianScorecardSummary;
    history?: MaintenanceRecord[];
  } = {},
): TechnicianRecord {
  const history = options.history ?? [];
  const team = deriveTeam(history);

  return {
    id: user._id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    middleName: user.middleName ?? "",
    employeeId: getEmployeeId(user._id),
    name: getFullName(user),
    role: "Technician",
    team,
    primarySkill: team === "Maintenance Team" ? "General Maintenance" : team,
    siteCoverage: deriveCoverage(history),
    status: deriveStatus(options.workload, history),
    phone: "Not provided",
    email: user.email,
    bio: "Technician account managed through Servi user provisioning and maintenance assignments.",
    workload: buildWorkload(options.workload, history),
    scorecard: buildScorecard(options.scorecard, options.workload),
    history: history.map(mapHistoryItem),
  };
}

function mapPayloadToApiUser(payload: TechnicianUpsertPayload, technicianId?: string): ApiUserPayload {
  const apiPayload: ApiUserPayload = {
    username: payload.username,
    firstName: payload.firstName,
    lastName: payload.lastName,
    middleName: payload.middleName || undefined,
    email: payload.email,
    role: "technician",
  };

  if (technicianId) {
    apiPayload._id = technicianId;
  }

  const password = payload.password.trim();

  if (!technicianId || password.length > 0) {
    apiPayload.password = password;
  }

  return apiPayload;
}

async function fetchTechnicianUsers() {
  return requestJson<ApiAuthUser[]>("/user", {
    query: {
      fields: TECHNICIAN_FIELDS,
      limit: 100,
      sort: "firstName",
      order: "asc",
      filter: "role:technician",
    },
  });
}

async function fetchTechnicianUser(technicianId: string) {
  return requestJson<ApiAuthUser>(`/user/${technicianId}`, {
    query: {
      fields: TECHNICIAN_FIELDS,
    },
  });
}

export const techniciansService = {
  async list(): Promise<ApiResult<TechnicianRecord[]>> {
    return createApiResult(async () => {
      const [users, workloadResult] = await Promise.all([
        fetchTechnicianUsers(),
        maintenanceService.technicianWorkloads(),
      ]);

      if (workloadResult.error) {
        throw workloadResult.error;
      }

      return users.map((user) =>
        mapUserToTechnicianRecord(user, {
          workload: workloadResult.data.find((item) => item.technician._id === user._id),
        }),
      );
    });
  },

  async getById(technicianId: string): Promise<ApiResult<TechnicianRecord>> {
    return createApiResult(async () => {
      const [user, workloadResult, historyResult, scorecardResult] = await Promise.all([
        fetchTechnicianUser(technicianId),
        maintenanceService.technicianWorkloads(),
        maintenanceService.technicianHistory(technicianId),
        maintenanceService.technicianScorecard(technicianId),
      ]);

      if (workloadResult.error) throw workloadResult.error;
      if (historyResult.error) throw historyResult.error;
      if (scorecardResult.error) throw scorecardResult.error;

      return mapUserToTechnicianRecord(user, {
        workload: workloadResult.data.find((item) => item.technician._id === technicianId),
        history: historyResult.data,
        scorecard: scorecardResult.data,
      });
    });
  },

  async save(payload: TechnicianUpsertPayload, technicianId?: string): Promise<ApiResult<TechnicianMutationResponse>> {
    return createApiResult(async () => {
      const result = await requestEnvelope<ApiAuthUser, ApiUserPayload>("/user", {
        method: technicianId ? "PUT" : "POST",
        body: mapPayloadToApiUser(payload, technicianId),
      });

      if (!result.data) {
        throw new Error("Technician response did not include account data.");
      }

      return {
        technician: mapUserToTechnicianRecord(result.data),
        message: result.message,
      };
    });
  },

  async delete(technicianId: string): Promise<ApiResult<{ id: string; message: string }>> {
    return createApiResult(async () => {
      const result = await requestEnvelope<null>(`/user/${technicianId}`, {
        method: "DELETE",
      });

      return {
        id: technicianId,
        message: result.message,
      };
    });
  },
};

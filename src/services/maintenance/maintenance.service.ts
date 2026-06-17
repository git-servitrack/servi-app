import type {
  MaintenanceAssignment,
  MaintenancePriority,
  MaintenanceRecord,
  MaintenanceStatus,
  RepairAction,
} from "@/features/maintenance/types/maintenance";
import { createApiResult, requestEnvelope, requestJson } from "@/services/http/client";
import type { ApiResult, QueryParams } from "@/services/http/types";
import type { ApiAuthUser } from "@/services/auth/session";
import { serviceRequestsService } from "@/services/service-requests/service-requests.service";
import type {
  ApiMaintenancePayload,
  ApiMaintenanceRecord,
  ApiMaintenanceUser,
  ApiRepairAction,
  DiagnosisNotesPayload,
  HoldMaintenancePayload,
  MaintenanceAssignmentPayload,
  MaintenanceFormOptions,
  MaintenanceMutationResponse,
  OpenMaintenanceFromRequestPayload,
  RepairActionPayload,
  StartMaintenancePayload,
  TechnicianScorecardSummary,
  TechnicianWorkloadSummary,
} from "@/services/maintenance/contracts";

const MAINTENANCE_FIELDS = [
  "_id",
  "workOrder",
  "asset",
  "serviceRequest",
  "status",
  "diagnosisNotes",
  "assignment",
  "repairActions",
  "timeline",
  "completion",
  "createdAt",
  "updatedAt",
].join(",");

const MAINTENANCE_POPULATE = [
  "asset.name",
  "asset.site",
  "asset.assignedTeam",
  "serviceRequest.title",
  "serviceRequest.priority",
  "assignment.technician.username",
  "assignment.technician.firstName",
  "assignment.technician.lastName",
  "assignment.technician.email",
].join(",");

const TECHNICIAN_FIELDS = "_id,username,firstName,lastName,email,role";

function formatDateTime(value?: string) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toISOString().slice(0, 16);
}

function getPersonName(person: ApiMaintenanceUser) {
  return [person.firstName, person.lastName].filter(Boolean).join(" ") || person.username || person.email;
}

function mapTechnicianOption(user: Pick<ApiAuthUser, "_id" | "username" | "firstName" | "lastName" | "email">) {
  return {
    id: user._id,
    name: [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username,
    email: user.email,
  };
}

function getAssetDetails(asset: ApiMaintenanceRecord["asset"]) {
  if (!asset) {
    return {
      id: "",
      name: "Unassigned asset",
      site: "Unassigned site",
      team: "Maintenance Team",
    };
  }

  if (typeof asset === "string") {
    return {
      id: asset,
      name: "Unassigned asset",
      site: "Unassigned site",
      team: "Maintenance Team",
    };
  }

  return {
    id: asset._id,
    name: asset.name,
    site: asset.site,
    team: asset.assignedTeam,
  };
}

function getServiceRequestDetails(serviceRequest: ApiMaintenanceRecord["serviceRequest"]) {
  if (!serviceRequest) {
    return {
      id: "",
      ticket: "Unlinked request",
      priority: "Medium" as MaintenancePriority,
    };
  }

  if (typeof serviceRequest === "string") {
    return {
      id: serviceRequest,
      ticket: `SR-${serviceRequest.slice(-6).toUpperCase()}`,
      priority: "Medium" as MaintenancePriority,
    };
  }

  return {
    id: serviceRequest._id,
    ticket: `SR-${serviceRequest._id.slice(-6).toUpperCase()}`,
    priority: serviceRequest.priority,
  };
}

function getAssignmentDetails(assignment: ApiMaintenanceRecord["assignment"]): MaintenanceAssignment {
  if (!assignment) {
    return {
      technicianId: "",
      technician: "Unassigned technician",
      team: "Maintenance Team",
      shift: "",
      eta: "",
    };
  }

  const technician = assignment.technician;

  if (!technician) {
    return {
      technicianId: "",
      technician: "Unassigned technician",
      team: assignment.team ?? "Maintenance Team",
      shift: assignment.shift ?? "",
      eta: assignment.eta ?? "",
    };
  }

  if (typeof technician === "string") {
    return {
      technicianId: technician,
      technician: "Unassigned technician",
      team: assignment.team ?? "Maintenance Team",
      shift: assignment.shift ?? "",
      eta: assignment.eta ?? "",
    };
  }

  return {
    technicianId: technician._id,
    technician: getPersonName(technician),
    team: assignment.team ?? "Maintenance Team",
    shift: assignment.shift ?? "",
    eta: assignment.eta ?? "",
  };
}

function mapRepairAction(action: RepairActionPayload | ApiRepairAction, index: number): RepairAction {
  return {
    id: "_id" in action && action._id ? action._id : `RA-${index + 1}`,
    title: action.title,
    owner: action.owner,
    status: action.status ?? "Pending",
    note: action.note ?? "",
  };
}

function mapApiMaintenanceToRecord(item: ApiMaintenanceRecord): MaintenanceRecord {
  const asset = getAssetDetails(item.asset);
  const serviceRequest = getServiceRequestDetails(item.serviceRequest);
  const assignment = getAssignmentDetails(item.assignment);

  return {
    id: item._id,
    workOrder: item.workOrder,
    assetId: asset.id,
    assetName: asset.name,
    site: asset.site,
    serviceRequestId: serviceRequest.id,
    requestTicket: serviceRequest.ticket,
    status: item.status,
    priority: serviceRequest.priority,
    assignedTeam: assignment.team || asset.team,
    scheduledFor: assignment.eta,
    diagnosisNotes: item.diagnosisNotes || "No diagnosis notes yet.",
    assignment,
    repairActions: (item.repairActions ?? []).map(mapRepairAction),
    timeline: (item.timeline ?? []).map((event, index) => ({
      id: event._id ?? `MT-${index + 1}`,
      title: event.title,
      description: event.description,
      createdAt: formatDateTime(event.createdAt),
      actor: event.actor,
    })),
    completion: {
      resolution: item.completion?.resolution ?? "",
      partsUsed: item.completion?.partsUsed ?? "",
      verifiedBy: item.completion?.verifiedBy ?? "",
      completedAt: formatDateTime(item.completion?.completedAt),
    },
  };
}

function buildMaintenanceQuery(query?: QueryParams): QueryParams {
  return {
    fields: MAINTENANCE_FIELDS,
    populate: MAINTENANCE_POPULATE,
    limit: 100,
    sort: "createdAt",
    order: "desc",
    ...query,
  };
}

function mapAssignmentPayload(payload: MaintenanceAssignmentPayload) {
  return {
    technician: payload.technicianId,
    team: payload.team,
    shift: payload.shift,
    eta: payload.eta,
  };
}

function mapMutationResponse(message: string, item: ApiMaintenanceRecord | null): MaintenanceMutationResponse {
  if (!item) {
    throw new Error("Maintenance response did not include record data.");
  }

  return {
    item: mapApiMaintenanceToRecord(item),
    message,
  };
}

export const maintenanceService = {
  async list(query?: QueryParams): Promise<ApiResult<MaintenanceRecord[]>> {
    return createApiResult(async () => {
      const items = await requestJson<ApiMaintenanceRecord[]>("/maintenance", {
        query: buildMaintenanceQuery(query),
      });

      return items.map(mapApiMaintenanceToRecord);
    });
  },

  async getById(maintenanceId: string): Promise<ApiResult<MaintenanceRecord>> {
    return createApiResult(async () => {
      const item = await requestJson<ApiMaintenanceRecord>(`/maintenance/${maintenanceId}`, {
        query: {
          fields: MAINTENANCE_FIELDS,
          populate: MAINTENANCE_POPULATE,
        },
      });

      return mapApiMaintenanceToRecord(item);
    });
  },

  async history(query?: QueryParams): Promise<ApiResult<MaintenanceRecord[]>> {
    return createApiResult(async () => {
      const items = await requestJson<ApiMaintenanceRecord[]>("/maintenance/history", {
        query: buildMaintenanceQuery(query),
      });

      return items.map(mapApiMaintenanceToRecord);
    });
  },

  async assetHistory(assetId: string, query?: QueryParams): Promise<ApiResult<MaintenanceRecord[]>> {
    return createApiResult(async () => {
      const items = await requestJson<ApiMaintenanceRecord[]>(`/maintenance/history/asset/${assetId}`, {
        query: buildMaintenanceQuery(query),
      });

      return items.map(mapApiMaintenanceToRecord);
    });
  },

  async formOptions(): Promise<ApiResult<MaintenanceFormOptions>> {
    return createApiResult(async () => {
      const [technicians, serviceRequestResult] = await Promise.all([
        requestJson<ApiAuthUser[]>("/user", {
          query: {
            fields: TECHNICIAN_FIELDS,
            limit: 100,
            sort: "firstName",
            order: "asc",
            filter: "role:technician",
          },
        }),
        serviceRequestsService.list(),
      ]);

      if (serviceRequestResult.error) {
        throw serviceRequestResult.error;
      }

      return {
        technicians: technicians.map(mapTechnicianOption),
        serviceRequests: serviceRequestResult.data,
      };
    });
  },

  async create(payload: ApiMaintenancePayload): Promise<ApiResult<MaintenanceMutationResponse>> {
    return createApiResult(async () => {
      const result = await requestEnvelope<ApiMaintenanceRecord, ApiMaintenancePayload>("/maintenance", {
        method: "POST",
        body: payload,
      });

      return mapMutationResponse(result.message, result.data);
    });
  },

  async openFromRequest(payload: OpenMaintenanceFromRequestPayload): Promise<ApiResult<MaintenanceMutationResponse>> {
    return createApiResult(async () => {
      const result = await requestEnvelope<ApiMaintenanceRecord>("/maintenance/from-request", {
        method: "POST",
        body: {
          ...payload,
          assignment: mapAssignmentPayload(payload.assignment),
        },
      });

      return mapMutationResponse(result.message, result.data);
    });
  },

  async updateAssignment(
    maintenanceId: string,
    payload: MaintenanceAssignmentPayload,
  ): Promise<ApiResult<MaintenanceMutationResponse>> {
    return createApiResult(async () => {
      const result = await requestEnvelope<ApiMaintenanceRecord>(`/maintenance/${maintenanceId}/assign-technician`, {
        method: "PATCH",
        body: mapAssignmentPayload(payload),
      });

      return mapMutationResponse(result.message, result.data);
    });
  },

  async start(
    maintenanceId: string,
    payload: StartMaintenancePayload,
  ): Promise<ApiResult<MaintenanceMutationResponse>> {
    return createApiResult(async () => {
      const result = await requestEnvelope<ApiMaintenanceRecord>(`/maintenance/${maintenanceId}/start`, {
        method: "PATCH",
        body: payload,
      });

      return mapMutationResponse(result.message, result.data);
    });
  },

  async saveDiagnosis(
    maintenanceId: string,
    payload: DiagnosisNotesPayload,
  ): Promise<ApiResult<MaintenanceMutationResponse>> {
    return createApiResult(async () => {
      const result = await requestEnvelope<ApiMaintenanceRecord>(`/maintenance/${maintenanceId}/diagnosis`, {
        method: "PATCH",
        body: payload,
      });

      return mapMutationResponse(result.message, result.data);
    });
  },

  async addRepairAction(
    maintenanceId: string,
    payload: RepairActionPayload,
  ): Promise<ApiResult<MaintenanceMutationResponse>> {
    return createApiResult(async () => {
      const result = await requestEnvelope<ApiMaintenanceRecord>(`/maintenance/${maintenanceId}/repair-actions`, {
        method: "POST",
        body: payload,
      });

      return mapMutationResponse(result.message, result.data);
    });
  },

  async updateRepairActions(
    maintenanceId: string,
    actions: RepairAction[],
  ): Promise<ApiResult<MaintenanceMutationResponse>> {
    return createApiResult(async () => {
      const result = await requestEnvelope<ApiMaintenanceRecord, { _id: string; repairActions: ApiRepairAction[] }>("/maintenance", {
        method: "PUT",
        body: {
          _id: maintenanceId,
          repairActions: actions.map((action) => ({
            title: action.title,
            owner: action.owner,
            status: action.status,
            note: action.note,
          })),
        },
      });

      return mapMutationResponse(result.message, result.data);
    });
  },

  async hold(
    maintenanceId: string,
    payload: HoldMaintenancePayload,
  ): Promise<ApiResult<MaintenanceMutationResponse>> {
    return createApiResult(async () => {
      const result = await requestEnvelope<ApiMaintenanceRecord>(`/maintenance/${maintenanceId}/hold`, {
        method: "PATCH",
        body: payload,
      });

      return mapMutationResponse(result.message, result.data);
    });
  },

  async updateStatus(
    maintenanceId: string,
    status: Exclude<MaintenanceStatus, "Completed">,
  ): Promise<ApiResult<MaintenanceMutationResponse>> {
    return createApiResult(async () => {
      const result = await requestEnvelope<ApiMaintenanceRecord, { _id: string; status: MaintenanceStatus }>("/maintenance", {
        method: "PUT",
        body: {
          _id: maintenanceId,
          status,
        },
      });

      return mapMutationResponse(result.message, result.data);
    });
  },

  async complete(
    maintenanceId: string,
    payload: {
      resolution: string;
      partsUsed: string;
      verifiedBy: string;
      actor: string;
    },
  ): Promise<ApiResult<MaintenanceMutationResponse>> {
    return createApiResult(async () => {
      const result = await requestEnvelope<ApiMaintenanceRecord>(`/maintenance/${maintenanceId}/complete`, {
        method: "PATCH",
        body: payload,
      });

      return mapMutationResponse(result.message, result.data);
    });
  },

  async delete(maintenanceId: string): Promise<ApiResult<{ id: string; message: string }>> {
    return createApiResult(async () => {
      const result = await requestEnvelope<null>(`/maintenance/${maintenanceId}`, {
        method: "DELETE",
      });

      return {
        id: maintenanceId,
        message: result.message,
      };
    });
  },

  async technicianHistory(technicianId: string, query?: QueryParams): Promise<ApiResult<MaintenanceRecord[]>> {
    return createApiResult(async () => {
      const items = await requestJson<ApiMaintenanceRecord[]>(`/maintenance/history/technician/${technicianId}`, {
        query: buildMaintenanceQuery(query),
      });

      return items.map(mapApiMaintenanceToRecord);
    });
  },

  async technicianWorkloads(query?: QueryParams): Promise<ApiResult<TechnicianWorkloadSummary[]>> {
    return createApiResult(async () => {
      return requestJson<TechnicianWorkloadSummary[]>("/maintenance/technicians/workloads", {
        query,
      });
    });
  },

  async technicianScorecard(
    technicianId: string,
    query?: QueryParams,
  ): Promise<ApiResult<TechnicianScorecardSummary>> {
    return createApiResult(async () => {
      return requestJson<TechnicianScorecardSummary>(`/maintenance/technicians/${technicianId}/scorecard`, {
        query,
      });
    });
  },
};

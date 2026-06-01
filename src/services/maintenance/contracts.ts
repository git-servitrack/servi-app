import type {
  MaintenanceAssignment,
  MaintenanceCompletionValues,
  MaintenancePriority,
  MaintenanceRecord,
  MaintenanceStatus,
  RepairAction,
} from "@/features/maintenance/types/maintenance";
import type { ServiceRequestRecord } from "@/features/service-requests/types/service-requests";
import type { ApiAuthUser } from "@/services/auth/session";
import type { ApiAssetRecord } from "@/services/assets/contracts";
import type { ApiServiceRequestRecord } from "@/services/service-requests/contracts";

export type ApiMaintenanceUser = Pick<
  ApiAuthUser,
  "_id" | "username" | "firstName" | "lastName" | "email" | "role"
>;

export type ApiMaintenanceAsset = Pick<ApiAssetRecord, "_id" | "name" | "site" | "assignedTeam">;

export type ApiMaintenanceServiceRequest = Pick<
  ApiServiceRequestRecord,
  "_id" | "priority" | "title"
>;

export interface ApiMaintenanceAssignment {
  technician: string | ApiMaintenanceUser;
  team: string;
  shift: string;
  eta: string;
}

export interface ApiRepairAction {
  _id?: string;
  title: string;
  owner: string;
  status: RepairAction["status"];
  note?: string;
}

export interface ApiMaintenanceTimelineEvent {
  _id?: string;
  title: string;
  description: string;
  actor: string;
  createdAt?: string;
}

export interface ApiMaintenanceCompletion {
  resolution?: string;
  partsUsed?: string;
  verifiedBy?: string;
  completedAt?: string;
}

export interface ApiMaintenanceRecord {
  _id: string;
  workOrder: string;
  asset: string | ApiMaintenanceAsset;
  serviceRequest: string | ApiMaintenanceServiceRequest;
  status: MaintenanceStatus;
  diagnosisNotes?: string;
  assignment: ApiMaintenanceAssignment;
  repairActions?: ApiRepairAction[];
  timeline?: ApiMaintenanceTimelineEvent[];
  completion?: ApiMaintenanceCompletion;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiMaintenancePayload {
  _id?: string;
  workOrder?: string;
  asset: string;
  serviceRequest: string;
  status?: MaintenanceStatus;
  diagnosisNotes?: string;
  assignment: {
    technician: string;
    team: string;
    shift: string;
    eta: string;
  };
  repairActions?: ApiRepairAction[];
  completion?: ApiMaintenanceCompletion;
}

export interface OpenMaintenanceFromRequestPayload {
  serviceRequest: string;
  workOrder?: string;
  assignment: MaintenanceAssignmentPayload;
  diagnosisNotes?: string;
}

export interface MaintenanceTechnicianOption {
  id: string;
  name: string;
  email: string;
}

export interface MaintenanceFormOptions {
  technicians: MaintenanceTechnicianOption[];
  serviceRequests: ServiceRequestRecord[];
}

export type MaintenanceAssignmentPayload = Omit<MaintenanceAssignment, "technician">;

export type MaintenanceCompletionPayload = Omit<MaintenanceCompletionValues, "completedAt"> & {
  completedAt?: string;
  actor: string;
};

export interface DiagnosisNotesPayload {
  diagnosisNotes: string;
  actor: string;
}

export interface RepairActionPayload {
  title: string;
  owner: string;
  status?: RepairAction["status"];
  note?: string;
  actor: string;
}

export interface HoldMaintenancePayload {
  reason: string;
  actor: string;
}

export interface StartMaintenancePayload {
  actor: string;
}

export interface MaintenanceMutationResponse {
  item: MaintenanceRecord;
  message: string;
}

export interface MaintenanceStatusCount {
  status: MaintenanceStatus;
  count: number;
}

export interface TechnicianWorkloadSummary {
  technician: ApiMaintenanceUser;
  totalJobs: number;
  activeJobs: number;
  completedJobs: number;
  statusBreakdown: MaintenanceStatusCount[];
}

export interface TechnicianScorecardSummary {
  technician: ApiMaintenanceUser;
  dateRange: {
    from?: string;
    to?: string;
  };
  totalJobs: number;
  activeJobs: number;
  completedJobs: number;
  completionRate: number;
  repairActions: number;
  completedRepairActions: number;
  repairActionCompletionRate: number;
  lastCompletedAt: string | null;
  statusBreakdown: MaintenanceStatusCount[];
}

export type { MaintenancePriority };

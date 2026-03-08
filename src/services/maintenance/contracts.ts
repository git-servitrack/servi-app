import type {
  MaintenanceAssignment,
  MaintenanceCompletionValues,
  MaintenanceRecord,
} from "@/features/maintenance/types/maintenance";

export type MaintenanceAssignmentPayload = MaintenanceAssignment;
export type MaintenanceCompletionPayload = MaintenanceCompletionValues;

export interface MaintenanceAssignmentMutationResponse {
  item: MaintenanceRecord;
  message: string;
}

export interface MaintenanceCompletionMutationResponse {
  item: MaintenanceRecord;
  message: string;
}

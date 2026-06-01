export type MaintenanceStatus =
  | "Assigned"
  | "Diagnosing"
  | "Awaiting Parts"
  | "Repair In Progress"
  | "On Hold"
  | "Ready for QA"
  | "Completed";
export type MaintenancePriority = "Critical" | "High" | "Medium" | "Low";

export interface MaintenanceTimelineEvent {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  actor: string;
}

export interface RepairAction {
  id: string;
  title: string;
  owner: string;
  status: "Pending" | "In Progress" | "Done";
  note: string;
}

export interface MaintenanceAssignment {
  technicianId: string;
  technician: string;
  team: string;
  shift: string;
  eta: string;
}

export interface MaintenanceCompletionValues {
  resolution: string;
  partsUsed: string;
  verifiedBy: string;
  completedAt: string;
}

export interface MaintenanceRecord {
  id: string;
  workOrder: string;
  assetId: string;
  assetName: string;
  site: string;
  serviceRequestId: string;
  requestTicket: string;
  status: MaintenanceStatus;
  priority: MaintenancePriority;
  assignedTeam: string;
  scheduledFor: string;
  diagnosisNotes: string;
  assignment: MaintenanceAssignment;
  repairActions: RepairAction[];
  timeline: MaintenanceTimelineEvent[];
  completion: MaintenanceCompletionValues;
}

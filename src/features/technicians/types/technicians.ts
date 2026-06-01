export type TechnicianStatus = "Available" | "On Assignment" | "Off Shift" | "Leave";

export interface TechnicianHistoryItem {
  id: string;
  date: string;
  workOrder: string;
  asset: string;
  result: string;
}

export interface TechnicianScorecard {
  jobsCompleted: string;
  openAssignments: string;
  responseTime: string;
  slaRate: string;
}

export interface TechnicianWorkload {
  activeAssignments: string;
  dueToday: string;
  upcomingVisits: string;
  currentShift: string;
}

export interface TechnicianRecord {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  middleName: string;
  employeeId: string;
  name: string;
  role: string;
  team: string;
  primarySkill: string;
  siteCoverage: string;
  status: TechnicianStatus;
  phone: string;
  email: string;
  bio: string;
  workload: TechnicianWorkload;
  scorecard: TechnicianScorecard;
  history: TechnicianHistoryItem[];
}

export interface TechnicianFormValues {
  username: string;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

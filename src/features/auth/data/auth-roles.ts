import { ROUTES } from "@/constants/routes";
import type { UserRoleDefinition } from "@/features/auth/types/auth";

export const authRoles: UserRoleDefinition[] = [
  {
    id: "warehouse-staff",
    label: "Warehouse Staff / Requesting Personnel",
    shortLabel: "Warehouse Staff",
    description: "Submit service requests and manage equipment records for operational teams.",
    audience: "Best for request originators and inventory-facing staff.",
    defaultRoute: ROUTES.spareParts,
  },
  {
    id: "admin-operator",
    label: "Admin / System Operator",
    shortLabel: "System Operator",
    description: "Enter service requests, assign tracking numbers, and maintain records across modules.",
    audience: "Best for dispatch, records, and coordination roles.",
    defaultRoute: ROUTES.dashboard,
  },
  {
    id: "technician",
    label: "Technicians / Maintenance Staff",
    shortLabel: "Technician",
    description: "Receive maintenance tasks, update repair logs, and attach work evidence.",
    audience: "Best for execution-focused field and shop technicians.",
    defaultRoute: ROUTES.maintenance,
  },
  {
    id: "head-technician",
    label: "Head Technicians / Supervisors",
    shortLabel: "Supervisor",
    description: "Assign work, prioritize repairs, and monitor technician throughput.",
    audience: "Best for maintenance leads and supervisory staff.",
    defaultRoute: ROUTES.dashboard,
  },
  {
    id: "project-site",
    label: "Project Site Staff / Leadmen",
    shortLabel: "Project Site",
    description: "Report site equipment issues and request field support when downtime occurs.",
    audience: "Best for site-based requesting and escalation roles.",
    defaultRoute: ROUTES.documentation,
  },
  {
    id: "management",
    label: "Management / Company",
    shortLabel: "Management",
    description: "Review reports, monitor downtime, and track operational performance at a high level.",
    audience: "Best for leadership and company-level oversight.",
    defaultRoute: ROUTES.reports,
  },
];

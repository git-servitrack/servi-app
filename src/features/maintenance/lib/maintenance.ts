import { ROUTES } from "@/constants/routes";
import type { MaintenanceRecord } from "@/features/maintenance/types/maintenance";

export function getMaintenanceById(maintenanceId: string, items: MaintenanceRecord[]) {
  return items.find((item) => item.id === maintenanceId);
}

export function getMaintenanceDetailRoute(maintenanceId: string) {
  return `${ROUTES.maintenance}/${maintenanceId}`;
}

export function getMaintenanceWorkflowRoute(maintenanceId: string) {
  return `${ROUTES.maintenance}/${maintenanceId}/workflow`;
}

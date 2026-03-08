import { ROUTES } from "@/constants/routes";
import type { TechnicianFormValues, TechnicianRecord } from "@/features/technicians/types/technicians";

export function getTechnicianById(technicianId: string, technicians: TechnicianRecord[]) {
  return technicians.find((technician) => technician.id === technicianId);
}

export function getTechnicianDetailRoute(technicianId: string) {
  return `${ROUTES.technicians}/${technicianId}`;
}

export function getTechnicianEditRoute(technicianId: string) {
  return `${ROUTES.technicians}/${technicianId}/edit`;
}

export function mapTechnicianToFormValues(technician: TechnicianRecord): TechnicianFormValues {
  return {
    name: technician.name,
    employeeId: technician.employeeId,
    role: technician.role,
    team: technician.team,
    primarySkill: technician.primarySkill,
    siteCoverage: technician.siteCoverage,
    status: technician.status,
    phone: technician.phone,
    email: technician.email,
    bio: technician.bio,
  };
}

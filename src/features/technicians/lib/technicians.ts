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
    username: technician.username,
    firstName: technician.firstName,
    lastName: technician.lastName,
    middleName: technician.middleName,
    email: technician.email,
    password: "",
    confirmPassword: "",
  };
}

import type { UserManagementFormValues, UserManagementRecord } from "@/features/user-management/types/user-management";

export const userRecords: UserManagementRecord[] = [
  {
    id: "USR-101",
    fullName: "Alex Montemayor",
    email: "alex@servi-web.local",
    department: "Operations Control",
    roleId: "admin-operator",
    status: "Active",
    invitedBy: "System Owner",
    lastSignIn: "Mar 8, 2026 08:14",
  },
  {
    id: "USR-102",
    fullName: "R. Santos",
    email: "r.santos@servi-web.local",
    department: "Maintenance Response",
    roleId: "technician",
    status: "Active",
    invitedBy: "Alex Montemayor",
    lastSignIn: "Mar 7, 2026 17:41",
  },
  {
    id: "USR-103",
    fullName: "Mae Torres",
    email: "mae.torres@servi-web.local",
    department: "Warehouse Operations",
    roleId: "warehouse-staff",
    status: "Pending Activation",
    invitedBy: "Alex Montemayor",
    lastSignIn: "Invitation pending",
  },
  {
    id: "USR-104",
    fullName: "Joel Dela Cruz",
    email: "joel.dc@servi-web.local",
    department: "Executive Reporting",
    roleId: "management",
    status: "Suspended",
    invitedBy: "System Owner",
    lastSignIn: "Feb 26, 2026 11:05",
  },
];

export const defaultUserFormValues: UserManagementFormValues = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  department: "",
  roleId: "warehouse-staff",
  status: "Pending Activation",
};

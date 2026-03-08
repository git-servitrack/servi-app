export type UserAccountStatus = "Active" | "Pending Activation" | "Suspended";

export interface UserManagementRecord {
  id: string;
  fullName: string;
  email: string;
  department: string;
  roleId: import("@/features/auth/types/auth").UserRoleId;
  status: UserAccountStatus;
  invitedBy: string;
  lastSignIn: string;
}

export interface UserManagementFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  department: string;
  roleId: import("@/features/auth/types/auth").UserRoleId;
  status: UserAccountStatus;
}

export type UserAccountStatus = "Active" | "Pending Activation" | "Suspended";

export interface UserManagementRecord {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  middleName: string;
  fullName: string;
  email: string;
  roleId: import("@/features/auth/types/auth").UserRoleId;
  status: UserAccountStatus;
  invitedBy: string;
  lastSignIn: string;
}

export interface UserManagementFormValues {
  username: string;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  password: string;
  confirmPassword: string;
  roleId: import("@/features/auth/types/auth").UserRoleId;
}

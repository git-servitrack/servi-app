export type UserRoleId =
  | "warehouse-staff"
  | "admin-operator"
  | "technician"
  | "head-technician"
  | "project-site"
  | "management";

export interface UserRoleDefinition {
  id: UserRoleId;
  label: string;
  shortLabel: string;
  description: string;
  audience: string;
  defaultRoute: string;
}

export interface SignInFormValues {
  identifier: string;
  password: string;
}

export interface SignUpFormValues {
  fullName: string;
  email: string;
  password: string;
}

export interface RecoverAccountFormValues {
  email: string;
}

export interface AuthSessionPreview {
  fullName: string;
  roleId: UserRoleId;
  roleLabel: string;
  redirectTo: string;
}

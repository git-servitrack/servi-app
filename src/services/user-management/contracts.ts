import type { UserManagementFormValues, UserManagementRecord } from "@/features/user-management/types/user-management";
import type { ApiAuthUser, ApiUserRole } from "@/services/auth/session";

export type UserManagementUpsertPayload = Omit<UserManagementFormValues, "confirmPassword">;

export interface ApiUserPayload {
  _id?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  email?: string;
  password?: string;
  avatar?: string | null;
  role?: ApiUserRole;
}

export interface UserManagementMutationResponse {
  user: UserManagementRecord;
  message: string;
}

export type UserManagementApiRecord = ApiAuthUser;

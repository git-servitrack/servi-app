import type { UserManagementFormValues, UserManagementRecord } from "@/features/user-management/types/user-management";

export type UserManagementUpsertPayload = Omit<UserManagementFormValues, "confirmPassword">;

export interface UserManagementMutationResponse {
  user: UserManagementRecord;
  message: string;
}

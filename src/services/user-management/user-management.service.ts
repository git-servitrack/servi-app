import { userRecords } from "@/features/user-management/data/user-management";
import type { UserManagementRecord } from "@/features/user-management/types/user-management";
import { AppRequestError } from "@/services/http/errors";
import { createApiResult, simulateNetwork } from "@/services/http/client";
import type { ApiResult } from "@/services/http/types";
import type { UserManagementMutationResponse, UserManagementUpsertPayload } from "@/services/user-management/contracts";

function buildUser(payload: UserManagementUpsertPayload, userId?: string): UserManagementRecord {
  const existing = userId ? userRecords.find((item) => item.id === userId) : undefined;

  return {
    id: userId ?? `USR-${userRecords.length + 101}`,
    invitedBy: existing?.invitedBy ?? "Alex Montemayor",
    lastSignIn: existing?.lastSignIn ?? "Invitation pending",
    ...payload,
  };
}

export const userManagementService = {
  async save(payload: UserManagementUpsertPayload, userId?: string): Promise<ApiResult<UserManagementMutationResponse>> {
    return createApiResult(async () => {
      const duplicateEmail = userRecords.find((user) => user.email.toLowerCase() === payload.email.toLowerCase() && user.id !== userId);

      if (duplicateEmail) {
        throw new AppRequestError({
          code: "VALIDATION_ERROR",
          message: "A user with this work email already exists.",
          status: 409,
          fieldErrors: {
            email: "Use a unique work email for each account.",
          },
        });
      }

      const user = buildUser(payload, userId);

      return simulateNetwork({
        user,
        message: userId ? "User account updated successfully." : "User account provisioned successfully.",
      });
    });
  },
};

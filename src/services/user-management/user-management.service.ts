import type { UserManagementRecord } from "@/features/user-management/types/user-management";
import {
  mapApiRoleToFrontendRole,
  mapFrontendRoleToApiRole,
  type ApiAuthUser,
} from "@/services/auth/session";
import { createApiResult, requestEnvelope, requestJson } from "@/services/http/client";
import type { ApiResult } from "@/services/http/types";
import type {
  ApiUserPayload,
  UserManagementApiRecord,
  UserManagementMutationResponse,
  UserManagementUpsertPayload,
} from "@/services/user-management/contracts";

const USER_FIELDS = "_id,username,firstName,lastName,middleName,email,avatar,role";

function getFullName(user: Pick<UserManagementApiRecord, "firstName" | "lastName" | "username">) {
  return [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username;
}

function mapApiUserToRecord(user: UserManagementApiRecord): UserManagementRecord {
  return {
    id: user._id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    middleName: user.middleName ?? "",
    fullName: getFullName(user),
    email: user.email,
    roleId: mapApiRoleToFrontendRole(user.role),
    status: "Active",
    invitedBy: "API",
    lastSignIn: "Available after audit logging is connected",
  };
}

function mapPayloadToApiUser(payload: UserManagementUpsertPayload, userId?: string): ApiUserPayload {
  const apiPayload: ApiUserPayload = {
    username: payload.username,
    firstName: payload.firstName,
    lastName: payload.lastName,
    middleName: payload.middleName || undefined,
    email: payload.email,
    role: mapFrontendRoleToApiRole(payload.roleId),
  };

  if (userId) {
    apiPayload._id = userId;
  }

  const password = payload.password.trim();

  if (!userId || password.length > 0) {
    apiPayload.password = password;
  }

  return apiPayload;
}

export const userManagementService = {
  async list(): Promise<ApiResult<UserManagementRecord[]>> {
    return createApiResult(async () => {
      const users = await requestJson<ApiAuthUser[]>("/user", {
        query: {
          fields: USER_FIELDS,
          limit: 100,
          sort: "createdAt",
          order: "desc",
        },
      });

      return users.map(mapApiUserToRecord);
    });
  },

  async getById(userId: string): Promise<ApiResult<UserManagementRecord>> {
    return createApiResult(async () => {
      const user = await requestJson<ApiAuthUser>(`/user/${userId}`, {
        query: {
          fields: USER_FIELDS,
        },
      });

      return mapApiUserToRecord(user);
    });
  },

  async save(payload: UserManagementUpsertPayload, userId?: string): Promise<ApiResult<UserManagementMutationResponse>> {
    return createApiResult(async () => {
      const result = await requestEnvelope<ApiAuthUser, ApiUserPayload>("/user", {
        method: userId ? "PUT" : "POST",
        body: mapPayloadToApiUser(payload, userId),
      });

      if (!result.data) {
        throw new Error("User response did not include account data.");
      }

      return {
        user: mapApiUserToRecord(result.data),
        message: result.message,
      };
    });
  },

  async delete(userId: string): Promise<ApiResult<{ id: string; message: string }>> {
    return createApiResult(async () => {
      const result = await requestEnvelope<null>(`/user/${userId}`, {
        method: "DELETE",
      });

      return {
        id: userId,
        message: result.message,
      };
    });
  },
};

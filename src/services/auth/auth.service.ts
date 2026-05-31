import { authRoles } from "@/features/auth/data/auth-roles";
import { getRoleDefinition } from "@/features/auth/lib/auth";
import type { AuthSessionPreview } from "@/features/auth/types/auth";
import { createApiResult, requestJson, simulateNetwork } from "@/services/http/client";
import { AppRequestError } from "@/services/http/errors";
import type { ApiResult } from "@/services/http/types";
import { buildCurrentSession, storeAuthTokens, type ApiAuthUser } from "@/services/auth/session";
import type {
  AuthSuccessResponse,
  CurrentUserResponse,
  RecoverAccountPayload,
  RecoverAccountResponse,
  SignInPayload,
} from "@/services/auth/contracts";

function buildSession(fullName: string, roleId: (typeof authRoles)[number]["id"]): AuthSessionPreview {
  const role = getRoleDefinition(roleId);

  return {
    fullName,
    roleId,
    roleLabel: role.label,
    redirectTo: role.defaultRoute,
  };
}

function persistAuthTokensFromResponse(response: AuthSuccessResponse) {
  if (!response.accessToken) return;

  storeAuthTokens({
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
  });
}

export const authService = {
  async signIn(payload: SignInPayload): Promise<ApiResult<AuthSuccessResponse>> {
    return createApiResult(async () => {
      if (!payload.identifier.includes("@") && payload.identifier.length < 5) {
        throw new AppRequestError({
          code: "VALIDATION_ERROR",
          message: "Use your work email or assigned username.",
          status: 422,
          fieldErrors: {
            identifier: "Use a valid work email or username.",
          },
        });
      }

      const matchedRole = payload.identifier.toLowerCase().includes("manage")
        ? "management"
        : payload.identifier.toLowerCase().includes("tech")
          ? "technician"
          : "admin-operator";

      const response: AuthSuccessResponse = {
        session: buildSession("Alex Montemayor", matchedRole),
        message: "Sign-in completed. Session routing is ready for backend integration.",
      };

      persistAuthTokensFromResponse(response);

      return simulateNetwork(response);
    });
  },

  async recoverAccount(payload: RecoverAccountPayload): Promise<ApiResult<RecoverAccountResponse>> {
    return createApiResult(async () => {
      if (!payload.email.endsWith(".com") && !payload.email.endsWith(".ph") && !payload.email.endsWith(".local")) {
        throw new AppRequestError({
          code: "VALIDATION_ERROR",
          message: "Use the work email connected to your SERVI-WEB account.",
          status: 422,
          fieldErrors: {
            email: "Use the email issued for this workspace.",
          },
        });
      }

      return simulateNetwork({
        email: payload.email,
        message: "Recovery instructions placeholder sent. Replace this with real email delivery when auth APIs are ready.",
      });
    });
  },

  async getCurrentUser(): Promise<ApiResult<CurrentUserResponse>> {
    return createApiResult(async () => {
      const user = await requestJson<ApiAuthUser>("/auth/me");
      const currentSession = buildCurrentSession(user);

      return {
        ...currentSession,
        message: "Current user loaded successfully.",
      };
    });
  },
};

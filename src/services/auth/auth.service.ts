import { createApiResult, requestEnvelope, requestJson, simulateNetwork } from "@/services/http/client";
import { AppRequestError } from "@/services/http/errors";
import type { ApiResult } from "@/services/http/types";
import { buildCurrentSession, storeAuthTokens, type ApiAuthUser } from "@/services/auth/session";
import type {
  ApiAuthResponse,
  AuthSuccessResponse,
  CurrentUserResponse,
  RecoverAccountPayload,
  RecoverAccountResponse,
  SignInPayload,
} from "@/services/auth/contracts";

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
      const result = await requestEnvelope<ApiAuthResponse, { email: string; password: string }>("/auth/login", {
        method: "POST",
        body: {
          email: payload.identifier,
          password: payload.password,
        },
        includeAuth: false,
      });

      if (!result.data) {
        throw new Error("Login response did not include session data.");
      }

      const currentSession = buildCurrentSession(result.data.user);
      const response: AuthSuccessResponse = {
        user: currentSession.user,
        session: currentSession.session,
        message: result.message,
        accessToken: result.data.accessToken,
        refreshToken: result.data.refreshToken,
      };

      persistAuthTokensFromResponse(response);

      return simulateNetwork(response);
    });
  },

  async recoverAccount(payload: RecoverAccountPayload): Promise<ApiResult<RecoverAccountResponse>> {
    return createApiResult(async () => {
      if (!payload.email.trim()) {
        throw new AppRequestError({
          code: "VALIDATION_ERROR",
          message: "Enter the work email connected to your SERVI-WEB account.",
          status: 422,
          fieldErrors: {
            email: "Work email is required.",
          },
        });
      }

      return simulateNetwork({
        email: payload.email,
        message:
          "Please contact your Head Technician or Admin to reset or change your password.",
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

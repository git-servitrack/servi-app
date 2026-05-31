import type { RecoverAccountFormValues, SignInFormValues, AuthSessionPreview } from "@/features/auth/types/auth";
import type { ApiAuthUser } from "@/services/auth/session";

export type SignInPayload = SignInFormValues;
export type RecoverAccountPayload = RecoverAccountFormValues;

export interface AuthSuccessResponse {
  session: AuthSessionPreview;
  message: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface RecoverAccountResponse {
  email: string;
  message: string;
}

export interface CurrentUserResponse {
  user: ApiAuthUser;
  session: AuthSessionPreview;
  message: string;
}

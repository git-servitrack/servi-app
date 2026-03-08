import type { RecoverAccountFormValues, SignInFormValues, AuthSessionPreview } from "@/features/auth/types/auth";

export type SignInPayload = SignInFormValues;
export type RecoverAccountPayload = RecoverAccountFormValues;

export interface AuthSuccessResponse {
  session: AuthSessionPreview;
  message: string;
}

export interface RecoverAccountResponse {
  email: string;
  message: string;
}

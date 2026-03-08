import type { ApiErrorShape } from "@/services/http/types";

export class AppRequestError extends Error {
  code: ApiErrorShape["code"];
  status?: number;
  fieldErrors?: Record<string, string>;

  constructor(error: ApiErrorShape) {
    super(error.message);
    this.name = "AppRequestError";
    this.code = error.code;
    this.status = error.status;
    this.fieldErrors = error.fieldErrors;
  }
}

export function normalizeUnknownError(error: unknown): ApiErrorShape {
  if (error instanceof AppRequestError) {
    return {
      code: error.code,
      message: error.message,
      status: error.status,
      fieldErrors: error.fieldErrors,
    };
  }

  if (error instanceof Error) {
    return {
      code: "UNKNOWN_ERROR",
      message: error.message,
    };
  }

  return {
    code: "UNKNOWN_ERROR",
    message: "Something went wrong while processing the request.",
  };
}

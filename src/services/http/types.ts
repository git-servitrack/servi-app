export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiErrorCode = "BAD_REQUEST" | "VALIDATION_ERROR" | "NOT_FOUND" | "NETWORK_ERROR" | "UNKNOWN_ERROR";

export interface ApiErrorShape {
  code: ApiErrorCode;
  message: string;
  status?: number;
  fieldErrors?: Record<string, string>;
}

export interface ApiSuccess<TData> {
  data: TData;
  error: null;
}

export interface ApiFailure {
  data: null;
  error: ApiErrorShape;
}

export type ApiResult<TData> = ApiSuccess<TData> | ApiFailure;

export interface RequestConfig<TBody = unknown> {
  method?: HttpMethod;
  body?: TBody;
  headers?: HeadersInit;
  signal?: AbortSignal;
}

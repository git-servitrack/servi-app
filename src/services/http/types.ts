export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiErrorCode =
  | "BAD_REQUEST"
  | "VALIDATION_ERROR"
  | "INVALID_TOKEN"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "NETWORK_ERROR"
  | "UNKNOWN_ERROR";

export type ApiMeta = Record<string, unknown>;

export type QueryParamValue = string | number | boolean | Date | null | undefined;

export type QueryParams = Record<string, QueryParamValue | QueryParamValue[]>;

export interface ApiEnvelope<TData> {
  success: boolean;
  message: string;
  data: TData | null;
  meta?: ApiMeta;
}

export interface ApiEnvelopeData<TData> {
  data: TData | null;
  message: string;
  meta?: ApiMeta;
}

export interface ApiErrorShape {
  code: ApiErrorCode;
  message: string;
  status?: number;
  fieldErrors?: Record<string, string>;
  meta?: ApiMeta;
}

export interface ApiSuccess<TData> {
  data: TData;
  error: null;
  message?: string;
  meta?: ApiMeta;
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
  query?: QueryParams;
  signal?: AbortSignal;
  authToken?: string | null;
  includeAuth?: boolean;
}

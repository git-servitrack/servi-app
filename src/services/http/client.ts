import { AppRequestError, normalizeUnknownError } from "@/services/http/errors";
import { API_CONFIG } from "@/config/api";
import { getAccessToken } from "@/services/auth/session";
import type {
  ApiEnvelope,
  ApiEnvelopeData,
  ApiErrorCode,
  ApiResult,
  QueryParams,
  QueryParamValue,
  RequestConfig,
} from "@/services/http/types";

export async function createApiResult<TData>(executor: () => Promise<TData>): Promise<ApiResult<TData>> {
  try {
    const data = await executor();

    return {
      data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: normalizeUnknownError(error),
    };
  }
}

function isAbsoluteUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

function normalizePath(value: string) {
  return value.startsWith("/") ? value : `/${value}`;
}

function serializeQueryValue(value: QueryParamValue) {
  if (value instanceof Date) return value.toISOString();
  if (value === null || value === undefined) return null;

  return String(value);
}

export function serializeQueryParams(query?: QueryParams) {
  if (!query) return "";

  const searchParams = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    const values = Array.isArray(value) ? value : [value];

    values.forEach((item) => {
      const serialized = serializeQueryValue(item);
      if (serialized !== null && serialized.length > 0) {
        searchParams.append(key, serialized);
      }
    });
  });

  const queryString = searchParams.toString();

  return queryString ? `?${queryString}` : "";
}

export function buildApiUrl(path: string, query?: QueryParams) {
  const basePath = isAbsoluteUrl(path) ? path : `${API_CONFIG.baseUrl}${normalizePath(path)}`;
  const queryString = serializeQueryParams(query);

  return `${basePath}${queryString}`;
}

function mapStatusToErrorCode(status: number): ApiErrorCode {
  if (status === 400) return "BAD_REQUEST";
  if (status === 401) return "UNAUTHORIZED";
  if (status === 403) return "FORBIDDEN";
  if (status === 404) return "NOT_FOUND";
  if (status === 409) return "CONFLICT";
  if (status === 422) return "VALIDATION_ERROR";

  return "UNKNOWN_ERROR";
}

function isFormDataBody(body: unknown): body is FormData {
  return typeof FormData !== "undefined" && body instanceof FormData;
}

function buildRequestInit<TBody>(config: RequestConfig<TBody>): RequestInit {
  const headers = new Headers(config.headers);
  const token = config.authToken ?? (config.includeAuth === false ? null : getAccessToken());
  const body = config.body;

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (body !== undefined && !isFormDataBody(body) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return {
    method: config.method ?? "GET",
    headers,
    body: body === undefined ? undefined : isFormDataBody(body) ? body : JSON.stringify(body),
    signal: config.signal,
  };
}

function isApiEnvelope<TData>(payload: unknown): payload is ApiEnvelope<TData> {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "success" in payload &&
    "message" in payload &&
    "data" in payload
  );
}

async function parseResponsePayload(response: Response) {
  const contentType = response.headers.get("Content-Type") ?? "";

  if (!contentType.includes("application/json")) {
    return null;
  }

  return response.json().catch(() => null);
}

export async function requestEnvelope<TResponse, TBody = unknown>(
  path: string,
  config: RequestConfig<TBody> = {},
): Promise<ApiEnvelopeData<TResponse>> {
  const response = await fetch(buildApiUrl(path, config.query), buildRequestInit(config));
  const payload = await parseResponsePayload(response);
  const envelope = isApiEnvelope<TResponse>(payload)
    ? payload
    : {
        success: response.ok,
        message: response.ok ? "Request completed successfully." : "Request failed.",
        data: payload as TResponse | null,
      };

  if (!response.ok || !envelope.success) {
    throw new AppRequestError({
      code: mapStatusToErrorCode(response.status),
      message: envelope.message || "Request failed.",
      status: response.status,
      meta: envelope.meta,
    });
  }

  return {
    data: envelope.data,
    message: envelope.message,
    meta: envelope.meta,
  };
}

export async function requestJson<TResponse, TBody = unknown>(
  path: string,
  config: RequestConfig<TBody> = {},
): Promise<TResponse> {
  const envelope = await requestEnvelope<TResponse, TBody>(path, config);

  return envelope.data as TResponse;
}

export async function requestFormData<TResponse>(
  path: string,
  body: FormData,
  config: Omit<RequestConfig<FormData>, "body"> = {},
): Promise<ApiEnvelopeData<TResponse>> {
  return requestEnvelope<TResponse, FormData>(path, {
    ...config,
    method: config.method ?? "POST",
    body,
  });
}

export async function requestRawJson<TResponse, TBody = unknown>(url: string, config: RequestConfig<TBody> = {}): Promise<TResponse> {
  const response = await fetch(url, {
    method: config.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...config.headers,
    },
    body: config.body ? JSON.stringify(config.body) : undefined,
    signal: config.signal,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new AppRequestError({
      code: "BAD_REQUEST",
      message: payload?.message ?? "Request failed.",
      status: response.status,
      fieldErrors: payload?.fieldErrors,
    });
  }

  return payload as TResponse;
}

export async function simulateNetwork<TData>(value: TData, delay = 450): Promise<TData> {
  await new Promise((resolve) => setTimeout(resolve, delay));

  return value;
}

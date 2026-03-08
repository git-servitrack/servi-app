import { AppRequestError, normalizeUnknownError } from "@/services/http/errors";
import type { ApiResult, RequestConfig } from "@/services/http/types";

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

export async function requestJson<TResponse, TBody = unknown>(url: string, config: RequestConfig<TBody> = {}): Promise<TResponse> {
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

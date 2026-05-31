const DEFAULT_API_BASE_URL = "http://localhost:5000/api/v1";

function normalizeBaseUrl(value: string) {
  return value.replace(/\/+$/, "");
}

export const API_BASE_URL = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL,
);

export const API_CONFIG = {
  baseUrl: API_BASE_URL,
} as const;

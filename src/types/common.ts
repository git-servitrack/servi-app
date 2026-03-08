export type AsyncViewState = "idle" | "loading" | "success" | "error";

export interface AppMetric {
  label: string;
  value: string;
  hint?: string;
}

export interface DetailItem {
  label: string;
  value: string;
}

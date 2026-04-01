import { cn } from "@/lib/utils";
import type { AssetStatus } from "@/features/assets/types/assets";

const STATUS_STYLES: Record<AssetStatus, string> = {
  Operational: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:ring-emerald-800",
  "Maintenance Due": "bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-800",
  "Under Repair": "bg-violet-50 text-violet-700 ring-1 ring-violet-200 dark:bg-violet-950/30 dark:text-violet-400 dark:ring-violet-800",
  Decommissioned: "bg-slate-100 text-slate-600 ring-1 ring-slate-200 dark:bg-white/6 dark:text-stone-400 dark:ring-white/10",
};

export function AssetStatusBadge({ status }: { status: AssetStatus }) {
  return (
    <span
      className={cn(
        "whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium",
        STATUS_STYLES[status],
      )}
    >
      {status}
    </span>
  );
}

import { cn } from "@/lib/utils";
import type { StockStatus } from "@/features/spare-parts/types/spare-parts";

const STATUS_STYLES: Record<StockStatus, string> = {
  "In Stock": "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:ring-emerald-800",
  "Low Stock": "bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-800",
  Critical: "bg-rose-50 text-rose-700 ring-1 ring-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:ring-rose-800",
  "Out of Stock": "bg-slate-50 text-slate-600 ring-1 ring-slate-200 dark:bg-slate-950/30 dark:text-slate-400 dark:ring-slate-700",
};

export function StockBadge({ status }: { status: StockStatus }) {
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

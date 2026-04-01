import { cn } from "@/lib/utils";
import type { MaintenanceStatus } from "@/features/maintenance/types/maintenance";

const STATUS_STYLES: Record<MaintenanceStatus, string> = {
  Assigned: "bg-sky-50 text-sky-700 ring-1 ring-sky-200 dark:bg-sky-950/30 dark:text-sky-400 dark:ring-sky-800",
  Diagnosing: "bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-800",
  "Awaiting Parts": "bg-orange-50 text-orange-700 ring-1 ring-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:ring-orange-800",
  "Repair In Progress": "bg-violet-50 text-violet-700 ring-1 ring-violet-200 dark:bg-violet-950/30 dark:text-violet-400 dark:ring-violet-800",
  "Ready for QA": "bg-teal-50 text-teal-700 ring-1 ring-teal-200 dark:bg-teal-950/30 dark:text-teal-400 dark:ring-teal-800",
  Completed: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:ring-emerald-800",
};

export function MaintenanceStatusBadge({ status }: { status: MaintenanceStatus }) {
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

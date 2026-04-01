import Link from "next/link";

import { MaintenanceStatusBadge } from "@/features/maintenance/components/maintenance-status-badge";
import { getMaintenanceDetailRoute, getMaintenanceWorkflowRoute } from "@/features/maintenance/lib/maintenance";
import type { MaintenanceRecord } from "@/features/maintenance/types/maintenance";

const PRIORITY_COLORS: Record<string, string> = {
  Critical: "#dc2626",
  High: "#d97706",
  Medium: "#145d66",
  Low: "#64748b",
};

export function MaintenanceTable({ items }: { items: MaintenanceRecord[] }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
        <p className="font-medium text-slate-900 dark:text-stone-100">No maintenance work orders</p>
        <p className="text-sm text-slate-400 dark:text-stone-500">
          Work orders will appear here once requests are converted into maintenance activity.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100 dark:divide-white/6">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50/50 sm:gap-4 sm:px-6 sm:py-4 dark:hover:bg-white/3"
        >
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
            style={{ backgroundColor: PRIORITY_COLORS[item.priority] ?? "#64748b" }}
          >
            {item.workOrder.slice(-2)}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-stone-100">
                {item.assetName}
              </p>
              <MaintenanceStatusBadge status={item.status} />
            </div>
            <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-stone-400">
              <span className="font-medium text-[#145d66] dark:text-[#86d0d8]">{item.workOrder}</span>
              {" — "}
              {item.requestTicket} · {item.site} · {item.assignedTeam}
            </p>
          </div>

          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <Link
              href={getMaintenanceDetailRoute(item.id)}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:text-stone-300 dark:hover:bg-white/6"
            >
              Details
            </Link>
            <Link
              href={getMaintenanceWorkflowRoute(item.id)}
              className="rounded-full bg-[#145d66] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#0e4d55]"
            >
              Workflow
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

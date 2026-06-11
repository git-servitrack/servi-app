import Link from "next/link";

import { ROUTES } from "@/constants/routes";
import { StatusBadge } from "@/features/dashboard/components/status-badge";
import type { ActivityItem } from "@/features/dashboard/data/dashboard-kpi-data";

const DEFAULT_LIMIT = 10;

export function TeamActivityCard({ items }: { items: ActivityItem[] }) {
  const visibleItems = items.slice(0, DEFAULT_LIMIT);

  return (
    <div className="rounded-[20px] border border-slate-200 bg-white shadow-sm sm:rounded-[24px] dark:border-white/10 dark:bg-[#171815]">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5 dark:border-white/8">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-stone-100">
            Team Activity
          </h2>
          <p className="mt-0.5 text-sm text-slate-400 dark:text-stone-500">
            Latest crew assignments and service actions
          </p>
        </div>
        <Link
          href={ROUTES.technicians}
          className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200 dark:bg-white/8 dark:text-stone-300 dark:hover:bg-white/12"
        >
          + Add Member
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="px-4 py-10 text-center text-sm text-slate-500 sm:px-6 dark:text-stone-400">
          No team activity found from maintenance or service request APIs.
        </p>
      ) : (
        <div className="max-h-[420px] divide-y divide-slate-100 overflow-y-auto dark:divide-white/6">
          {visibleItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50/50 sm:gap-4 sm:px-6 sm:py-4 dark:hover:bg-white/3"
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white sm:h-10 sm:w-10"
                style={{ backgroundColor: item.color }}
              >
                {item.initials}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                  <p className="text-sm font-semibold text-slate-900 dark:text-stone-100">
                    {item.source}
                  </p>
                  <StatusBadge status={item.status} />
                </div>
                <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-stone-400">
                  <span className="font-medium text-[#145d66] dark:text-[#86d0d8]">{item.id}</span>
                  {" - "}
                  {item.task}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import Link from "next/link";
import { Plus } from "lucide-react";

import { RECENT_REQUESTS } from "@/features/dashboard/data/dashboard-kpi-data";

export function RecentRequestsCard() {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[24px] sm:p-5 dark:border-white/10 dark:bg-[#171815]">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900 dark:text-stone-100">
          Recent Requests
        </h2>
        <Link
          href="/service-requests"
          className="flex h-7 items-center gap-1 rounded-full bg-slate-100 px-3 text-xs font-medium text-slate-600 shadow-none transition-colors hover:bg-slate-200 dark:bg-white/8 dark:text-stone-300 dark:hover:bg-white/12"
        >
          <Plus className="mr-1 h-3 w-3" />
          New
        </Link>
      </div>

      <div className="mt-4 space-y-2.5">
        {RECENT_REQUESTS.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-slate-50 dark:hover:bg-white/4"
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: item.dot }}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-700 dark:text-stone-300">
                {item.source}
              </p>
              <p className="text-xs text-slate-400 dark:text-stone-500">{item.id}</p>
            </div>
            <p className="shrink-0 text-xs text-slate-400 dark:text-stone-500">{item.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

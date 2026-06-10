import { Wrench } from "lucide-react";

import type { PartUsageItem } from "@/features/spare-parts/types/spare-parts";

export function PartUsageSection({ items }: { items: PartUsageItem[] }) {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-white shadow-sm sm:rounded-[24px] dark:border-white/10 dark:bg-[#171815]">
      <div className="border-b border-slate-100 px-5 py-4 sm:px-6 sm:py-5 dark:border-white/8">
        <h2 className="text-base font-semibold text-slate-900 dark:text-stone-100">Part usage</h2>
        <p className="mt-0.5 text-sm text-slate-400 dark:text-stone-500">
          {items.length} usage records
        </p>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-white/6">
        {items.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="font-medium text-slate-900 dark:text-stone-100">No usage recorded yet</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-stone-400">
              Maintenance job part usage will appear here after it is logged.
            </p>
          </div>
        ) : null}
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#145d66]/10 text-[#145d66] dark:bg-[#145d66]/20 dark:text-[#86d0d8]">
              <Wrench className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-stone-100">{item.asset}</p>
                <span className="text-xs text-slate-400 dark:text-stone-500">{item.date}</span>
              </div>
              <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-stone-400">
                <span className="font-medium text-[#145d66] dark:text-[#86d0d8]">{item.workOrder}</span>
                {" - "}
                {item.quantity} - {item.technician}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

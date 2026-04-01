import { Download, SlidersHorizontal } from "lucide-react";

import type { ReportFilterState } from "@/features/reports/types/reports";

const selectClass =
  "flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100";

export function ReportFilterToolbar({ filters }: { filters: ReportFilterState }) {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[24px] sm:p-5 dark:border-white/10 dark:bg-[#171815]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid flex-1 gap-4 md:grid-cols-3">
          {[
            { label: "Period", value: filters.period },
            { label: "Site", value: filters.site },
            { label: "Team", value: filters.team },
          ].map((item) => (
            <label key={item.label} className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-stone-500">{item.label}</span>
              <select defaultValue={item.value} className={selectClass}>
                <option>{item.value}</option>
              </select>
            </label>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:text-stone-300 dark:hover:bg-white/6"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Adjust filters
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-full bg-[#145d66] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0e4d55]"
          >
            <Download className="h-4 w-4" />
            Export report pack
          </button>
        </div>
      </div>
    </div>
  );
}

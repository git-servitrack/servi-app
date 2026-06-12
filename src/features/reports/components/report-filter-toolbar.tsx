import { Download, SlidersHorizontal } from "lucide-react";

import type { ReportFilterState } from "@/features/reports/types/reports";

const selectClass =
  "flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100";

const inputClass =
  "flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100 dark:placeholder:text-stone-500";

interface ReportFilterToolbarProps {
  filters: ReportFilterState;
  isLoading?: boolean;
  isExporting?: boolean;
  onChange: (filters: ReportFilterState) => void;
  onRefresh: () => void;
  onExport: () => void;
}

export function ReportFilterToolbar({
  filters,
  isLoading = false,
  isExporting = false,
  onChange,
  onRefresh,
  onExport,
}: ReportFilterToolbarProps) {
  function updateFilter<TKey extends keyof ReportFilterState>(field: TKey, value: ReportFilterState[TKey]) {
    onChange({
      ...filters,
      [field]: value,
    });
  }

  return (
    <div className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[24px] sm:p-5 dark:border-white/10 dark:bg-[#171815]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid flex-1 gap-4 md:grid-cols-3 xl:grid-cols-6">
          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-stone-500">Period</span>
            <select
              value={filters.period}
              onChange={(event) => updateFilter("period", event.target.value)}
              className={selectClass}
            >
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>This month</option>
              <option>This year</option>
            </select>
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-stone-500">From</span>
            <input
              type="date"
              value={filters.from}
              onChange={(event) => updateFilter("from", event.target.value)}
              className={inputClass}
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-stone-500">To</span>
            <input
              type="date"
              value={filters.to}
              onChange={(event) => updateFilter("to", event.target.value)}
              className={inputClass}
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-stone-500">Site</span>
            <input
              value={filters.site}
              onChange={(event) => updateFilter("site", event.target.value)}
              className={inputClass}
              placeholder="All sites"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-stone-500">Team</span>
            <input
              value={filters.team}
              onChange={(event) => updateFilter("team", event.target.value)}
              className={inputClass}
              placeholder="All teams"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-stone-500">Limit</span>
            <input
              value={filters.limit}
              onChange={(event) => updateFilter("limit", event.target.value)}
              className={inputClass}
              inputMode="numeric"
              placeholder="10"
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:text-stone-300 dark:hover:bg-white/6"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {isLoading ? "Refreshing..." : "Apply filters"}
          </button>
          <button
            type="button"
            onClick={onExport}
            disabled={isExporting}
            className="flex items-center gap-1.5 rounded-full bg-[#145d66] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0e4d55]"
          >
            <Download className="h-4 w-4" />
            {isExporting ? "Exporting..." : "Export report pack"}
          </button>
        </div>
      </div>
    </div>
  );
}

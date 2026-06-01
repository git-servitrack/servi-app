"use client";

import { Search } from "lucide-react";

import type { RequestFilterState } from "@/features/service-requests/types/service-requests";

interface RequestFiltersProps {
  filters: RequestFilterState;
  statuses: readonly string[];
  priorities: readonly string[];
  sites: readonly string[];
  onChange: (filters: RequestFilterState) => void;
}

export function RequestFilters({
  filters,
  statuses,
  priorities,
  sites,
  onChange,
}: RequestFiltersProps) {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[24px] sm:p-5 dark:border-white/10 dark:bg-[#171815]">
      <div className="grid gap-4 lg:grid-cols-[1.5fr_repeat(3,minmax(0,1fr))]">
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-slate-700 dark:text-stone-300">Search</span>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-stone-500" />
            <input
              value={filters.query}
              onChange={(event) => onChange({ ...filters, query: event.target.value })}
              className="flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100 dark:placeholder:text-stone-500"
              placeholder="Search request, site, requester, or asset"
            />
          </div>
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-slate-700 dark:text-stone-300">Status</span>
          <select
            value={filters.status}
            onChange={(event) => onChange({ ...filters, status: event.target.value as RequestFilterState["status"] })}
            className="flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100"
          >
            {statuses.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-slate-700 dark:text-stone-300">Priority</span>
          <select
            value={filters.priority}
            onChange={(event) => onChange({ ...filters, priority: event.target.value as RequestFilterState["priority"] })}
            className="flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100"
          >
            {priorities.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-slate-700 dark:text-stone-300">Site</span>
          <select
            value={filters.site}
            onChange={(event) => onChange({ ...filters, site: event.target.value })}
            className="flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100"
          >
            {sites.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

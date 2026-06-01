import { Wrench } from "lucide-react";

import type { MaintenanceTimelineEvent } from "@/features/maintenance/types/maintenance";

export function MaintenanceTimeline({ events }: { events: MaintenanceTimelineEvent[] }) {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-white shadow-sm sm:rounded-[24px] dark:border-white/10 dark:bg-[#171815]">
      <div className="border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5 dark:border-white/8">
        <h2 className="text-base font-semibold text-slate-900 dark:text-stone-100">Maintenance timeline</h2>
      </div>
      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#145d66]/10 dark:bg-[#145d66]/20">
            <Wrench className="h-5 w-5 text-[#145d66] dark:text-[#86d0d8]" />
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-stone-100">
            No timeline activity yet
          </p>
          <p className="mt-1 max-w-sm text-sm leading-6 text-slate-400 dark:text-stone-500">
            Workflow updates will appear here after assignment, diagnosis, hold, repair, or completion actions.
          </p>
        </div>
      ) : null}
      <div className="divide-y divide-slate-100 dark:divide-white/6">
        {events.map((event) => (
          <div key={event.id} className="flex gap-3 px-4 py-4 sm:gap-4 sm:px-6">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#145d66]/10 dark:bg-[#145d66]/20">
              <Wrench className="h-4 w-4 text-[#145d66] dark:text-[#86d0d8]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-slate-900 dark:text-stone-100">{event.title}</p>
                <span className="text-[11px] font-medium uppercase tracking-widest text-slate-400 dark:text-stone-500">{event.createdAt}</span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-stone-400">{event.description}</p>
              <p className="mt-1 text-xs text-slate-400 dark:text-stone-500">Actor: <span className="font-medium text-[#145d66] dark:text-[#86d0d8]">{event.actor}</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import type { TechnicianHistoryItem } from "@/features/technicians/types/technicians";

export function TechnicianHistoryTable({ items }: { items: TechnicianHistoryItem[] }) {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-white shadow-sm sm:rounded-[24px] dark:border-white/10 dark:bg-[#171815]">
      <div className="border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5 dark:border-white/8">
        <h2 className="text-base font-semibold text-slate-900 dark:text-stone-100">Recent work history</h2>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-white/6">
        {items.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="font-medium text-slate-900 dark:text-stone-100">No maintenance history yet</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-stone-400">
              Assigned and completed work orders will appear here once maintenance records exist.
            </p>
          </div>
        ) : null}
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#145d66]/10 text-xs font-bold text-[#145d66] dark:bg-[#145d66]/20 dark:text-[#86d0d8]">
              {item.workOrder.slice(-2)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-stone-100">{item.workOrder}</p>
                <span className="text-[11px] font-medium uppercase tracking-widest text-slate-400 dark:text-stone-500">{item.date}</span>
              </div>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-stone-400">
                {item.asset} - <span className="font-medium">{item.result}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

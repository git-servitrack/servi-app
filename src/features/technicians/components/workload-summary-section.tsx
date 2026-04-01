import type { TechnicianWorkload } from "@/features/technicians/types/technicians";

export function WorkloadSummarySection({ workload }: { workload: TechnicianWorkload }) {
  const items = [
    { label: "Active Assignments", value: workload.activeAssignments },
    { label: "Due Today", value: workload.dueToday },
    { label: "Upcoming Visits", value: workload.upcomingVisits },
    { label: "Current Shift", value: workload.currentShift },
  ];

  return (
    <div className="rounded-[20px] border border-slate-200 bg-white shadow-sm sm:rounded-[24px] dark:border-white/10 dark:bg-[#171815]">
      <div className="border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5 dark:border-white/8">
        <h2 className="text-base font-semibold text-slate-900 dark:text-stone-100">Current assignment load</h2>
        <p className="mt-0.5 text-sm text-slate-400 dark:text-stone-500">Workload</p>
      </div>
      <div className="grid gap-px bg-slate-100 sm:grid-cols-2 xl:grid-cols-4 dark:bg-white/6">
        {items.map((item) => (
          <div key={item.label} className="bg-white px-4 py-4 sm:px-6 sm:py-5 dark:bg-[#171815]">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-stone-500">{item.label}</p>
            <p className="mt-1.5 text-xl font-bold text-slate-900 dark:text-stone-100">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

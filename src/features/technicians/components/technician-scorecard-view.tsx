import type { TechnicianScorecard } from "@/features/technicians/types/technicians";

export function TechnicianScorecardView({ scorecard }: { scorecard: TechnicianScorecard }) {
  const items = [
    { label: "Jobs Completed", value: scorecard.jobsCompleted, hint: "Closed work orders this cycle" },
    { label: "Open Assignments", value: scorecard.openAssignments, hint: "Current active job ownership" },
    { label: "Avg. Response Time", value: scorecard.responseTime, hint: "Time to first technician action" },
    { label: "SLA Rate", value: scorecard.slaRate, hint: "Completion within target window" },
  ];

  return (
    <div className="rounded-[20px] border border-slate-200 bg-white shadow-sm sm:rounded-[24px] dark:border-white/10 dark:bg-[#171815]">
      <div className="border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5 dark:border-white/8">
        <h2 className="text-base font-semibold text-slate-900 dark:text-stone-100">Technician scorecard</h2>
        <p className="mt-0.5 text-sm text-slate-400 dark:text-stone-500">Performance snapshot</p>
      </div>
      <div className="grid gap-px bg-slate-100 sm:grid-cols-2 dark:bg-white/6">
        {items.map((item) => (
          <div key={item.label} className="bg-white px-4 py-4 sm:px-6 sm:py-5 dark:bg-[#171815]">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-stone-500">{item.label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-stone-100">{item.value}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-stone-400">{item.hint}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

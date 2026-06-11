import { ServiceActivityChart } from "@/features/dashboard/components/service-activity-chart";
import type { ServiceActivityPoint } from "@/features/dashboard/data/dashboard-kpi-data";

interface ServiceActivitySectionProps {
  data: ServiceActivityPoint[];
}

export function ServiceActivitySection({ data }: ServiceActivitySectionProps) {
  const total = data.reduce((sum, item) => sum + item.requests, 0);
  const peak = data.reduce<ServiceActivityPoint | null>(
    (best, item) => (!best || item.requests > best.requests ? item : best),
    null,
  );
  const average = data.length === 0 ? 0 : total / data.length;

  return (
    <div className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[24px] sm:p-6 dark:border-white/10 dark:bg-[#171815]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-stone-100">
            Service Activity
          </h2>
          <p className="mt-0.5 text-sm text-slate-400 dark:text-stone-500">
            Daily service requests this week
          </p>
        </div>
        <span className="rounded-full bg-[#145d66]/10 px-3 py-1 text-xs font-semibold text-[#145d66] dark:bg-[#145d66]/20">
          Live
        </span>
      </div>

      <div className="mt-5">
        <ServiceActivityChart data={data} />
      </div>

      <div className="mt-4 grid grid-cols-3 divide-x divide-slate-100 rounded-2xl border border-slate-100 bg-slate-50 dark:divide-white/6 dark:border-white/8 dark:bg-white/4">
        <div className="px-3 py-3 sm:px-5 sm:py-3.5">
          <p className="text-[11px] text-slate-400 sm:text-xs dark:text-stone-500">Total this week</p>
          <p className="mt-1 text-base font-bold text-slate-900 sm:text-lg dark:text-stone-100">
            {total}{" "}
            <span className="text-xs font-normal text-slate-400 sm:text-sm dark:text-stone-500">requests</span>
          </p>
        </div>
        <div className="px-3 py-3 sm:px-5 sm:py-3.5">
          <p className="text-[11px] text-slate-400 sm:text-xs dark:text-stone-500">Peak day</p>
          <p className="mt-1 text-base font-bold text-[#145d66] sm:text-lg">
            {peak?.requests ?? 0}{" "}
            <span className="text-xs font-normal text-slate-400 sm:text-sm dark:text-stone-500">on {peak?.day ?? "N/A"}</span>
          </p>
        </div>
        <div className="px-3 py-3 sm:px-5 sm:py-3.5">
          <p className="text-[11px] text-slate-400 sm:text-xs dark:text-stone-500">Daily avg</p>
          <p className="mt-1 text-base font-bold text-slate-900 sm:text-lg dark:text-stone-100">
            {average.toFixed(1)}{" "}
            <span className="text-xs font-normal text-slate-400 sm:text-sm dark:text-stone-500">requests</span>
          </p>
        </div>
      </div>
    </div>
  );
}

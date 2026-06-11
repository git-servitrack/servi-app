import { MaintenanceTrendChart } from "@/features/dashboard/components/maintenance-trend-chart";
import type { MaintenanceTrendPoint } from "@/features/dashboard/data/dashboard-kpi-data";

export function MaintenanceTrendSection({ data }: { data: MaintenanceTrendPoint[] }) {
  const requested = data.reduce((sum, item) => sum + item.requested, 0);
  const completed = data.reduce((sum, item) => sum + item.completed, 0);
  const completionRate = requested === 0 ? 0 : Math.round((completed / requested) * 100);

  return (
    <div className="rounded-[20px] border border-slate-200 bg-white px-4 py-4 shadow-sm sm:rounded-[24px] sm:px-6 sm:py-6 dark:border-white/10 dark:bg-[#171815]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-stone-100">
            Maintenance Trend
          </h2>
          <p className="mt-0.5 text-sm text-slate-400 dark:text-stone-500">
            Requested vs completed — last 14 days
          </p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
          {completionRate}% avg rate
        </span>
      </div>

      <div className="mt-5">
        <MaintenanceTrendChart data={data} />
      </div>
    </div>
  );
}

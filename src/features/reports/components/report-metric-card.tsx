import type { ReportMetric } from "@/features/reports/types/reports";

export function ReportMetricCard({ metric }: { metric: ReportMetric }) {
  const barColor = metric.color ?? "#145d66";

  return (
    <div className="rounded-[20px] border border-slate-200 bg-white px-4 py-4 shadow-sm sm:rounded-[24px] sm:px-5 sm:py-5 dark:border-white/10 dark:bg-[#171815]">
      <p className="text-sm font-medium text-slate-500 dark:text-stone-400">{metric.label}</p>
      <p className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:mt-4 sm:text-5xl dark:text-stone-100">
        {metric.value}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-stone-500 sm:text-sm">{metric.hint}</p>
      <div className="mt-3 h-1.5 w-12 rounded-full sm:mt-4" style={{ backgroundColor: barColor, opacity: 0.55 }} />
    </div>
  );
}

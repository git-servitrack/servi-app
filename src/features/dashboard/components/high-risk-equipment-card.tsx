import type { HighRiskEquipmentReportRow } from "@/features/reports/types/reports";

const riskColor: Record<string, string> = {
  Critical:
    "bg-rose-50 text-rose-700 ring-1 ring-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:ring-rose-800",
  High: "bg-orange-50 text-orange-700 ring-1 ring-orange-200 dark:bg-orange-950/30 dark:text-orange-300 dark:ring-orange-800",
  Medium:
    "bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:ring-amber-800",
  Low: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:ring-emerald-800",
};

const DEFAULT_LIMIT = 10;

export function HighRiskEquipmentCard({ items }: { items: HighRiskEquipmentReportRow[] }) {
  const visibleItems = items.slice(0, DEFAULT_LIMIT);

  return (
    <div className="rounded-[20px] border border-slate-200 bg-white shadow-sm sm:rounded-[24px] dark:border-white/10 dark:bg-[#171815]">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5 dark:border-white/8">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-stone-100">
            High-risk equipment
          </h2>
          <p className="mt-0.5 text-sm text-slate-400 dark:text-stone-500">
            Latest predictive results that may need inspection.
          </p>
        </div>
        {/* <Link
          href={ROUTES.predictiveMaintenance}
          className="rounded-full bg-[#145d66]/10 px-3 py-1 text-xs font-semibold text-[#145d66] transition-colors hover:bg-[#145d66]/15 dark:bg-[#145d66]/20 dark:text-[#86d0d8]"
        >
          Predict
        </Link> */}
      </div>

      {items.length === 0 ? (
        <p className="px-4 py-10 text-center text-sm text-slate-500 sm:px-6 dark:text-stone-400">
          No high-risk predictive results in the current report window.
        </p>
      ) : (
        <div className="max-h-[420px] divide-y divide-slate-100 overflow-y-auto dark:divide-white/6">
          {visibleItems.map((item) => (
            <div key={item.id} className="px-4 py-3 sm:px-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-stone-100">
                    {item.asset}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-stone-400">{item.site}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${riskColor[item.riskLevel] ?? riskColor.High}`}
                >
                  {item.riskLevel} {item.riskScore}%
                </span>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-stone-400">
                {item.recommendation}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

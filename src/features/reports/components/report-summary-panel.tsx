import { CheckCircle2, Lightbulb, X } from "lucide-react";

import type { ReportSummary } from "@/features/reports/types/reports";

function formatGeneratedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Generated recently";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function ReportSummaryPanel({
  summary,
  onClose,
}: {
  summary: ReportSummary;
  onClose?: () => void;
}) {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-white shadow-sm sm:rounded-[24px] dark:border-white/10 dark:bg-[#171815]">
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5 dark:border-white/8">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-[#145d66] dark:text-[#86d0d8]">
            Generated summary
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900 dark:text-stone-100">
            {summary.headline}
          </h2>
          <p className="mt-1 text-sm text-slate-400 dark:text-stone-500">
            {summary.periodLabel} - {formatGeneratedAt(summary.generatedAt)}
          </p>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-stone-500 dark:hover:bg-white/8 dark:hover:text-stone-200"
            aria-label="Close generated summary"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-stone-100">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            Highlights
          </div>
          <ul className="space-y-2">
            {summary.highlights.map((item) => (
              <li key={item} className="rounded-xl bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-600 dark:bg-white/5 dark:text-stone-300">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-stone-100">
            <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            Recommendations
          </div>
          <ul className="space-y-2">
            {summary.recommendations.map((item) => (
              <li key={item} className="rounded-xl bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-600 dark:bg-white/5 dark:text-stone-300">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

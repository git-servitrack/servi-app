"use client";

import { Images, ScanLine } from "lucide-react";

import type { DocumentationFile, VisionSeverity } from "@/features/documentation/types/documentation";

const STATUS_STYLES: Record<string, string> = {
  Verified: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:ring-emerald-800",
  "Pending Review": "bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-800",
};

const SEVERITY_STYLES: Record<VisionSeverity, string> = {
  Minor:
    "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-800",
  Moderate:
    "bg-amber-50 text-amber-900 ring-1 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-800",
  Critical: "bg-rose-50 text-rose-900 ring-1 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-800",
};

export function MediaPreviewCard({ file, onPreview }: { file: DocumentationFile; onPreview: () => void }) {
  const va = file.visionAnalysis;
  const findingCount = va.applicable ? (va.findings?.length ?? 0) : 0;

  return (
    <div className="group overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md sm:rounded-[24px] dark:border-white/10 dark:bg-[#171815] dark:hover:border-white/15">
      <div className="border-b border-slate-100 bg-linear-to-br from-[#145d66]/5 to-transparent p-5 dark:border-white/8 dark:from-[#145d66]/10">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#145d66]/10 transition-transform duration-200 group-hover:scale-105 dark:bg-[#145d66]/20">
            <Images className="h-5 w-5 text-[#145d66] dark:text-[#86d0d8]" />
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[file.status] ?? ""}`}>
              {file.status}
            </span>
            {va.applicable && va.severity ? (
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${SEVERITY_STYLES[va.severity]}`}>
                {va.severity}
              </span>
            ) : (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:bg-white/8 dark:text-stone-500">
                Pending CV
              </span>
            )}
          </div>
        </div>
        <div className="mt-5 rounded-xl border border-slate-200 bg-white/80 p-3.5 dark:border-white/10 dark:bg-white/5">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-stone-500">Image</p>
          <p className="mt-1.5 text-base font-semibold text-slate-900 dark:text-stone-100">{file.previewLabel}</p>
          {va.applicable && findingCount > 0 ? (
            <p className="mt-2 text-xs font-medium text-[#145d66] dark:text-[#86d0d8]">{findingCount} vision signals</p>
          ) : null}
        </div>
      </div>

      <div className="px-5 py-4">
        <p className="text-xs font-medium text-slate-400 dark:text-stone-500">Equipment photo</p>
        <p className="mt-1 text-base font-bold text-slate-900 dark:text-stone-100">{file.title}</p>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-stone-400">{file.summary}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {file.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-slate-200 px-2.5 py-0.5 text-[11px] font-medium text-slate-500 dark:border-white/10 dark:text-stone-400"
            >
              {tag}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={onPreview}
          className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-full border border-slate-200 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:text-stone-300 dark:hover:bg-white/6"
        >
          <ScanLine className="h-4 w-4 text-[#145d66] dark:text-[#86d0d8]" />
          Preview &amp; analysis
        </button>
      </div>
    </div>
  );
}

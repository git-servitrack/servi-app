import { MessageSquareText } from "lucide-react";

import type { RequestRemark } from "@/features/service-requests/types/service-requests";

export function RequestRemarksSection({ remarks }: { remarks: RequestRemark[] }) {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-white shadow-sm sm:rounded-[24px] dark:border-white/10 dark:bg-[#171815]">
      <div className="border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5 dark:border-white/8">
        <h2 className="text-base font-semibold text-slate-900 dark:text-stone-100">Remarks</h2>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-white/6">
        {remarks.map((remark) => (
          <div key={remark.id} className="flex gap-3 px-4 py-4 sm:gap-4 sm:px-6">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950/30">
              <MessageSquareText className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-slate-900 dark:text-stone-100">
                  {remark.author} <span className="font-normal text-slate-400 dark:text-stone-500">· {remark.role}</span>
                </p>
                <span className="text-[11px] font-medium uppercase tracking-widest text-slate-400 dark:text-stone-500">{remark.createdAt}</span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-stone-400">{remark.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

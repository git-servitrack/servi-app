import { CheckCircle2, Circle, LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import type { RepairAction } from "@/features/maintenance/types/maintenance";

const ACTION_META = {
  Pending: {
    icon: Circle,
    bg: "bg-slate-100 dark:bg-white/6",
    iconColor: "text-slate-400 dark:text-stone-500",
    label: "text-slate-500 dark:text-stone-400",
  },
  "In Progress": {
    icon: LoaderCircle,
    bg: "bg-violet-50 dark:bg-violet-950/30",
    iconColor: "text-violet-600 dark:text-violet-400",
    label: "text-violet-600 dark:text-violet-400",
  },
  Done: {
    icon: CheckCircle2,
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    label: "text-emerald-600 dark:text-emerald-400",
  },
} as const;

export function RepairActionList({ actions }: { actions: RepairAction[] }) {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-white shadow-sm sm:rounded-[24px] dark:border-white/10 dark:bg-[#171815]">
      <div className="border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5 dark:border-white/8">
        <h2 className="text-base font-semibold text-slate-900 dark:text-stone-100">Repair action list</h2>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-white/6">
        {actions.map((action) => {
          const meta = ACTION_META[action.status];
          const Icon = meta.icon;

          return (
            <div key={action.id} className="flex gap-3 px-4 py-4 sm:gap-4 sm:px-6">
              <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", meta.bg)}>
                <Icon className={cn("h-4 w-4", meta.iconColor)} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-semibold text-slate-900 dark:text-stone-100">{action.title}</p>
                  <span className={cn("text-xs font-medium", meta.label)}>{action.status}</span>
                </div>
                <p className="mt-0.5 text-xs text-slate-400 dark:text-stone-500">Owner: <span className="font-medium text-[#145d66] dark:text-[#86d0d8]">{action.owner}</span></p>
                <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-stone-400">{action.note}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

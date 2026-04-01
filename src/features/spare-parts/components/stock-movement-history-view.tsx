import { ArrowDownCircle, ArrowUpCircle, Settings2 } from "lucide-react";

import type { StockMovementItem } from "@/features/spare-parts/types/spare-parts";

const TYPE_ICONS: Record<string, { icon: typeof ArrowDownCircle; color: string }> = {
  Received: { icon: ArrowDownCircle, color: "text-emerald-500 dark:text-emerald-400" },
  Issued: { icon: ArrowUpCircle, color: "text-rose-500 dark:text-rose-400" },
  Adjusted: { icon: Settings2, color: "text-amber-500 dark:text-amber-400" },
};

export function StockMovementHistoryView({ items }: { items: StockMovementItem[] }) {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-white shadow-sm sm:rounded-[24px] dark:border-white/10 dark:bg-[#171815]">
      <div className="border-b border-slate-100 px-5 py-4 sm:px-6 sm:py-5 dark:border-white/8">
        <h2 className="text-base font-semibold text-slate-900 dark:text-stone-100">Stock movement history</h2>
        <p className="mt-0.5 text-sm text-slate-400 dark:text-stone-500">
          {items.length} movement records
        </p>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-white/6">
        {items.map((item) => {
          const typeConfig = TYPE_ICONS[item.type] ?? TYPE_ICONS.Adjusted;
          const Icon = typeConfig.icon;

          return (
            <div key={item.id} className="flex items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-50 dark:bg-white/5 ${typeConfig.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span className="text-sm font-semibold text-slate-900 dark:text-stone-100">{item.type}</span>
                  <span className={`text-sm font-bold ${item.quantity.startsWith("-") ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                    {item.quantity}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-stone-400">
                  {item.date} · Ref: <span className="font-medium text-[#145d66] dark:text-[#86d0d8]">{item.reference}</span>
                  {item.note ? ` — ${item.note}` : ""}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import Link from "next/link";

import { LowStockIndicator } from "@/features/spare-parts/components/low-stock-indicator";
import { StockBadge } from "@/features/spare-parts/components/stock-badge";
import { getSparePartDetailRoute } from "@/features/spare-parts/lib/spare-parts";
import type { SparePartRecord } from "@/features/spare-parts/types/spare-parts";

const STATUS_COLORS: Record<string, string> = {
  "In Stock": "#059669",
  "Low Stock": "#d97706",
  Critical: "#dc2626",
  "Out of Stock": "#64748b",
};

interface SparePartsTableProps {
  parts: SparePartRecord[];
  onEdit?: (partId: string) => void;
}

export function SparePartsTable({ parts, onEdit }: SparePartsTableProps) {
  if (parts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
        <p className="font-medium text-slate-900 dark:text-stone-100">No spare parts found</p>
        <p className="text-sm text-slate-400 dark:text-stone-500">
          Create a spare part record to start tracking inventory.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100 dark:divide-white/6">
      {parts.map((part) => (
        <div
          key={part.id}
          className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50/50 sm:gap-4 sm:px-6 sm:py-4 dark:hover:bg-white/3"
        >
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
            style={{ backgroundColor: STATUS_COLORS[part.status] ?? "#64748b" }}
          >
            {part.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-stone-100">
                {part.name}
              </p>
              <div className="flex items-center gap-2">
                <StockBadge status={part.status} />
                <LowStockIndicator stockOnHand={part.stockOnHand} reorderPoint={part.reorderPoint} />
              </div>
            </div>
            <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-stone-400">
              <span className="font-medium text-[#145d66] dark:text-[#86d0d8]">{part.partNumber}</span>
              {" · "}{part.category} · {part.site} · {part.stockOnHand} {part.unit} on hand / {part.reservedStock} reserved
            </p>
          </div>

          <div className="hidden shrink-0 gap-2 sm:flex">
            <Link
              href={getSparePartDetailRoute(part.id)}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:text-stone-300 dark:hover:bg-white/6"
            >
              View
            </Link>
            <button
              onClick={() => onEdit?.(part.id)}
              className="rounded-full bg-[#145d66] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#0e4d55]"
            >
              Edit
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

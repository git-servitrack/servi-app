import Link from "next/link";

import { AssetStatusBadge } from "@/features/assets/components/asset-status-badge";
import { getAssetDetailRoute } from "@/features/assets/lib/assets";
import type { AssetRecord } from "@/features/assets/types/assets";

interface AssetTableProps {
  assets: AssetRecord[];
  onEdit?: (assetId: string) => void;
}

export function AssetTable({ assets, onEdit }: AssetTableProps) {
  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
        <p className="font-medium text-slate-900 dark:text-stone-100">No assets found</p>
        <p className="text-sm text-slate-400 dark:text-stone-500">
          Adjust the current filters or create a new asset to populate this register.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100 dark:divide-white/6">
      {assets.map((asset) => (
        <div
          key={asset.id}
          className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50/50 sm:gap-4 sm:px-6 sm:py-4 dark:hover:bg-white/3"
        >
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
            style={{
              backgroundColor:
                asset.status === "Operational" ? "#145d66"
                : asset.status === "Maintenance Due" ? "#d97706"
                : asset.status === "Under Repair" ? "#7c3aed"
                : "#64748b",
            }}
          >
            {asset.code.slice(0, 2)}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-stone-100">
                {asset.name}
              </p>
              <AssetStatusBadge status={asset.status} />
            </div>
            <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-stone-400">
              <span className="font-medium text-[#145d66] dark:text-[#86d0d8]">{asset.id}</span>
              {" — "}
              {asset.category} · {asset.site} · Next service: {asset.nextServiceDate}
            </p>
          </div>

          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <Link
              href={getAssetDetailRoute(asset.id)}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:text-stone-300 dark:hover:bg-white/6"
            >
              View
            </Link>
            <button
              onClick={() => onEdit?.(asset.id)}
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

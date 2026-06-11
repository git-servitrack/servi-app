"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { TablePagination } from "@/components/shared/table-pagination";
import { AssetStatusBadge } from "@/features/assets/components/asset-status-badge";
import { getAssetDetailRoute } from "@/features/assets/lib/assets";
import type { AssetRecord } from "@/features/assets/types/assets";

const PAGE_SIZE = 10;

interface AssetTableProps {
  assets: AssetRecord[];
  onEdit?: (assetId: string) => void;
  onDelete?: (assetId: string) => void;
}

export function AssetTable({ assets, onEdit, onDelete }: AssetTableProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(assets.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedAssets = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;

    return assets.slice(start, start + PAGE_SIZE);
  }, [assets, currentPage]);

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
    <>
      <div className="divide-y divide-slate-100 dark:divide-white/6">
        {paginatedAssets.map((asset) => (
          <div
            key={asset.id}
            className="grid items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50/50 sm:grid-cols-[2.5rem_minmax(0,1fr)_9rem_auto] sm:gap-4 sm:px-6 sm:py-4 dark:hover:bg-white/3"
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
              style={{
                backgroundColor:
                  asset.status === "Active" || asset.status === "Operational" ? "#145d66"
                  : asset.status === "Maintenance Due" ? "#d97706"
                  : asset.status === "Under Repair" ? "#7c3aed"
                  : "#64748b",
              }}
            >
              {asset.code.slice(0, 2)}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-stone-100">
                {asset.name}
              </p>
              <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-stone-400">
                <span className="font-medium text-[#145d66] dark:text-[#86d0d8]">{asset.id}</span>
                {" - "}
                {asset.category} - {asset.assetType ?? "Type N/A"} - {asset.site} - Next service: {asset.nextServiceDate}
              </p>
            </div>

            <div className="justify-self-start sm:justify-self-center">
              <AssetStatusBadge status={asset.status} />
            </div>

            <div className="flex shrink-0 items-center gap-2 justify-self-start sm:justify-self-end">
              <Link
                href={getAssetDetailRoute(asset.id)}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:text-stone-300 dark:hover:bg-white/6"
              >
                View
              </Link>
              {onDelete ? (
                <button
                  onClick={() => onDelete(asset.id)}
                  className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-500/10"
                >
                  Delete
                </button>
              ) : null}
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

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={assets.length}
        pageSize={PAGE_SIZE}
        itemLabel="assets"
        onPageChange={setPage}
      />
    </>
  );
}

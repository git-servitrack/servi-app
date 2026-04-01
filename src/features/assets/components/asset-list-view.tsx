"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { AssetFilters } from "@/features/assets/components/asset-filters";
import { AssetFormModal } from "@/features/assets/components/asset-form-modal";
import { AssetTable } from "@/features/assets/components/asset-table";
import { assetFilterOptions, assetRecords, defaultAssetFilters, emptyAssetFormValues } from "@/features/assets/data/assets";
import { filterAssets, mapAssetToFormValues } from "@/features/assets/lib/assets";
import type { AssetFormValues } from "@/features/assets/types/assets";

const filteredAssets = filterAssets(assetRecords, defaultAssetFilters);

const STAT_ITEMS = [
  { label: "Operational", value: assetRecords.filter((a) => a.status === "Operational").length.toString(), color: "#145d66" },
  { label: "Maintenance Due", value: assetRecords.filter((a) => a.status === "Maintenance Due").length.toString(), color: "#d97706" },
  { label: "Under Repair", value: assetRecords.filter((a) => a.status === "Under Repair").length.toString(), color: "#7c3aed" },
  { label: "Total Tracked", value: assetRecords.length.toString(), color: "#1e293b" },
];

export function AssetListView() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [modalValues, setModalValues] = useState<AssetFormValues>(emptyAssetFormValues);
  const [modalAssetId, setModalAssetId] = useState<string | undefined>();

  function handleCreate() {
    setModalMode("create");
    setModalValues(emptyAssetFormValues);
    setModalAssetId(undefined);
    setModalOpen(true);
  }

  function handleEdit(assetId: string) {
    const asset = assetRecords.find((a) => a.id === assetId);
    if (!asset) return;
    setModalMode("edit");
    setModalValues(mapAssetToFormValues(asset));
    setModalAssetId(asset.id);
    setModalOpen(true);
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-stone-100">
              Assets
            </h1>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-stone-400">
              Manage operational assets, service schedules, and site ownership.
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="flex w-fit items-center gap-1.5 rounded-full bg-[#145d66] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0e4d55] dark:hover:bg-[#1a7a86]"
          >
            <Plus className="h-4 w-4" />
            Create asset
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {STAT_ITEMS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[20px] border border-slate-200 bg-white px-4 py-4 shadow-sm sm:rounded-[24px] sm:px-5 sm:py-5 dark:border-white/10 dark:bg-[#171815]"
            >
              <p className="text-sm font-medium text-slate-500 dark:text-stone-400">{stat.label}</p>
              <p className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:mt-4 sm:text-5xl dark:text-stone-100">
                {stat.value}
              </p>
              <div className="mt-3 h-1.5 w-12 rounded-full sm:mt-4" style={{ backgroundColor: stat.color, opacity: 0.5 }} />
            </div>
          ))}
        </div>

        <div className="mt-4 sm:mt-6">
          <AssetFilters
            filters={defaultAssetFilters}
            categoryOptions={assetFilterOptions.categories}
            siteOptions={assetFilterOptions.sites}
            statusOptions={assetFilterOptions.statuses}
          />
        </div>

        <div className="mt-4 sm:mt-6">
          <div className="rounded-[20px] border border-slate-200 bg-white shadow-sm sm:rounded-[24px] dark:border-white/10 dark:bg-[#171815]">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5 dark:border-white/8">
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-stone-100">
                  Asset register
                </h2>
                <p className="mt-0.5 text-sm text-slate-400 dark:text-stone-500">
                  {filteredAssets.length} assets matching current filters
                </p>
              </div>
            </div>
            <AssetTable assets={filteredAssets} onEdit={handleEdit} />
          </div>
        </div>
      </div>

      <AssetFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        values={modalValues}
        assetId={modalAssetId}
      />
    </div>
  );
}

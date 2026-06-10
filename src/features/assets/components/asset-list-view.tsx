"use client";

import { LoaderCircle, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { sileo } from "sileo";

import { ApiErrorAlert } from "@/components/feedback/api-error-alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AssetFilters } from "@/features/assets/components/asset-filters";
import { AssetFormModal } from "@/features/assets/components/asset-form-modal";
import { AssetTable } from "@/features/assets/components/asset-table";
import { defaultAssetFilters, emptyAssetFormValues } from "@/features/assets/data/assets";
import { filterAssets, mapAssetToFormValues } from "@/features/assets/lib/assets";
import type {
  AssetCategoryOption,
  AssetFilterState,
  AssetFormValues,
  AssetRecord,
} from "@/features/assets/types/assets";
import { assetsService } from "@/services";
import type { ApiErrorShape } from "@/services/http/types";

const STATUS_OPTIONS = ["All", "Active", "Operational", "Maintenance Due", "Under Repair", "Decommissioned"] as const;

function buildEmptyAssetValues(categories: AssetCategoryOption[]): AssetFormValues {
  return {
    ...emptyAssetFormValues,
    category: categories.find((category) => category.isActive)?.id ?? categories[0]?.id ?? "",
  };
}

export function AssetListView() {
  const [assets, setAssets] = useState<AssetRecord[]>([]);
  const [categories, setCategories] = useState<AssetCategoryOption[]>([]);
  const [filters, setFilters] = useState<AssetFilterState>(defaultAssetFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiErrorShape | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [modalValues, setModalValues] = useState<AssetFormValues>(emptyAssetFormValues);
  const [modalAssetId, setModalAssetId] = useState<string | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<AssetRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredAssets = useMemo(() => filterAssets(assets, filters), [assets, filters]);
  const categoryOptions = useMemo(
    () => ["All", ...categories.map((category) => category.name)],
    [categories],
  );
  const siteOptions = useMemo(
    () => ["All", ...Array.from(new Set(assets.map((asset) => asset.site))).sort()],
    [assets],
  );
  const statItems = useMemo(
    () => [
      { label: "Active", value: assets.filter((a) => ["Active", "Operational"].includes(a.status)).length.toString(), color: "#145d66" },
      { label: "Maintenance Due", value: assets.filter((a) => a.status === "Maintenance Due").length.toString(), color: "#d97706" },
      { label: "Under Repair", value: assets.filter((a) => a.status === "Under Repair").length.toString(), color: "#7c3aed" },
      { label: "Total Tracked", value: assets.length.toString(), color: "#1e293b" },
    ],
    [assets],
  );

  async function loadAssets() {
    const [assetResult, categoryResult] = await Promise.all([
      assetsService.list(),
      assetsService.categories(),
    ]);

    if (assetResult.error) {
      setError(assetResult.error);
      setAssets([]);
    } else {
      setAssets(assetResult.data);
    }

    if (categoryResult.error) {
      setError(categoryResult.error);
      setCategories([]);
    } else {
      setCategories(categoryResult.data);
    }

    if (!assetResult.error && !categoryResult.error) {
      setError(null);
    }
  }

  useEffect(() => {
    let active = true;

    async function loadInitialData() {
      await loadAssets();

      if (active) {
        setIsLoading(false);
      }
    }

    void loadInitialData();

    return () => {
      active = false;
    };
  }, []);

  function handleCreate() {
    setModalMode("create");
    setModalValues(buildEmptyAssetValues(categories));
    setModalAssetId(undefined);
    setModalOpen(true);
  }

  function handleEdit(assetId: string) {
    const asset = assets.find((a) => a.id === assetId);
    if (!asset) return;

    setModalMode("edit");
    setModalValues(mapAssetToFormValues(asset));
    setModalAssetId(asset.id);
    setModalOpen(true);
  }

  function handleDelete(assetId: string) {
    const asset = assets.find((item) => item.id === assetId);
    if (!asset) return;

    setDeleteTarget(asset);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    setIsDeleting(true);

    const deletedAsset = await sileo
      .promise(
        async () => {
          const result = await assetsService.delete(deleteTarget.id);

          if (result.error) {
            throw result.error;
          }

          return result.data;
        },
        {
          loading: {
            title: "Deleting asset...",
            description: `Removing ${deleteTarget.name} from the register.`,
          },
          success: {
            title: "Asset deleted",
            description: `${deleteTarget.name} was removed successfully.`,
          },
          error: (errorValue) => ({
            title: "Delete failed",
            description:
              typeof errorValue === "object" && errorValue !== null && "message" in errorValue
                ? String((errorValue as { message?: unknown }).message)
                : "The asset could not be deleted.",
          }),
        },
      )
      .catch((errorValue: ApiErrorShape) => {
        setError(errorValue);
        return null;
      });

    setIsDeleting(false);

    if (!deletedAsset) return;

    setAssets((current) => current.filter((asset) => asset.id !== deleteTarget.id));
    setError(null);
    setDeleteTarget(null);
  }

  async function handleModalSaved() {
    await loadAssets();
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
            disabled={categories.length === 0}
            className="flex w-fit items-center gap-1.5 rounded-full bg-[#145d66] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0e4d55] disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-[#1a7a86]"
          >
            <Plus className="h-4 w-4" />
            Create asset
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {statItems.map((stat) => (
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
            filters={filters}
            categoryOptions={categoryOptions}
            siteOptions={siteOptions}
            statusOptions={STATUS_OPTIONS}
            onChange={setFilters}
          />
        </div>

        <div className="mt-4 space-y-3 sm:mt-6">
          {error ? <ApiErrorAlert message={error.message} /> : null}
          {!isLoading && categories.length === 0 ? (
            <ApiErrorAlert message="Create an active category in the API before adding assets." />
          ) : null}
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
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 px-6 py-16 text-sm text-slate-500 dark:text-stone-400">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Loading assets...
              </div>
            ) : (
              <AssetTable assets={filteredAssets} onEdit={handleEdit} onDelete={handleDelete} />
            )}
          </div>
        </div>
      </div>

      <AssetFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        values={modalValues}
        assetId={modalAssetId}
        categoryOptions={categories}
        onSaved={handleModalSaved}
      />

      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setDeleteTarget(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete asset?</DialogTitle>
            <DialogDescription>
              {deleteTarget
                ? `This will remove ${deleteTarget.name} from the asset register. This action cannot be undone.`
                : "This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting}
              className="flex h-11 items-center justify-center rounded-full border border-slate-200 px-5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-50 dark:border-white/10 dark:text-stone-300 dark:hover:bg-white/6"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="flex h-11 items-center justify-center gap-2 rounded-full bg-rose-500 px-5 text-sm font-semibold text-white transition-colors hover:bg-rose-600 disabled:pointer-events-none disabled:opacity-50"
            >
              {isDeleting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
              {isDeleting ? "Deleting..." : "Delete asset"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, LoaderCircle } from "lucide-react";

import { ApiErrorAlert } from "@/components/feedback/api-error-alert";
import { AssetDetailsPanel } from "@/features/assets/components/asset-details-panel";
import { AssetFormModal } from "@/features/assets/components/asset-form-modal";
import { AssetStatusBadge } from "@/features/assets/components/asset-status-badge";
import { mapAssetToFormValues } from "@/features/assets/lib/assets";
import type { AssetCategoryOption, AssetRecord } from "@/features/assets/types/assets";
import { PredictiveRiskContextCard } from "@/features/predictive-maintenance/components/predictive-risk-context-card";
import { assetsService } from "@/services";
import type { ApiErrorShape } from "@/services/http/types";

export function AssetDetailView({ assetId }: { assetId: string }) {
  const [asset, setAsset] = useState<AssetRecord | null>(null);
  const [categories, setCategories] = useState<AssetCategoryOption[]>([]);
  const [error, setError] = useState<ApiErrorShape | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);

  const loadAsset = useCallback(async () => {
    const [assetResult, categoryResult] = await Promise.all([
      assetsService.getById(assetId),
      assetsService.categories(),
    ]);

    if (assetResult.error) {
      setError(assetResult.error);
      setAsset(null);
    } else {
      setAsset(assetResult.data);
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
  }, [assetId]);

  useEffect(() => {
    let active = true;

    async function loadInitialData() {
      await loadAsset();

      if (active) {
        setIsLoading(false);
      }
    }

    void loadInitialData();

    return () => {
      active = false;
    };
  }, [assetId, loadAsset]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-2 text-sm text-slate-500 dark:text-stone-400">
        <LoaderCircle className="h-4 w-4 animate-spin" />
        Loading asset...
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {error ? <ApiErrorAlert message={error.message} /> : <ApiErrorAlert message="Asset record could not be found." />}
        <Link
          href="/assets"
          className="mt-5 inline-flex text-sm font-medium text-[#145d66] hover:text-[#0e4d55]"
        >
          Back to assets
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <Link
          href="/assets"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-900 dark:text-stone-400 dark:hover:text-stone-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to assets
        </Link>

        {error ? <ApiErrorAlert message={error.message} /> : null}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#145d66] text-lg font-bold text-white shadow-sm">
              {asset.code.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-stone-100">
                  {asset.name}
                </h1>
                <AssetStatusBadge status={asset.status} />
              </div>
              <p className="mt-1 text-sm text-slate-500 dark:text-stone-400">
                {asset.id} - {asset.code} - {asset.category}
              </p>
            </div>
          </div>
          <button
            onClick={() => setEditOpen(true)}
            className="flex w-fit items-center gap-1.5 rounded-full bg-[#145d66] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0e4d55] dark:hover:bg-[#1a7a86]"
          >
            Edit asset
          </button>
        </div>

        <div className="mt-6">
          <AssetDetailsPanel asset={asset} />
        </div>

        <div className="mt-4 grid gap-4 pb-6 sm:mt-6 sm:gap-6 sm:pb-8 xl:grid-cols-3">
          <div className="rounded-[20px] border border-slate-200 bg-white px-4 py-4 shadow-sm sm:rounded-[24px] sm:px-6 sm:py-6 dark:border-white/10 dark:bg-[#171815]">
            <h2 className="text-base font-semibold text-slate-900 dark:text-stone-100">
              Maintenance context
            </h2>
            <p className="mt-0.5 text-sm text-slate-400 dark:text-stone-500">Service planning</p>
            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600 dark:text-stone-400">
              <p>Last serviced on <span className="font-medium text-slate-900 dark:text-stone-100">{asset.lastServiceDate}</span>. Next planned service is <span className="font-medium text-slate-900 dark:text-stone-100">{asset.nextServiceDate}</span>.</p>
              <p>The assigned team is <span className="font-medium text-[#145d66] dark:text-[#86d0d8]">{asset.assignedTeam}</span>, with current asset criticality marked as <span className="font-medium text-slate-900 dark:text-stone-100">{asset.criticality.toLowerCase()}</span>.</p>
            </div>
          </div>

          <PredictiveRiskContextCard
            title="Asset risk"
            description="Latest predictive result linked to this asset."
            assetId={asset.id}
          />

          <div className="rounded-[20px] border border-slate-200 bg-white px-4 py-4 shadow-sm sm:rounded-[24px] sm:px-6 sm:py-6 dark:border-white/10 dark:bg-[#171815]">
            <h2 className="text-base font-semibold text-slate-900 dark:text-stone-100">
              API record
            </h2>
            <p className="mt-0.5 text-sm text-slate-400 dark:text-stone-500">Live asset data</p>
            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600 dark:text-stone-400">
              <p>This page is loaded from the asset API and uses the populated category returned by the backend.</p>
              <p>Linked maintenance history, documentation, and service requests can be layered in later phases.</p>
            </div>
          </div>
        </div>
      </div>

      <AssetFormModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        mode="edit"
        values={mapAssetToFormValues(asset)}
        assetId={asset.id}
        categoryOptions={categories}
        onSaved={loadAsset}
      />
    </div>
  );
}

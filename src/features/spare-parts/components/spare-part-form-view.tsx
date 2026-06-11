"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, LoaderCircle } from "lucide-react";

import { ApiErrorAlert } from "@/components/feedback/api-error-alert";
import { ROUTES } from "@/constants/routes";
import { StockAdjustmentForm } from "@/features/spare-parts/components/stock-adjustment-form";
import { emptySparePartFormValues } from "@/features/spare-parts/data/spare-parts";
import { mapSparePartToFormValues } from "@/features/spare-parts/lib/spare-parts";
import type { SparePartFormOptions, SparePartFormValues } from "@/features/spare-parts/types/spare-parts";
import { sparePartsService } from "@/services";
import type { ApiErrorShape } from "@/services/http/types";

interface SparePartFormViewProps {
  mode: "create" | "edit";
  partId?: string;
}

const emptyOptions: SparePartFormOptions = {
  categories: [],
  assets: [],
  maintenanceJobs: [],
};

function buildCreateValues(options: SparePartFormOptions): SparePartFormValues {
  return {
    ...emptySparePartFormValues,
    category: options.categories.find((category) => category.isActive)?.id ?? options.categories[0]?.id ?? "",
  };
}

export function SparePartFormView({ mode, partId }: SparePartFormViewProps) {
  const router = useRouter();
  const isEdit = mode === "edit";
  const [values, setValues] = useState<SparePartFormValues>(emptySparePartFormValues);
  const [options, setOptions] = useState<SparePartFormOptions>(emptyOptions);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiErrorShape | null>(null);

  useEffect(() => {
    let active = true;

    async function loadFormData() {
      const [optionsResult, partResult] = await Promise.all([
        sparePartsService.formOptions(),
        isEdit && partId ? sparePartsService.getById(partId) : Promise.resolve(null),
      ]);

      if (!active) return;

      if (optionsResult.error) {
        setError(optionsResult.error);
        setOptions(emptyOptions);
        setValues(emptySparePartFormValues);
        setIsLoading(false);
        return;
      }

      setOptions(optionsResult.data);

      if (partResult && partResult.error) {
        setError(partResult.error);
        setValues(emptySparePartFormValues);
      } else if (partResult) {
        setError(null);
        setValues(mapSparePartToFormValues(partResult.data));
      } else {
        setError(null);
        setValues(buildCreateValues(optionsResult.data));
      }

      setIsLoading(false);
    }

    void loadFormData();

    return () => {
      active = false;
    };
  }, [isEdit, partId]);

  function handleSuccess() {
    router.push(ROUTES.spareParts);
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        <Link
          href={ROUTES.spareParts}
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-900 dark:text-stone-400 dark:hover:text-stone-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to spare parts
        </Link>

        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#145d66]">
            {isEdit ? "Edit spare part" : "Create spare part"}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-stone-100">
            {isEdit ? "Update spare part record" : "Create spare part record"}
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-stone-400">
            {isEdit
              ? "Keep part metadata, storage details, and stock thresholds aligned."
              : "Set up a new inventory record for tracking and procurement."}
          </p>
        </div>

        <div className="rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm sm:rounded-[24px] sm:p-8 dark:border-white/10 dark:bg-[#171815]">
          {error ? <ApiErrorAlert message={error.message} /> : null}
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 px-6 py-16 text-sm text-slate-500 dark:text-stone-400">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Loading spare part form...
            </div>
          ) : (
            <StockAdjustmentForm
              submitLabel={isEdit ? "Save changes" : "Create spare part"}
              values={values}
              partId={partId}
              categoryOptions={options.categories}
              assetOptions={options.assets}
              onSuccess={handleSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
}

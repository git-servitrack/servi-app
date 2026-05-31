"use client";

import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";

import { ApiErrorAlert } from "@/components/feedback/api-error-alert";
import { ROUTES } from "@/constants/routes";
import { AssetFormView } from "@/features/assets/components/asset-form-view";
import { emptyAssetFormValues } from "@/features/assets/data/assets";
import { mapAssetToFormValues } from "@/features/assets/lib/assets";
import type { AssetCategoryOption, AssetFormValues } from "@/features/assets/types/assets";
import { assetsService } from "@/services";
import type { ApiErrorShape } from "@/services/http/types";

interface AssetFormPageViewProps {
  mode: "create" | "edit";
  assetId?: string;
}

function buildEmptyAssetValues(categories: AssetCategoryOption[]): AssetFormValues {
  return {
    ...emptyAssetFormValues,
    category: categories.find((category) => category.isActive)?.id ?? categories[0]?.id ?? "",
  };
}

export function AssetFormPageView({ mode, assetId }: AssetFormPageViewProps) {
  const [values, setValues] = useState<AssetFormValues | null>(null);
  const [categories, setCategories] = useState<AssetCategoryOption[]>([]);
  const [error, setError] = useState<ApiErrorShape | null>(null);

  useEffect(() => {
    let active = true;

    async function loadFormData() {
      const categoryResult = await assetsService.categories();

      if (!active) return;

      if (categoryResult.error) {
        setError(categoryResult.error);
        setValues(null);
        setCategories([]);
        return;
      }

      setCategories(categoryResult.data);

      if (mode === "create") {
        setError(null);
        setValues(buildEmptyAssetValues(categoryResult.data));
        return;
      }

      if (!assetId) {
        setError({
          code: "NOT_FOUND",
          message: "Asset record could not be found.",
          status: 404,
        });
        setValues(null);
        return;
      }

      const assetResult = await assetsService.getById(assetId);

      if (!active) return;

      if (assetResult.error) {
        setError(assetResult.error);
        setValues(null);
        return;
      }

      setError(null);
      setValues(mapAssetToFormValues(assetResult.data));
    }

    void loadFormData();

    return () => {
      active = false;
    };
  }, [assetId, mode]);

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <ApiErrorAlert message={error.message} />
        <Link
          href={ROUTES.assets}
          className="mt-5 inline-flex text-sm font-medium text-[#145d66] hover:text-[#0e4d55]"
        >
          Back to assets
        </Link>
      </div>
    );
  }

  if (!values) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-2 text-sm text-slate-500 dark:text-stone-400">
        <LoaderCircle className="h-4 w-4 animate-spin" />
        Loading asset form...
      </div>
    );
  }

  return (
    <AssetFormView
      mode={mode}
      values={values}
      assetId={assetId}
      categoryOptions={categories}
    />
  );
}

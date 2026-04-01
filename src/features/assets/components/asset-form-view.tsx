import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ROUTES } from "@/constants/routes";
import { AssetForm } from "@/features/assets/components/asset-form";
import type { AssetFormValues } from "@/features/assets/types/assets";

interface AssetFormViewProps {
  mode: "create" | "edit";
  values: AssetFormValues;
  assetId?: string;
}

export function AssetFormView({ mode, values, assetId }: AssetFormViewProps) {
  const isEdit = mode === "edit";

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        <Link
          href={ROUTES.assets}
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-900 dark:text-stone-400 dark:hover:text-stone-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to assets
        </Link>

        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#145d66]">
            {isEdit ? "Edit asset" : "Create asset"}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-stone-100">
            {isEdit ? "Update asset record" : "Create new asset"}
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-stone-400">
            {isEdit
              ? "Adjust ownership, service cadence, and asset metadata."
              : "Prepare a clean asset record structure ready for validation rules and API submission."}
          </p>
        </div>

        <div className="rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm sm:rounded-[24px] sm:p-8 dark:border-white/10 dark:bg-[#171815]">
          <AssetForm
            submitLabel={isEdit ? "Save changes" : "Create asset"}
            values={values}
            assetId={assetId}
          />
        </div>
      </div>
    </div>
  );
}

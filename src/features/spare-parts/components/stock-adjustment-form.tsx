"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Check, ChevronDown, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { sileo } from "sileo";

import { ApiErrorAlert } from "@/components/feedback/api-error-alert";
import { sparePartFormSchema, type SparePartFormSchemaValues } from "@/features/spare-parts/schemas/spare-part-schema";
import type { SparePartAssetOption, SparePartCategoryOption, SparePartFormValues } from "@/features/spare-parts/types/spare-parts";
import { useStandardFormSubmit } from "@/hooks/use-standard-form-submit";
import { cn } from "@/lib/utils";
import { sparePartsService } from "@/services";
import type { ApiErrorShape } from "@/services/http/types";

interface StockAdjustmentFormProps {
  submitLabel: string;
  values: SparePartFormValues;
  partId?: string;
  categoryOptions: SparePartCategoryOption[];
  assetOptions: SparePartAssetOption[];
  onSuccess?: () => void;
  onCancel?: () => void;
}

const inputClass = "flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100 dark:placeholder:text-stone-500";
const selectClass = "flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100";
const textareaClass = "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100 dark:placeholder:text-stone-500";

export function StockAdjustmentForm({
  submitLabel,
  values,
  partId,
  categoryOptions,
  assetOptions,
  onSuccess,
  onCancel,
}: StockAdjustmentFormProps) {
  const isEditMode = Boolean(partId);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    setValue,
    control,
  } = useForm<SparePartFormSchemaValues>({
    resolver: zodResolver(sparePartFormSchema),
    defaultValues: {
      ...values,
      category: values.category || categoryOptions.find((category) => category.isActive)?.id || categoryOptions[0]?.id || "",
    },
  });
  const { isSubmitting, error, run, clearFeedback } = useStandardFormSubmit();
  const selectedAssetIds = useWatch({ control, name: "compatibleAssets" }) ?? [];

  useEffect(() => {
    reset({
      ...values,
      category: values.category || categoryOptions.find((category) => category.isActive)?.id || categoryOptions[0]?.id || "",
    });
  }, [categoryOptions, reset, values]);

  async function onSubmit(formValues: SparePartFormSchemaValues) {
    const result = await sileo
      .promise(
        async () => {
          const submission = await run(
            () => sparePartsService.save(formValues, partId),
            (response) => response.message,
          );

          if (submission.error) {
            throw submission.error;
          }

          if (!submission.data) {
            throw new Error("Spare part response did not include record data.");
          }

          return submission.data;
        },
        {
          loading: {
            title: isEditMode ? "Updating spare part..." : "Creating spare part...",
            description: isEditMode
              ? `Saving inventory changes for ${formValues.name}.`
              : `Adding ${formValues.name} to the inventory.`,
          },
          success: (response) => ({
            title: isEditMode ? "Spare part updated" : "Spare part created",
            description: response.message,
          }),
          error: (errorValue) => ({
            title: isEditMode ? "Update failed" : "Create failed",
            description:
              typeof errorValue === "object" && errorValue !== null && "message" in errorValue
                ? String((errorValue as { message?: unknown }).message)
                : "The spare part could not be saved.",
          }),
        },
      )
      .catch((errorValue: ApiErrorShape) => {
        if (errorValue.fieldErrors) {
          Object.entries(errorValue.fieldErrors).forEach(([field, message]) => {
            setError(field as keyof SparePartFormSchemaValues, {
              type: "server",
              message,
            });
          });
        }

        return null;
      });

    if (!result) return;

    onSuccess?.();
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      {error ? <ApiErrorAlert message={error.message} /> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <FieldShell label="Part name" error={errors.name?.message}>
          <input {...register("name", { onChange: clearFeedback })} placeholder="Compressor Relay" className={inputClass} />
        </FieldShell>
        <FieldShell label="Part number" error={errors.partNumber?.message}>
          <input {...register("partNumber", { onChange: clearFeedback })} placeholder="SP-AC-2201" className={inputClass} />
        </FieldShell>
        <FieldShell label="Category" error={errors.category?.message}>
          <select {...register("category", { onChange: clearFeedback })} className={cn(selectClass, errors.category && "border-destructive")}>
            <option value="">Select category</option>
            {categoryOptions.map((category) => (
              <option key={category.id} value={category.id} disabled={!category.isActive}>
                {category.name}{category.isActive ? "" : " (Inactive)"}
              </option>
            ))}
          </select>
        </FieldShell>
        <FieldShell label="Site" error={errors.site?.message}>
          <input {...register("site", { onChange: clearFeedback })} placeholder="Central Office" className={inputClass} />
        </FieldShell>
        <FieldShell label="Compatible assets" error={errors.compatibleAssets?.message}>
          <CompatibleAssetsDropdown
            assets={assetOptions}
            selectedIds={selectedAssetIds}
            hasError={Boolean(errors.compatibleAssets)}
            onChange={(nextIds) => {
              setValue("compatibleAssets", nextIds, { shouldDirty: true, shouldValidate: true });
              clearFeedback();
            }}
          />
        </FieldShell>
        <FieldShell label="Unit" error={errors.unit?.message}>
          <input {...register("unit", { onChange: clearFeedback })} placeholder="pcs" className={inputClass} />
        </FieldShell>
        <FieldShell label="Stock on hand" error={errors.stockOnHand?.message}>
          <input {...register("stockOnHand", { onChange: clearFeedback })} placeholder="18" className={inputClass} />
        </FieldShell>
        <FieldShell label="Reserved stock" error={errors.reservedStock?.message}>
          <input {...register("reservedStock", { onChange: clearFeedback })} placeholder="4" className={inputClass} />
        </FieldShell>
        <FieldShell label="Reorder point" error={errors.reorderPoint?.message}>
          <input {...register("reorderPoint", { onChange: clearFeedback })} placeholder="10" className={inputClass} />
        </FieldShell>
        <FieldShell label="Bin location" error={errors.binLocation?.message}>
          <input {...register("binLocation", { onChange: clearFeedback })} placeholder="Aisle A - Bin 12" className={inputClass} />
        </FieldShell>
        <FieldShell label="Supplier" error={errors.supplier?.message}>
          <input {...register("supplier", { onChange: clearFeedback })} placeholder="Metro Controls Supply" className={inputClass} />
        </FieldShell>
      </div>

      <FieldShell label="Inventory notes" error={errors.notes?.message}>
        <textarea
          {...register("notes", { onChange: clearFeedback })}
          placeholder="Capture storage conditions, procurement notes, or operational handling constraints."
          rows={3}
          className={textareaClass}
        />
      </FieldShell>

      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="flex h-12 flex-1 items-center justify-center rounded-full border border-slate-200 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:text-stone-300 dark:hover:bg-white/6 sm:flex-none sm:px-8"
          >
            Cancel
          </button>
        ) : null}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#145d66] text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0e4d55] disabled:pointer-events-none disabled:opacity-50 sm:flex-none sm:px-8"
        >
          {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
          {isSubmitting ? "Saving..." : submitLabel}
          {!isSubmitting ? <ArrowRight className="h-4 w-4" /> : null}
        </button>
      </div>
    </form>
  );
}

function FieldShell({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="space-y-1.5">
      <span className="text-sm font-medium text-slate-700 dark:text-stone-300">{label}</span>
      {children}
      {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
    </label>
  );
}

function CompatibleAssetsDropdown({
  assets,
  selectedIds,
  hasError,
  onChange,
}: {
  assets: SparePartAssetOption[];
  selectedIds: string[];
  hasError: boolean;
  onChange: (nextIds: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const selectedAssets = assets.filter((asset) => selectedIds.includes(asset.id));
  const displayValue =
    selectedAssets.length > 0
      ? selectedAssets.map((asset) => `${asset.name} (${asset.code})`).join(", ")
      : "Select compatible assets";

  function toggleAsset(assetId: string) {
    onChange(
      selectedIds.includes(assetId)
        ? selectedIds.filter((id) => id !== assetId)
        : [...selectedIds, assetId],
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "flex h-11 w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 text-left text-sm text-slate-900 transition-colors focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100",
          selectedAssets.length === 0 && "text-slate-400 dark:text-stone-500",
          hasError && "border-destructive",
        )}
      >
        <span className="truncate">{displayValue}</span>
        <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
      </button>

      {open ? (
        <div className="absolute z-30 mt-2 max-h-56 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-white/10 dark:bg-[#1a1d1b]">
          {assets.length === 0 ? (
            <p className="px-3 py-2 text-sm text-slate-500 dark:text-stone-400">No assets available.</p>
          ) : null}
          {assets.map((asset) => {
            const selected = selectedIds.includes(asset.id);

            return (
              <button
                key={asset.id}
                type="button"
                onClick={() => toggleAsset(asset.id)}
                className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-stone-300 dark:hover:bg-white/6"
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium text-slate-900 dark:text-stone-100">
                    {asset.name} ({asset.code})
                  </span>
                  <span className="block truncate text-xs text-slate-400 dark:text-stone-500">{asset.site}</span>
                </span>
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-slate-200 dark:border-white/10",
                    selected && "border-[#145d66] bg-[#145d66] text-white",
                  )}
                >
                  {selected ? <Check className="h-3 w-3" /> : null}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

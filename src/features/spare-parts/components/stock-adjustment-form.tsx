"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { ApiErrorAlert } from "@/components/feedback/api-error-alert";
import { MutationFeedback } from "@/components/feedback/mutation-feedback";
import { sparePartFormSchema, type SparePartFormSchemaValues } from "@/features/spare-parts/schemas/spare-part-schema";
import type { SparePartFormValues, StockStatus } from "@/features/spare-parts/types/spare-parts";
import { useStandardFormSubmit } from "@/hooks/use-standard-form-submit";
import { cn } from "@/lib/utils";
import { sparePartsService } from "@/services";

interface StockAdjustmentFormProps {
  submitLabel: string;
  values: SparePartFormValues;
  partId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const statusOptions: StockStatus[] = ["In Stock", "Low Stock", "Critical", "Out of Stock"];

const inputClass = "flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100 dark:placeholder:text-stone-500";
const selectClass = "flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100";
const textareaClass = "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100 dark:placeholder:text-stone-500";

export function StockAdjustmentForm({ submitLabel, values, partId, onSuccess, onCancel }: StockAdjustmentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<SparePartFormSchemaValues>({
    resolver: zodResolver(sparePartFormSchema),
    defaultValues: values,
  });
  const { isSubmitting, error, successMessage, run, clearFeedback } = useStandardFormSubmit();

  useEffect(() => {
    reset(values);
  }, [reset, values]);

  async function onSubmit(formValues: SparePartFormSchemaValues) {
    const result = await run(
      () => sparePartsService.save(formValues, partId),
      (response) => response.message,
    );

    if (result.error?.fieldErrors) {
      Object.entries(result.error.fieldErrors).forEach(([field, message]) => {
        setError(field as keyof SparePartFormSchemaValues, {
          type: "server",
          message,
        });
      });
    }

    if (!result.error) {
      onSuccess?.();
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      {error ? <ApiErrorAlert message={error.message} /> : null}
      {successMessage ? <MutationFeedback message={successMessage} /> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <FieldShell label="Part name" error={errors.name?.message}>
          <input {...register("name", { onChange: clearFeedback })} placeholder="Compressor Relay" className={inputClass} />
        </FieldShell>
        <FieldShell label="Part number" error={errors.partNumber?.message}>
          <input {...register("partNumber", { onChange: clearFeedback })} placeholder="SP-AC-2201" className={inputClass} />
        </FieldShell>
        <FieldShell label="Category" error={errors.category?.message}>
          <input {...register("category", { onChange: clearFeedback })} placeholder="HVAC Electrical" className={inputClass} />
        </FieldShell>
        <FieldShell label="Site" error={errors.site?.message}>
          <input {...register("site", { onChange: clearFeedback })} placeholder="Central Office" className={inputClass} />
        </FieldShell>
        <FieldShell label="Compatible assets" error={errors.compatibleAssets?.message}>
          <input {...register("compatibleAssets", { onChange: clearFeedback })} placeholder="AHU-08, CU-12, CU-15" className={inputClass} />
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
        <FieldShell label="Status" error={errors.status?.message}>
          <select {...register("status", { onChange: clearFeedback })} className={cn(selectClass, errors.status && "border-destructive")}>
            {statusOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
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

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { ApiErrorAlert } from "@/components/feedback/api-error-alert";
import { MutationFeedback } from "@/components/feedback/mutation-feedback";
import {
  assetFormSchema,
  type AssetFormSchemaValues,
} from "@/features/assets/schemas/asset-schema";
import type {
  AssetCriticality,
  AssetFormValues,
  AssetStatus,
} from "@/features/assets/types/assets";
import { useStandardFormSubmit } from "@/hooks/use-standard-form-submit";
import { cn } from "@/lib/utils";
import { assetsService } from "@/services";

interface AssetFormProps {
  submitLabel: string;
  values: AssetFormValues;
  assetId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const statusOptions: AssetStatus[] = [
  "Operational",
  "Maintenance Due",
  "Under Repair",
  "Decommissioned",
];
const criticalityOptions: AssetCriticality[] = ["Critical", "High", "Medium", "Low"];

const inputClass =
  "flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100 dark:placeholder:text-stone-500";
const selectClass =
  "flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100";
const textareaClass =
  "flex min-h-[100px] w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100 dark:placeholder:text-stone-500";

export function AssetForm({ submitLabel, values, assetId, onSuccess, onCancel }: AssetFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<AssetFormSchemaValues>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: values,
  });
  const { isSubmitting, error, successMessage, run, clearFeedback } = useStandardFormSubmit();

  useEffect(() => {
    reset(values);
  }, [reset, values]);

  async function onSubmit(formValues: AssetFormSchemaValues) {
    const result = await run(
      () => assetsService.save(formValues, assetId),
      (response) => response.message,
    );

    if (result.error?.fieldErrors) {
      Object.entries(result.error.fieldErrors).forEach(([field, message]) => {
        setError(field as keyof AssetFormSchemaValues, {
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
        <FieldShell label="Asset Name" error={errors.name?.message}>
          <input
            {...register("name", { onChange: clearFeedback })}
            placeholder="Main Generator"
            className={inputClass}
          />
        </FieldShell>
        <FieldShell label="Asset Code" error={errors.code?.message}>
          <input
            {...register("code", { onChange: clearFeedback })}
            placeholder="GEN-104"
            className={inputClass}
          />
        </FieldShell>
        <FieldShell label="Category" error={errors.category?.message}>
          <input
            {...register("category", { onChange: clearFeedback })}
            placeholder="Power Systems"
            className={inputClass}
          />
        </FieldShell>
        <FieldShell label="Site" error={errors.site?.message}>
          <input
            {...register("site", { onChange: clearFeedback })}
            placeholder="Central Office"
            className={inputClass}
          />
        </FieldShell>
        <FieldShell label="Assigned Team" error={errors.assignedTeam?.message}>
          <input
            {...register("assignedTeam", { onChange: clearFeedback })}
            placeholder="Electrical"
            className={inputClass}
          />
        </FieldShell>
        <FieldShell label="Manufacturer" error={errors.manufacturer?.message}>
          <input
            {...register("manufacturer", { onChange: clearFeedback })}
            placeholder="Caterpillar"
            className={inputClass}
          />
        </FieldShell>
        <FieldShell label="Model" error={errors.model?.message}>
          <input
            {...register("model", { onChange: clearFeedback })}
            placeholder="CAT C15"
            className={inputClass}
          />
        </FieldShell>
        <FieldShell label="Serial Number" error={errors.serialNumber?.message}>
          <input
            {...register("serialNumber", { onChange: clearFeedback })}
            placeholder="CAT-55-2190"
            className={inputClass}
          />
        </FieldShell>
        <FieldShell label="Status" error={errors.status?.message}>
          <select
            {...register("status", { onChange: clearFeedback })}
            className={cn(selectClass, errors.status && "border-destructive")}
          >
            {statusOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </FieldShell>
        <FieldShell label="Criticality" error={errors.criticality?.message}>
          <select
            {...register("criticality", { onChange: clearFeedback })}
            className={cn(selectClass, errors.criticality && "border-destructive")}
          >
            {criticalityOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </FieldShell>
        <FieldShell label="Last Service Date" error={errors.lastServiceDate?.message}>
          <input
            type="date"
            {...register("lastServiceDate", { onChange: clearFeedback })}
            className={inputClass}
          />
        </FieldShell>
        <FieldShell label="Next Service Date" error={errors.nextServiceDate?.message}>
          <input
            type="date"
            {...register("nextServiceDate", { onChange: clearFeedback })}
            className={inputClass}
          />
        </FieldShell>
      </div>

      <FieldShell label="Condition Summary" error={errors.condition?.message}>
        <textarea
          {...register("condition", { onChange: clearFeedback })}
          placeholder="Describe current operational condition."
          className={textareaClass}
        />
      </FieldShell>

      <FieldShell label="Notes" error={errors.notes?.message}>
        <textarea
          {...register("notes", { onChange: clearFeedback })}
          placeholder="Add handling notes, constraints, or context."
          className={textareaClass}
        />
      </FieldShell>

      <div className="flex items-center justify-between gap-3 pt-2">
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

function FieldShell({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-1.5">
      <span className="text-sm font-medium text-slate-700 dark:text-stone-300">{label}</span>
      {children}
      {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
    </label>
  );
}

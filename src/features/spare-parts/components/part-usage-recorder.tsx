"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { sileo } from "sileo";

import { ApiErrorAlert } from "@/components/feedback/api-error-alert";
import { emptyPartUsageFormValues } from "@/features/spare-parts/data/spare-parts";
import { partUsageSchema, type PartUsageSchemaValues } from "@/features/spare-parts/schemas/spare-part-schema";
import type { SparePartMaintenanceOption, SparePartRecord } from "@/features/spare-parts/types/spare-parts";
import { useStandardFormSubmit } from "@/hooks/use-standard-form-submit";
import { cn } from "@/lib/utils";
import { sparePartsService } from "@/services";
import type { ApiErrorShape } from "@/services/http/types";

interface PartUsageRecorderProps {
  part: SparePartRecord;
  maintenanceJobs: SparePartMaintenanceOption[];
  onSaved?: () => void | Promise<void>;
}

const inputClass = "flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100 dark:placeholder:text-stone-500";
const selectClass = "flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100";
const textareaClass = "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100 dark:placeholder:text-stone-500";

export function PartUsageRecorder({ part, maintenanceJobs, onSaved }: PartUsageRecorderProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<PartUsageSchemaValues>({
    resolver: zodResolver(partUsageSchema),
    defaultValues: emptyPartUsageFormValues,
  });
  const { isSubmitting, error, run, clearFeedback } = useStandardFormSubmit();

  useEffect(() => {
    reset(emptyPartUsageFormValues);
  }, [part.id, reset]);

  async function onSubmit(values: PartUsageSchemaValues) {
    const result = await sileo
      .promise(
        async () => {
          const submission = await run(
            () => sparePartsService.recordUsage(part.id, values),
            (response) => response.message,
          );

          if (submission.error) {
            throw submission.error;
          }

          if (!submission.data) {
            throw new Error("Part usage response did not include record data.");
          }

          return submission.data;
        },
        {
          loading: {
            title: "Recording part usage...",
            description: `Issuing ${part.name} against a maintenance job.`,
          },
          success: (response) => ({
            title: "Part usage recorded",
            description: response.message,
          }),
          error: (errorValue) => ({
            title: "Usage failed",
            description:
              typeof errorValue === "object" && errorValue !== null && "message" in errorValue
                ? String((errorValue as { message?: unknown }).message)
                : "The part usage could not be recorded.",
          }),
        },
      )
      .catch((errorValue: ApiErrorShape) => {
        if (errorValue.fieldErrors) {
          Object.entries(errorValue.fieldErrors).forEach(([field, message]) => {
            setError(field as keyof PartUsageSchemaValues, {
              type: "server",
              message,
            });
          });
        }

        return null;
      });

    if (!result) return;

    reset(emptyPartUsageFormValues);
    await onSaved?.();
  }

  return (
    <div className="rounded-[20px] border border-slate-200 bg-white shadow-sm sm:rounded-[24px] dark:border-white/10 dark:bg-[#171815]">
      <div className="border-b border-slate-100 px-5 py-4 sm:px-6 sm:py-5 dark:border-white/8">
        <h2 className="text-base font-semibold text-slate-900 dark:text-stone-100">Record part usage</h2>
        <p className="mt-0.5 text-sm text-slate-400 dark:text-stone-500">Issue parts to a maintenance work order.</p>
      </div>

      <form className="space-y-4 px-5 py-5 sm:px-6" onSubmit={handleSubmit(onSubmit)}>
        {error ? <ApiErrorAlert message={error.message} /> : null}

        <div className="grid gap-4 md:grid-cols-2">
          <FieldShell label="Maintenance job" error={errors.maintenanceJob?.message}>
            <select
              {...register("maintenanceJob", { onChange: clearFeedback })}
              className={cn(selectClass, errors.maintenanceJob && "border-destructive")}
            >
              <option value="">Select work order</option>
              {maintenanceJobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.workOrder} - {job.assetName} - {job.technician}
                </option>
              ))}
            </select>
          </FieldShell>
          <FieldShell label="Quantity" error={errors.quantity?.message}>
            <input {...register("quantity", { onChange: clearFeedback })} placeholder="1" className={inputClass} />
          </FieldShell>
          <FieldShell label="Used at" error={errors.usedAt?.message}>
            <input {...register("usedAt", { onChange: clearFeedback })} type="datetime-local" className={inputClass} />
          </FieldShell>
        </div>

        <FieldShell label="Note" error={errors.note?.message}>
          <textarea
            {...register("note", { onChange: clearFeedback })}
            rows={3}
            placeholder="Optional usage note."
            className={textareaClass}
          />
        </FieldShell>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting || maintenanceJobs.length === 0}
            className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#145d66] px-8 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0e4d55] disabled:pointer-events-none disabled:opacity-50"
          >
            {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            {isSubmitting ? "Saving..." : "Record usage"}
            {!isSubmitting ? <ArrowRight className="h-4 w-4" /> : null}
          </button>
        </div>
      </form>
    </div>
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

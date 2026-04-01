"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { ApiErrorAlert } from "@/components/feedback/api-error-alert";
import { MutationFeedback } from "@/components/feedback/mutation-feedback";
import { maintenanceCompletionSchema, type MaintenanceCompletionSchemaValues } from "@/features/maintenance/schemas/maintenance-completion-schema";
import type { MaintenanceCompletionValues } from "@/features/maintenance/types/maintenance";
import { useStandardFormSubmit } from "@/hooks/use-standard-form-submit";
import { maintenanceService } from "@/services";

const inputClass = "flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100 dark:placeholder:text-stone-500";
const textareaClass = "flex min-h-[100px] w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100 dark:placeholder:text-stone-500";

interface MaintenanceCompletionFormProps {
  maintenanceId: string;
  values: MaintenanceCompletionValues;
}

export function MaintenanceCompletionForm({ maintenanceId, values }: MaintenanceCompletionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<MaintenanceCompletionSchemaValues>({
    resolver: zodResolver(maintenanceCompletionSchema),
    defaultValues: values,
  });
  const { isSubmitting, error, successMessage, run, clearFeedback } = useStandardFormSubmit();

  useEffect(() => {
    reset(values);
  }, [reset, values]);

  async function onSubmit(formValues: MaintenanceCompletionSchemaValues) {
    const result = await run(
      () => maintenanceService.updateCompletion(maintenanceId, formValues),
      (response) => response.message,
    );

    if (result.error?.fieldErrors) {
      Object.entries(result.error.fieldErrors).forEach(([field, message]) => {
        setError(field as keyof MaintenanceCompletionSchemaValues, {
          type: "server",
          message,
        });
      });
    }
  }

  return (
    <div className="rounded-[20px] border border-slate-200 bg-white shadow-sm sm:rounded-[24px] dark:border-white/10 dark:bg-[#171815]">
      <div className="border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5 dark:border-white/8">
        <h2 className="text-base font-semibold text-slate-900 dark:text-stone-100">Close-out form</h2>
        <p className="mt-0.5 text-sm text-slate-400 dark:text-stone-500">Completion</p>
      </div>
      <div className="px-4 py-5 sm:px-6">
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {error ? <ApiErrorAlert message={error.message} /> : null}
          {successMessage ? <MutationFeedback message={successMessage} /> : null}

          <FieldShell label="Resolution Summary" error={errors.resolution?.message}>
            <textarea {...register("resolution", { onChange: clearFeedback })} placeholder="Describe the repair outcome and operational status." className={textareaClass} />
          </FieldShell>

          <FieldShell label="Parts Used" error={errors.partsUsed?.message}>
            <input {...register("partsUsed", { onChange: clearFeedback })} placeholder="Relay assembly, insulated terminal set" className={inputClass} />
          </FieldShell>

          <div className="grid gap-4 md:grid-cols-2">
            <FieldShell label="Verified By" error={errors.verifiedBy?.message}>
              <input {...register("verifiedBy", { onChange: clearFeedback })} placeholder="QA Electrical" className={inputClass} />
            </FieldShell>
            <FieldShell label="Completed At" error={errors.completedAt?.message}>
              <input type="datetime-local" {...register("completedAt", { onChange: clearFeedback })} className={inputClass} />
            </FieldShell>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-11 items-center gap-2 rounded-full bg-[#145d66] px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0e4d55] disabled:pointer-events-none disabled:opacity-50"
            >
              {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
              {isSubmitting ? "Saving..." : "Save completion"}
              {!isSubmitting ? <ArrowRight className="h-4 w-4" /> : null}
            </button>
          </div>
        </form>
      </div>
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

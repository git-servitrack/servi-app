"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, ArrowRight, LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { sileo } from "sileo";

import { ApiErrorAlert } from "@/components/feedback/api-error-alert";
import { requestFormSchema, type RequestFormSchemaValues } from "@/features/service-requests/schemas/request-schema";
import type {
  RequestPriority,
  RequestStatus,
  ServiceRequestAssetOption,
  ServiceRequestFormValues,
  ServiceRequestRequesterOption,
} from "@/features/service-requests/types/service-requests";
import { useStandardFormSubmit } from "@/hooks/use-standard-form-submit";
import { cn } from "@/lib/utils";
import { serviceRequestsService } from "@/services";
import type { ApiErrorShape } from "@/services/http/types";

interface RequestFormProps {
  submitLabel: string;
  values: ServiceRequestFormValues;
  requestId?: string;
  assets: ServiceRequestAssetOption[];
  requesters: ServiceRequestRequesterOption[];
  onSuccess?: () => void;
  onCancel?: () => void;
}

const statusOptions: RequestStatus[] = ["New", "Under Review", "Scheduled", "In Progress", "Resolved", "Closed"];
const priorityOptions: RequestPriority[] = ["Critical", "High", "Medium", "Low"];

const inputClass = "flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100 dark:placeholder:text-stone-500";
const selectClass = "flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100";
const textareaClass = "flex min-h-[100px] w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100 dark:placeholder:text-stone-500";

export function RequestForm({
  submitLabel,
  values,
  requestId,
  assets,
  requesters,
  onSuccess,
  onCancel,
}: RequestFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted, touchedFields },
    reset,
    setError,
    setValue,
    control,
  } = useForm<RequestFormSchemaValues>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: values,
  });
  const { isSubmitting, error, run, clearFeedback } = useStandardFormSubmit();
  const isEditMode = Boolean(requestId);
  const selectedAssetId = useWatch({ control, name: "asset" });
  const assetWarning =
    !selectedAssetId && (isSubmitted || touchedFields.asset)
      ? errors.asset?.message ?? "Select a related asset before creating this service request."
      : undefined;

  useEffect(() => {
    reset(values);
  }, [reset, values]);

  useEffect(() => {
    const selectedAsset = assets.find((asset) => asset.id === selectedAssetId);

    if (selectedAsset) {
      setValue("site", selectedAsset.site, {
        shouldValidate: true,
      });
    }
  }, [assets, selectedAssetId, setValue]);

  async function onSubmit(formValues: RequestFormSchemaValues) {
    const result = await sileo
      .promise(
        async () => {
          const submission = await run(
            () => serviceRequestsService.save(formValues, requestId),
            (response) => response.message,
          );

          if (submission.error) {
            throw submission.error;
          }

          if (!submission.data) {
            throw new Error("Service request response did not include record data.");
          }

          return submission.data;
        },
        {
          loading: {
            title: isEditMode ? "Updating request..." : "Creating request...",
            description: isEditMode
              ? `Saving changes for ${formValues.title}.`
              : `Opening ${formValues.title} in the request queue.`,
          },
          success: (response) => ({
            title: isEditMode ? "Request updated" : "Request created",
            description: response.message,
          }),
          error: (errorValue) => ({
            title: isEditMode ? "Update failed" : "Create failed",
            description:
              typeof errorValue === "object" && errorValue !== null && "message" in errorValue
                ? String((errorValue as { message?: unknown }).message)
                : "The service request could not be saved.",
          }),
        },
      )
      .catch((errorValue: ApiErrorShape) => {
        if (errorValue.fieldErrors) {
          Object.entries(errorValue.fieldErrors).forEach(([field, message]) => {
            setError(field as keyof RequestFormSchemaValues, {
              type: "server",
              message,
            });
          });
        }

        return null;
      });

    if (result) {
      onSuccess?.();
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      {error ? <ApiErrorAlert message={error.message} /> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <FieldShell label="Request Title" error={errors.title?.message}>
          <input {...register("title", { onChange: clearFeedback })} placeholder="Badge scanner intermittently offline" className={inputClass} />
        </FieldShell>
        <FieldShell label="Requester" error={errors.requester?.message}>
          <select {...register("requester", { onChange: clearFeedback })} className={cn(selectClass, errors.requester && "border-destructive")}>
            <option value="">Select requester</option>
            {requesters.map((requester) => (
              <option key={requester.id} value={requester.id}>
                {requester.name} - {requester.email}
              </option>
            ))}
          </select>
        </FieldShell>
        <FieldShell label="Related Asset" warning={assetWarning}>
          <select
            {...register("asset", { onChange: clearFeedback })}
            className={cn(selectClass, assetWarning && "border-amber-400 bg-amber-50/70 focus-visible:border-amber-500 focus-visible:ring-amber-500/20 dark:border-amber-400/60 dark:bg-amber-400/10")}
          >
            <option value="">Select related asset</option>
            {assets.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.name} - {asset.site}
              </option>
            ))}
          </select>
        </FieldShell>
        <FieldShell label="Site" error={errors.site?.message}>
          <input {...register("site", { onChange: clearFeedback })} placeholder="Central Office" className={inputClass} />
        </FieldShell>
        <FieldShell label="Scheduled For" error={errors.scheduledFor?.message}>
          <input type="datetime-local" {...register("scheduledFor", { onChange: clearFeedback })} className={inputClass} />
        </FieldShell>
        <FieldShell label="Status" error={errors.status?.message}>
          <select {...register("status", { onChange: clearFeedback })} className={cn(selectClass, errors.status && "border-destructive")}>
            {statusOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </FieldShell>
        <FieldShell label="Priority" error={errors.priority?.message}>
          <select {...register("priority", { onChange: clearFeedback })} className={cn(selectClass, errors.priority && "border-destructive")}>
            {priorityOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </FieldShell>
      </div>

      <FieldShell label="Issue Summary" error={errors.summary?.message}>
        <textarea {...register("summary", { onChange: clearFeedback })} placeholder="Describe the issue, current impact, and any observations." className={textareaClass} />
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

function FieldShell({
  label,
  error,
  warning,
  children,
}: {
  label: string;
  error?: string;
  warning?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-1.5">
      <span className="text-sm font-medium text-slate-700 dark:text-stone-300">{label}</span>
      {children}
      {warning ? (
        <p className="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-300">
          <AlertTriangle className="h-3.5 w-3.5" />
          {warning}
        </p>
      ) : null}
      {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
    </label>
  );
}

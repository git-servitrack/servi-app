"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { sileo } from "sileo";

import { ApiErrorAlert } from "@/components/feedback/api-error-alert";
import { emptyStockOperationValues } from "@/features/spare-parts/data/spare-parts";
import {
  stockOperationSchema,
  type StockOperationSchemaValues,
} from "@/features/spare-parts/schemas/spare-part-schema";
import type { SparePartRecord, StockOperationValues } from "@/features/spare-parts/types/spare-parts";
import { useStandardFormSubmit } from "@/hooks/use-standard-form-submit";
import { cn } from "@/lib/utils";
import { sparePartsService } from "@/services";
import type { ApiErrorShape } from "@/services/http/types";

interface StockOperationPanelProps {
  part: SparePartRecord;
  onSaved?: () => void | Promise<void>;
}

const inputClass = "flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100 dark:placeholder:text-stone-500";
const selectClass = "flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100";
const textareaClass = "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100 dark:placeholder:text-stone-500";

const operationLabels: Record<StockOperationValues["operation"], string> = {
  add: "Add stock",
  deduct: "Deduct stock",
  adjust: "Adjust stock",
  reserve: "Reserve stock",
};

export function StockOperationPanel({ part, onSaved }: StockOperationPanelProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<StockOperationSchemaValues>({
    resolver: zodResolver(stockOperationSchema),
    defaultValues: emptyStockOperationValues,
  });
  const { isSubmitting, error, run, clearFeedback } = useStandardFormSubmit();

  useEffect(() => {
    reset(emptyStockOperationValues);
  }, [part.id, reset]);

  async function onSubmit(values: StockOperationSchemaValues) {
    const result = await sileo
      .promise(
        async () => {
          const submission = await run(
            () => sparePartsService.stockOperation(part.id, values),
            (response) => response.message,
          );

          if (submission.error) {
            throw submission.error;
          }

          if (!submission.data) {
            throw new Error("Stock operation response did not include record data.");
          }

          return submission.data;
        },
        {
          loading: {
            title: "Updating stock...",
            description: `${operationLabels[values.operation]} for ${part.name}.`,
          },
          success: (response) => ({
            title: "Stock updated",
            description: response.message,
          }),
          error: (errorValue) => ({
            title: "Stock update failed",
            description:
              typeof errorValue === "object" && errorValue !== null && "message" in errorValue
                ? String((errorValue as { message?: unknown }).message)
                : "The stock operation could not be completed.",
          }),
        },
      )
      .catch((errorValue: ApiErrorShape) => {
        if (errorValue.fieldErrors) {
          Object.entries(errorValue.fieldErrors).forEach(([field, message]) => {
            setError(field as keyof StockOperationSchemaValues, {
              type: "server",
              message,
            });
          });
        }

        return null;
      });

    if (!result) return;

    reset(emptyStockOperationValues);
    await onSaved?.();
  }

  return (
    <div className="rounded-[20px] border border-slate-200 bg-white shadow-sm sm:rounded-[24px] dark:border-white/10 dark:bg-[#171815]">
      <div className="border-b border-slate-100 px-5 py-4 sm:px-6 sm:py-5 dark:border-white/8">
        <h2 className="text-base font-semibold text-slate-900 dark:text-stone-100">Stock operations</h2>
        <p className="mt-0.5 text-sm text-slate-400 dark:text-stone-500">Add, issue, adjust, or reserve inventory.</p>
      </div>

      <form className="space-y-4 px-5 py-5 sm:px-6" onSubmit={handleSubmit(onSubmit)}>
        {error ? <ApiErrorAlert message={error.message} /> : null}

        <div className="grid gap-4 md:grid-cols-3">
          <FieldShell label="Operation" error={errors.operation?.message}>
            <select {...register("operation", { onChange: clearFeedback })} className={cn(selectClass, errors.operation && "border-destructive")}>
              <option value="add">Add stock</option>
              <option value="deduct">Deduct stock</option>
              <option value="adjust">Adjust stock</option>
              <option value="reserve">Reserve stock</option>
            </select>
          </FieldShell>
          <FieldShell label="Quantity" error={errors.quantity?.message}>
            <input {...register("quantity", { onChange: clearFeedback })} placeholder="5" className={inputClass} />
          </FieldShell>
          <FieldShell label="Movement reference" error={errors.reference?.message}>
            <input {...register("reference", { onChange: clearFeedback })} placeholder="PO-1001, MW-204, or cycle count" className={inputClass} />
          </FieldShell>
        </div>

        <FieldShell label="Note" error={errors.note?.message}>
          <textarea
            {...register("note", { onChange: clearFeedback })}
            rows={3}
            placeholder="Optional StockMovement note."
            className={textareaClass}
          />
        </FieldShell>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#145d66] px-8 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0e4d55] disabled:pointer-events-none disabled:opacity-50"
          >
            {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            {isSubmitting ? "Saving..." : "Save stock movement"}
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

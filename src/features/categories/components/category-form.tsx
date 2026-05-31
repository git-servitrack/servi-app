"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { sileo } from "sileo";

import { ApiErrorAlert } from "@/components/feedback/api-error-alert";
import {
  categoryFormSchema,
  type CategoryFormSchemaValues,
} from "@/features/categories/schemas/category-schema";
import type { CategoryFormValues } from "@/features/categories/types/categories";
import { useStandardFormSubmit } from "@/hooks/use-standard-form-submit";
import { cn } from "@/lib/utils";
import { categoriesService } from "@/services";
import type { ApiErrorShape } from "@/services/http/types";

interface CategoryFormProps {
  submitLabel: string;
  values: CategoryFormValues;
  categoryId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const inputClass =
  "flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100 dark:placeholder:text-stone-500";
const textareaClass =
  "flex min-h-[110px] w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100 dark:placeholder:text-stone-500";
const selectClass =
  "flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100";

export function CategoryForm({ submitLabel, values, categoryId, onSuccess, onCancel }: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<CategoryFormSchemaValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: values,
  });
  const { isSubmitting, error, run, clearFeedback } = useStandardFormSubmit();
  const isEditMode = Boolean(categoryId);

  useEffect(() => {
    reset(values);
  }, [reset, values]);

  async function onSubmit(formValues: CategoryFormSchemaValues) {
    const result = await sileo
      .promise(
        async () => {
          const submission = await run(
            () => categoriesService.save(formValues, categoryId),
            (response) => response.message,
          );

          if (submission.error) {
            throw submission.error;
          }

          if (!submission.data) {
            throw new Error("Category response did not include record data.");
          }

          return submission.data;
        },
        {
          loading: {
            title: isEditMode ? "Updating category..." : "Creating category...",
            description: isEditMode
              ? `Saving changes for ${formValues.name}.`
              : `Adding ${formValues.name} to category records.`,
          },
          success: (response) => ({
            title: isEditMode ? "Category updated" : "Category created",
            description: response.message,
          }),
          error: (errorValue) => ({
            title: isEditMode ? "Update failed" : "Create failed",
            description:
              typeof errorValue === "object" && errorValue !== null && "message" in errorValue
                ? String((errorValue as { message?: unknown }).message)
                : "The category record could not be saved.",
          }),
        },
      )
      .catch((errorValue: ApiErrorShape) => {
        if (errorValue.fieldErrors) {
          Object.entries(errorValue.fieldErrors).forEach(([field, message]) => {
            setError(field as keyof CategoryFormSchemaValues, {
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
        <FieldShell label="Category name" error={errors.name?.message}>
          <input
            {...register("name", { onChange: clearFeedback })}
            placeholder="Electrical"
            className={inputClass}
          />
        </FieldShell>
        <FieldShell label="Category code" error={errors.code?.message}>
          <input
            {...register("code", { onChange: clearFeedback })}
            placeholder="ELEC"
            className={inputClass}
          />
        </FieldShell>
        <FieldShell label="Status" error={errors.isActive?.message}>
          <select
            {...register("isActive", {
              setValueAs: (value) => value === "true",
              onChange: clearFeedback,
            })}
            className={cn(selectClass, errors.isActive && "border-destructive")}
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </FieldShell>
      </div>

      <FieldShell label="Description" error={errors.description?.message}>
        <textarea
          {...register("description", { onChange: clearFeedback })}
          placeholder="Describe what this category covers."
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

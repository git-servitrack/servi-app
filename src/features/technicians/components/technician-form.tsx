"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { sileo } from "sileo";

import { ApiErrorAlert } from "@/components/feedback/api-error-alert";
import {
  technicianEditFormSchema,
  technicianFormSchema,
  type TechnicianFormSchemaValues,
} from "@/features/technicians/schemas/technician-schema";
import type { TechnicianFormValues } from "@/features/technicians/types/technicians";
import { useStandardFormSubmit } from "@/hooks/use-standard-form-submit";
import { cn } from "@/lib/utils";
import { techniciansService } from "@/services";
import type { ApiErrorShape } from "@/services/http/types";

interface TechnicianFormProps {
  submitLabel: string;
  values: TechnicianFormValues;
  technicianId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const inputClass = "flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100 dark:placeholder:text-stone-500";

function getDisplayName(values: Pick<TechnicianFormSchemaValues, "firstName" | "lastName" | "username">) {
  return [values.firstName, values.lastName].filter(Boolean).join(" ") || values.username;
}

export function TechnicianForm({ submitLabel, values, technicianId, onSuccess, onCancel }: TechnicianFormProps) {
  const isEditMode = Boolean(technicianId);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<TechnicianFormSchemaValues>({
    resolver: zodResolver(isEditMode ? technicianEditFormSchema : technicianFormSchema),
    defaultValues: values,
  });
  const { isSubmitting, error, run, clearFeedback } = useStandardFormSubmit();

  useEffect(() => {
    reset(values);
  }, [reset, values]);

  async function onSubmit(formValues: TechnicianFormSchemaValues) {
    const { confirmPassword, ...payload } = formValues;
    void confirmPassword;

    const result = await sileo
      .promise(
        async () => {
          const submission = await run(
            () => techniciansService.save(payload, technicianId),
            (response) => response.message,
          );

          if (submission.error) {
            throw submission.error;
          }

          if (!submission.data) {
            throw new Error("Technician response did not include account data.");
          }

          return submission.data;
        },
        {
          loading: {
            title: isEditMode ? "Updating technician..." : "Creating technician...",
            description: isEditMode
              ? `Saving access changes for ${getDisplayName(payload)}.`
              : `Provisioning ${getDisplayName(payload)} as a technician.`,
          },
          success: (response) => ({
            title: isEditMode ? "Technician updated" : "Technician created",
            description: response.message,
          }),
          error: (errorValue) => ({
            title: isEditMode ? "Update failed" : "Create failed",
            description:
              typeof errorValue === "object" && errorValue !== null && "message" in errorValue
                ? String((errorValue as { message?: unknown }).message)
                : "The technician account could not be saved.",
          }),
        },
      )
      .catch((errorValue: ApiErrorShape) => {
        if (errorValue.fieldErrors) {
          Object.entries(errorValue.fieldErrors).forEach(([field, message]) => {
            setError(field as keyof TechnicianFormSchemaValues, {
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
        <FieldShell label="Username" error={errors.username?.message}>
          <input {...register("username", { onChange: clearFeedback })} placeholder="alex.montemayor" className={inputClass} />
        </FieldShell>
        <FieldShell label="Work email" error={errors.email?.message}>
          <input {...register("email", { onChange: clearFeedback })} placeholder="alex@servi-web.local" className={inputClass} />
        </FieldShell>
        <FieldShell label="First name" error={errors.firstName?.message}>
          <input {...register("firstName", { onChange: clearFeedback })} placeholder="Alex" className={inputClass} />
        </FieldShell>
        <FieldShell label="Middle name" error={errors.middleName?.message}>
          <input {...register("middleName", { onChange: clearFeedback })} placeholder="Optional" className={inputClass} />
        </FieldShell>
        <FieldShell label="Last name" error={errors.lastName?.message}>
          <input {...register("lastName", { onChange: clearFeedback })} placeholder="Montemayor" className={inputClass} />
        </FieldShell>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 dark:border-white/10 dark:bg-white/4">
          <p className="font-medium text-slate-900 dark:text-stone-100">Technician role</p>
          <p className="text-slate-500 dark:text-stone-400">This account is saved to the API as role: technician.</p>
        </div>
        <FieldShell label={isEditMode ? "New password" : "Temporary password"} error={errors.password?.message}>
          <PasswordField
            register={register}
            name="password"
            placeholder={isEditMode ? "Enter a new password" : "Temporary password"}
            clearFeedback={clearFeedback}
          />
        </FieldShell>
        <FieldShell label={isEditMode ? "Confirm new password" : "Confirm password"} error={errors.confirmPassword?.message}>
          <PasswordField
            register={register}
            name="confirmPassword"
            placeholder={isEditMode ? "Repeat the new password" : "Repeat password"}
            clearFeedback={clearFeedback}
          />
        </FieldShell>
        {isEditMode ? (
          <p className="text-xs leading-5 text-slate-500 dark:text-stone-400 md:col-span-2">
            Enter a new password to reset this technician account, or leave both password fields blank to keep it unchanged.
          </p>
        ) : null}
      </div>

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

function PasswordField({
  register,
  name,
  placeholder,
  clearFeedback,
}: {
  register: ReturnType<typeof useForm<TechnicianFormSchemaValues>>["register"];
  name: "password" | "confirmPassword";
  placeholder: string;
  clearFeedback: () => void;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        {...register(name, { onChange: clearFeedback })}
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        className={cn(inputClass, "pr-11")}
      />
      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 dark:text-stone-500 dark:hover:text-stone-300"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
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

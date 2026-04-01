"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { ApiErrorAlert } from "@/components/feedback/api-error-alert";
import { MutationFeedback } from "@/components/feedback/mutation-feedback";
import { authRoles } from "@/features/auth/data/auth-roles";
import { userManagementFormSchema, type UserManagementFormSchemaValues } from "@/features/user-management/schemas/user-management-schema";
import type { UserAccountStatus, UserManagementFormValues } from "@/features/user-management/types/user-management";
import { useStandardFormSubmit } from "@/hooks/use-standard-form-submit";
import { cn } from "@/lib/utils";
import { userManagementService } from "@/services/user-management/user-management.service";

interface UserFormProps {
  submitLabel: string;
  values: UserManagementFormValues;
  userId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const statusOptions: UserAccountStatus[] = ["Active", "Pending Activation", "Suspended"];

const inputClass = "flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100 dark:placeholder:text-stone-500";
const selectClass = "flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100";

export function UserForm({ submitLabel, values, userId, onSuccess, onCancel }: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    control,
  } = useForm<UserManagementFormSchemaValues>({
    resolver: zodResolver(userManagementFormSchema),
    defaultValues: values,
  });
  const { isSubmitting, error, successMessage, run, clearFeedback } = useStandardFormSubmit();
  const selectedRoleId = useWatch({ control, name: "roleId" });
  const selectedRole = authRoles.find((role) => role.id === selectedRoleId);

  useEffect(() => {
    reset(values);
  }, [reset, values]);

  async function onSubmit(formValues: UserManagementFormSchemaValues) {
    const { confirmPassword, ...payload } = formValues;
    void confirmPassword;

    const result = await run(() => userManagementService.save(payload, userId), (response) => response.message);

    if (result.error?.fieldErrors) {
      Object.entries(result.error.fieldErrors).forEach(([field, message]) => {
        setError(field as keyof UserManagementFormSchemaValues, {
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
        <FieldShell label="Full name" error={errors.fullName?.message}>
          <input {...register("fullName", { onChange: clearFeedback })} placeholder="Alex Montemayor" className={inputClass} />
        </FieldShell>
        <FieldShell label="Department" error={errors.department?.message}>
          <input {...register("department", { onChange: clearFeedback })} placeholder="Operations Control" className={inputClass} />
        </FieldShell>
        <FieldShell label="Work email" error={errors.email?.message}>
          <input {...register("email", { onChange: clearFeedback })} placeholder="alex@servi-web.local" className={inputClass} />
        </FieldShell>
        <FieldShell label="Assigned role" error={errors.roleId?.message}>
          <select {...register("roleId", { onChange: clearFeedback })} className={cn(selectClass, errors.roleId && "border-destructive")}>
            {authRoles.map((role) => (
              <option key={role.id} value={role.id}>{role.label}</option>
            ))}
          </select>
        </FieldShell>
        <FieldShell label="Temporary password" error={errors.password?.message}>
          <PasswordField register={register} name="password" placeholder="Temporary password" clearFeedback={clearFeedback} />
        </FieldShell>
        <FieldShell label="Confirm password" error={errors.confirmPassword?.message}>
          <PasswordField register={register} name="confirmPassword" placeholder="Repeat password" clearFeedback={clearFeedback} />
        </FieldShell>
        <FieldShell label="Account status" error={errors.status?.message}>
          <select {...register("status", { onChange: clearFeedback })} className={cn(selectClass, errors.status && "border-destructive")}>
            {statusOptions.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </FieldShell>
      </div>

      {selectedRole ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 dark:border-white/10 dark:bg-white/4">
          <p className="font-medium text-slate-900 dark:text-stone-100">{selectedRole.label}</p>
          <p className="mt-1 text-slate-500 dark:text-stone-400">{selectedRole.description}</p>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-stone-500">{selectedRole.audience}</p>
        </div>
      ) : null}

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

function PasswordField({
  register,
  name,
  placeholder,
  clearFeedback,
}: {
  register: ReturnType<typeof useForm<UserManagementFormSchemaValues>>["register"];
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
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 dark:text-stone-500 dark:hover:text-stone-300"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

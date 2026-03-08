"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

import { FormFieldShell } from "@/components/forms/form-field-shell";
import { PasswordInput } from "@/components/forms/password-input";
import { FormSubmitBar } from "@/components/forms/form-submit-bar";
import { ApiErrorAlert } from "@/components/feedback/api-error-alert";
import { MutationFeedback } from "@/components/feedback/mutation-feedback";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authRoles } from "@/features/auth/data/auth-roles";
import { userManagementFormSchema, type UserManagementFormSchemaValues } from "@/features/user-management/schemas/user-management-schema";
import type { UserAccountStatus, UserManagementFormValues } from "@/features/user-management/types/user-management";
import { useStandardFormSubmit } from "@/hooks/use-standard-form-submit";
import { cn } from "@/lib/utils";
import { userManagementService } from "@/services/user-management/user-management.service";

interface UserFormProps {
  title: string;
  description: string;
  submitLabel: string;
  values: UserManagementFormValues;
  userId?: string;
}

const statusOptions: UserAccountStatus[] = ["Active", "Pending Activation", "Suspended"];

export function UserForm({ title, description, submitLabel, values, userId }: UserFormProps) {
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
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error ? <ApiErrorAlert message={error.message} /> : null}
          {successMessage ? <MutationFeedback message={successMessage} /> : null}

          <div className="grid gap-4 md:grid-cols-2">
            <FormFieldShell label="Full name" error={errors.fullName?.message}>
              <Input {...register("fullName", { onChange: clearFeedback })} placeholder="Alex Montemayor" aria-invalid={Boolean(errors.fullName)} />
            </FormFieldShell>
            <FormFieldShell label="Department" error={errors.department?.message}>
              <Input {...register("department", { onChange: clearFeedback })} placeholder="Operations Control" aria-invalid={Boolean(errors.department)} />
            </FormFieldShell>
            <FormFieldShell label="Work email" error={errors.email?.message}>
              <Input {...register("email", { onChange: clearFeedback })} placeholder="alex@servi-web.local" aria-invalid={Boolean(errors.email)} />
            </FormFieldShell>
            <FormFieldShell label="Assigned role" error={errors.roleId?.message}>
              <select
                {...register("roleId", { onChange: clearFeedback })}
                aria-invalid={Boolean(errors.roleId)}
                className={cn(
                  "flex h-11 w-full rounded-full border border-input bg-background px-4 text-sm text-foreground shadow-sm outline-none",
                  errors.roleId ? "border-destructive ring-1 ring-destructive/30" : "",
                )}
              >
                {authRoles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.label}
                  </option>
                ))}
              </select>
            </FormFieldShell>
            <FormFieldShell label="Temporary password" error={errors.password?.message}>
              <PasswordInput {...register("password", { onChange: clearFeedback })} placeholder="Temporary password" aria-invalid={Boolean(errors.password)} />
            </FormFieldShell>
            <FormFieldShell label="Confirm password" error={errors.confirmPassword?.message}>
              <PasswordInput {...register("confirmPassword", { onChange: clearFeedback })} placeholder="Repeat password" aria-invalid={Boolean(errors.confirmPassword)} />
            </FormFieldShell>
            <FormFieldShell label="Account status" error={errors.status?.message}>
              <select
                {...register("status", { onChange: clearFeedback })}
                aria-invalid={Boolean(errors.status)}
                className={cn(
                  "flex h-11 w-full rounded-full border border-input bg-background px-4 text-sm text-foreground shadow-sm outline-none",
                  errors.status ? "border-destructive ring-1 ring-destructive/30" : "",
                )}
              >
                {statusOptions.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </FormFieldShell>
          </div>

          {selectedRole ? (
            <div className="rounded-[1.2rem] border border-border/70 bg-background/60 p-4 text-sm leading-6 text-muted-foreground">
              <p className="font-medium text-foreground">{selectedRole.label}</p>
              <p className="mt-1">{selectedRole.description}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">{selectedRole.audience}</p>
            </div>
          ) : null}

          <FormSubmitBar
            isSubmitting={isSubmitting}
            submitLabel={submitLabel}
            helpText="Admin-controlled provisioning uses the same shared form and service strategy as the rest of the app, with role assignment and account state managed in one place."
          />
        </form>
      </CardContent>
    </Card>
  );
}

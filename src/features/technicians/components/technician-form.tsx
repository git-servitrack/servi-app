"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { FormFieldShell } from "@/components/forms/form-field-shell";
import { FormSubmitBar } from "@/components/forms/form-submit-bar";
import { ApiErrorAlert } from "@/components/feedback/api-error-alert";
import { MutationFeedback } from "@/components/feedback/mutation-feedback";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { technicianFormSchema, type TechnicianFormSchemaValues } from "@/features/technicians/schemas/technician-schema";
import type { TechnicianFormValues, TechnicianStatus } from "@/features/technicians/types/technicians";
import { useStandardFormSubmit } from "@/hooks/use-standard-form-submit";
import { cn } from "@/lib/utils";
import { techniciansService } from "@/services";

interface TechnicianFormProps {
  title: string;
  description: string;
  submitLabel: string;
  values: TechnicianFormValues;
  technicianId?: string;
}

const statusOptions: TechnicianStatus[] = ["Available", "On Assignment", "Off Shift", "Leave"];

export function TechnicianForm({ title, description, submitLabel, values, technicianId }: TechnicianFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<TechnicianFormSchemaValues>({
    resolver: zodResolver(technicianFormSchema),
    defaultValues: values,
  });
  const { isSubmitting, error, successMessage, run, clearFeedback } = useStandardFormSubmit();

  useEffect(() => {
    reset(values);
  }, [reset, values]);

  async function onSubmit(formValues: TechnicianFormSchemaValues) {
    const result = await run(
      () => techniciansService.save(formValues, technicianId),
      (response) => response.message,
    );

    if (result.error?.fieldErrors) {
      Object.entries(result.error.fieldErrors).forEach(([field, message]) => {
        setError(field as keyof TechnicianFormSchemaValues, {
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
            <FormFieldShell label="Technician Name" error={errors.name?.message}>
              <Input {...register("name", { onChange: clearFeedback })} placeholder="R. Santos" aria-invalid={Boolean(errors.name)} />
            </FormFieldShell>
            <FormFieldShell label="Employee ID" error={errors.employeeId?.message}>
              <Input {...register("employeeId", { onChange: clearFeedback })} placeholder="EMP-2041" aria-invalid={Boolean(errors.employeeId)} />
            </FormFieldShell>
            <FormFieldShell label="Role" error={errors.role?.message}>
              <Input {...register("role", { onChange: clearFeedback })} placeholder="Senior Electrical Technician" aria-invalid={Boolean(errors.role)} />
            </FormFieldShell>
            <FormFieldShell label="Team" error={errors.team?.message}>
              <Input {...register("team", { onChange: clearFeedback })} placeholder="Electrical Response" aria-invalid={Boolean(errors.team)} />
            </FormFieldShell>
            <FormFieldShell label="Primary Skill" error={errors.primarySkill?.message}>
              <Input {...register("primarySkill", { onChange: clearFeedback })} placeholder="Power Systems" aria-invalid={Boolean(errors.primarySkill)} />
            </FormFieldShell>
            <FormFieldShell label="Site Coverage" error={errors.siteCoverage?.message}>
              <Input {...register("siteCoverage", { onChange: clearFeedback })} placeholder="Central Office, Annex Building" aria-invalid={Boolean(errors.siteCoverage)} />
            </FormFieldShell>
            <FormFieldShell label="Phone" error={errors.phone?.message}>
              <Input {...register("phone", { onChange: clearFeedback })} placeholder="+63 912 300 1001" aria-invalid={Boolean(errors.phone)} />
            </FormFieldShell>
            <FormFieldShell label="Email" error={errors.email?.message}>
              <Input {...register("email", { onChange: clearFeedback })} placeholder="r.santos@servi.local" aria-invalid={Boolean(errors.email)} />
            </FormFieldShell>
            <FormFieldShell label="Status" error={errors.status?.message}>
              <select
                {...register("status", { onChange: clearFeedback })}
                className={cn(
                  "flex h-11 w-full rounded-full border border-input bg-background px-4 text-sm text-foreground shadow-sm outline-none",
                  errors.status ? "border-destructive ring-1 ring-destructive/30" : "",
                )}
              >
                {statusOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </FormFieldShell>
          </div>

          <FormFieldShell label="Professional Summary" error={errors.bio?.message}>
            <Textarea
              {...register("bio", { onChange: clearFeedback })}
              placeholder="Describe the technician's responsibilities, specialization, and current operating context."
              aria-invalid={Boolean(errors.bio)}
            />
          </FormFieldShell>

          <FormSubmitBar
            isSubmitting={isSubmitting}
            submitLabel={submitLabel}
            helpText="This technician form now follows the shared RHF plus Zod pattern, including server-field validation mapping and consistent mutation feedback."
          />
        </form>
      </CardContent>
    </Card>
  );
}

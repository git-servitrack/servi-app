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
import { assetFormSchema, type AssetFormSchemaValues } from "@/features/assets/schemas/asset-schema";
import type { AssetCriticality, AssetFormValues, AssetStatus } from "@/features/assets/types/assets";
import { useStandardFormSubmit } from "@/hooks/use-standard-form-submit";
import { cn } from "@/lib/utils";
import { assetsService } from "@/services";

interface AssetFormProps {
  title: string;
  description: string;
  submitLabel: string;
  values: AssetFormValues;
  assetId?: string;
}

const statusOptions: AssetStatus[] = ["Operational", "Maintenance Due", "Under Repair", "Decommissioned"];
const criticalityOptions: AssetCriticality[] = ["Critical", "High", "Medium", "Low"];

export function AssetForm({ title, description, submitLabel, values, assetId }: AssetFormProps) {
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
            <FormFieldShell label="Asset Name" error={errors.name?.message}>
              <Input {...register("name", { onChange: clearFeedback })} placeholder="Main Generator" aria-invalid={Boolean(errors.name)} />
            </FormFieldShell>
            <FormFieldShell label="Asset Code" error={errors.code?.message}>
              <Input {...register("code", { onChange: clearFeedback })} placeholder="GEN-104" aria-invalid={Boolean(errors.code)} />
            </FormFieldShell>
            <FormFieldShell label="Category" error={errors.category?.message}>
              <Input {...register("category", { onChange: clearFeedback })} placeholder="Power Systems" aria-invalid={Boolean(errors.category)} />
            </FormFieldShell>
            <FormFieldShell label="Site" error={errors.site?.message}>
              <Input {...register("site", { onChange: clearFeedback })} placeholder="Central Office" aria-invalid={Boolean(errors.site)} />
            </FormFieldShell>
            <FormFieldShell label="Assigned Team" error={errors.assignedTeam?.message}>
              <Input {...register("assignedTeam", { onChange: clearFeedback })} placeholder="Electrical" aria-invalid={Boolean(errors.assignedTeam)} />
            </FormFieldShell>
            <FormFieldShell label="Manufacturer" error={errors.manufacturer?.message}>
              <Input {...register("manufacturer", { onChange: clearFeedback })} placeholder="Caterpillar" aria-invalid={Boolean(errors.manufacturer)} />
            </FormFieldShell>
            <FormFieldShell label="Model" error={errors.model?.message}>
              <Input {...register("model", { onChange: clearFeedback })} placeholder="CAT C15" aria-invalid={Boolean(errors.model)} />
            </FormFieldShell>
            <FormFieldShell label="Serial Number" error={errors.serialNumber?.message}>
              <Input {...register("serialNumber", { onChange: clearFeedback })} placeholder="CAT-55-2190" aria-invalid={Boolean(errors.serialNumber)} />
            </FormFieldShell>
            <FormFieldShell label="Status" error={errors.status?.message}>
              <select
                {...register("status", { onChange: clearFeedback })}
                aria-invalid={Boolean(errors.status)}
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
            <FormFieldShell label="Criticality" error={errors.criticality?.message}>
              <select
                {...register("criticality", { onChange: clearFeedback })}
                aria-invalid={Boolean(errors.criticality)}
                className={cn(
                  "flex h-11 w-full rounded-full border border-input bg-background px-4 text-sm text-foreground shadow-sm outline-none",
                  errors.criticality ? "border-destructive ring-1 ring-destructive/30" : "",
                )}
              >
                {criticalityOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </FormFieldShell>
            <FormFieldShell label="Last Service Date" error={errors.lastServiceDate?.message}>
              <Input type="date" {...register("lastServiceDate", { onChange: clearFeedback })} aria-invalid={Boolean(errors.lastServiceDate)} />
            </FormFieldShell>
            <FormFieldShell label="Next Service Date" error={errors.nextServiceDate?.message}>
              <Input type="date" {...register("nextServiceDate", { onChange: clearFeedback })} aria-invalid={Boolean(errors.nextServiceDate)} />
            </FormFieldShell>
          </div>

          <FormFieldShell label="Condition Summary" error={errors.condition?.message}>
            <Textarea
              {...register("condition", { onChange: clearFeedback })}
              placeholder="Describe current operational condition and recent findings."
              aria-invalid={Boolean(errors.condition)}
            />
          </FormFieldShell>

          <FormFieldShell label="Notes" error={errors.notes?.message}>
            <Textarea
              {...register("notes", { onChange: clearFeedback })}
              placeholder="Add handling notes, constraints, or operating context."
              aria-invalid={Boolean(errors.notes)}
            />
          </FormFieldShell>

          <FormSubmitBar
            isSubmitting={isSubmitting}
            submitLabel={submitLabel}
            helpText="This form now follows the shared submit pattern: client-side schema validation first, then a typed service mutation with standardized feedback."
          />
        </form>
      </CardContent>
    </Card>
  );
}

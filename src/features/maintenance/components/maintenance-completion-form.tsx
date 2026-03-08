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
import { maintenanceCompletionSchema, type MaintenanceCompletionSchemaValues } from "@/features/maintenance/schemas/maintenance-completion-schema";
import type { MaintenanceCompletionValues } from "@/features/maintenance/types/maintenance";
import { useStandardFormSubmit } from "@/hooks/use-standard-form-submit";
import { maintenanceService } from "@/services";

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
    <Card>
      <CardHeader>
        <CardDescription>Completion</CardDescription>
        <CardTitle>Close-out form</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {error ? <ApiErrorAlert message={error.message} /> : null}
          {successMessage ? <MutationFeedback message={successMessage} /> : null}

          <FormFieldShell label="Resolution Summary" error={errors.resolution?.message}>
            <Textarea
              {...register("resolution", { onChange: clearFeedback })}
              placeholder="Describe the repair outcome and operational status."
              aria-invalid={Boolean(errors.resolution)}
            />
          </FormFieldShell>

          <FormFieldShell label="Parts Used" error={errors.partsUsed?.message}>
            <Input
              {...register("partsUsed", { onChange: clearFeedback })}
              placeholder="Relay assembly, insulated terminal set"
              aria-invalid={Boolean(errors.partsUsed)}
            />
          </FormFieldShell>

          <div className="grid gap-4 md:grid-cols-2">
            <FormFieldShell label="Verified By" error={errors.verifiedBy?.message}>
              <Input {...register("verifiedBy", { onChange: clearFeedback })} placeholder="QA Electrical" aria-invalid={Boolean(errors.verifiedBy)} />
            </FormFieldShell>
            <FormFieldShell label="Completed At" error={errors.completedAt?.message}>
              <Input type="datetime-local" {...register("completedAt", { onChange: clearFeedback })} aria-invalid={Boolean(errors.completedAt)} />
            </FormFieldShell>
          </div>

          <FormSubmitBar
            isSubmitting={isSubmitting}
            submitLabel="Save completion"
            helpText="Completion now uses the same validation and mutation feedback flow as the other standardized forms."
          />
        </form>
      </CardContent>
    </Card>
  );
}

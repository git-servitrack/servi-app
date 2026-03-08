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
import { maintenanceAssignmentSchema, type MaintenanceAssignmentSchemaValues } from "@/features/maintenance/schemas/maintenance-assignment-schema";
import type { MaintenanceAssignment } from "@/features/maintenance/types/maintenance";
import { useStandardFormSubmit } from "@/hooks/use-standard-form-submit";
import { maintenanceService } from "@/services";

interface MaintenanceAssignmentUiProps {
  maintenanceId: string;
  assignment: MaintenanceAssignment;
}

export function MaintenanceAssignmentUi({ maintenanceId, assignment }: MaintenanceAssignmentUiProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<MaintenanceAssignmentSchemaValues>({
    resolver: zodResolver(maintenanceAssignmentSchema),
    defaultValues: assignment,
  });
  const { isSubmitting, error, successMessage, run, clearFeedback } = useStandardFormSubmit();

  useEffect(() => {
    reset(assignment);
  }, [assignment, reset]);

  async function onSubmit(values: MaintenanceAssignmentSchemaValues) {
    const result = await run(
      () => maintenanceService.updateAssignment(maintenanceId, values),
      (response) => response.message,
    );

    if (result.error?.fieldErrors) {
      Object.entries(result.error.fieldErrors).forEach(([field, message]) => {
        setError(field as keyof MaintenanceAssignmentSchemaValues, {
          type: "server",
          message,
        });
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardDescription>Assignment</CardDescription>
        <CardTitle>Current owner</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {error ? <ApiErrorAlert message={error.message} /> : null}
          {successMessage ? <MutationFeedback message={successMessage} /> : null}

          <div className="grid gap-4 md:grid-cols-2">
            <FormFieldShell label="Technician" error={errors.technician?.message}>
              <Input {...register("technician", { onChange: clearFeedback })} placeholder="R. Santos" aria-invalid={Boolean(errors.technician)} />
            </FormFieldShell>
            <FormFieldShell label="Team" error={errors.team?.message}>
              <Input {...register("team", { onChange: clearFeedback })} placeholder="Electrical Response" aria-invalid={Boolean(errors.team)} />
            </FormFieldShell>
            <FormFieldShell label="Shift" error={errors.shift?.message}>
              <Input {...register("shift", { onChange: clearFeedback })} placeholder="Day Shift" aria-invalid={Boolean(errors.shift)} />
            </FormFieldShell>
            <FormFieldShell label="ETA" error={errors.eta?.message}>
              <Input {...register("eta", { onChange: clearFeedback })} placeholder="Onsite now" aria-invalid={Boolean(errors.eta)} />
            </FormFieldShell>
          </div>

          <FormSubmitBar
            isSubmitting={isSubmitting}
            submitLabel="Save assignment"
            helpText="Assignment is now handled through the shared maintenance workflow mutation pattern instead of static display-only metadata."
          />
        </form>
      </CardContent>
    </Card>
  );
}

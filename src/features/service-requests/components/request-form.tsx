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
import { requestFormSchema, type RequestFormSchemaValues } from "@/features/service-requests/schemas/request-schema";
import type { RequestPriority, RequestStatus, ServiceRequestFormValues } from "@/features/service-requests/types/service-requests";
import { useStandardFormSubmit } from "@/hooks/use-standard-form-submit";
import { cn } from "@/lib/utils";
import { serviceRequestsService } from "@/services";

interface RequestFormProps {
  title: string;
  description: string;
  submitLabel: string;
  values: ServiceRequestFormValues;
  requestId?: string;
}

const statusOptions: RequestStatus[] = ["New", "Under Review", "Scheduled", "In Progress", "Resolved", "Closed"];
const priorityOptions: RequestPriority[] = ["Critical", "High", "Medium", "Low"];

export function RequestForm({ title, description, submitLabel, values, requestId }: RequestFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<RequestFormSchemaValues>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: values,
  });
  const { isSubmitting, error, successMessage, run, clearFeedback } = useStandardFormSubmit();

  useEffect(() => {
    reset(values);
  }, [reset, values]);

  async function onSubmit(formValues: RequestFormSchemaValues) {
    const result = await run(
      () => serviceRequestsService.save(formValues, requestId),
      (response) => response.message,
    );

    if (result.error?.fieldErrors) {
      Object.entries(result.error.fieldErrors).forEach(([field, message]) => {
        setError(field as keyof RequestFormSchemaValues, {
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
            <FormFieldShell label="Request Title" error={errors.title?.message}>
              <Input {...register("title", { onChange: clearFeedback })} placeholder="Badge scanner intermittently offline" aria-invalid={Boolean(errors.title)} />
            </FormFieldShell>
            <FormFieldShell label="Requester" error={errors.requester?.message}>
              <Input {...register("requester", { onChange: clearFeedback })} placeholder="M. Garcia" aria-invalid={Boolean(errors.requester)} />
            </FormFieldShell>
            <FormFieldShell label="Site" error={errors.site?.message}>
              <Input {...register("site", { onChange: clearFeedback })} placeholder="Central Office" aria-invalid={Boolean(errors.site)} />
            </FormFieldShell>
            <FormFieldShell label="Category" error={errors.category?.message}>
              <Input {...register("category", { onChange: clearFeedback })} placeholder="Access Control" aria-invalid={Boolean(errors.category)} />
            </FormFieldShell>
            <FormFieldShell label="Related Asset" error={errors.assetName?.message}>
              <Input {...register("assetName", { onChange: clearFeedback })} placeholder="Lobby Access Reader" aria-invalid={Boolean(errors.assetName)} />
            </FormFieldShell>
            <FormFieldShell label="Scheduled For" error={errors.scheduledFor?.message}>
              <Input type="datetime-local" {...register("scheduledFor", { onChange: clearFeedback })} aria-invalid={Boolean(errors.scheduledFor)} />
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
            <FormFieldShell label="Priority" error={errors.priority?.message}>
              <select
                {...register("priority", { onChange: clearFeedback })}
                className={cn(
                  "flex h-11 w-full rounded-full border border-input bg-background px-4 text-sm text-foreground shadow-sm outline-none",
                  errors.priority ? "border-destructive ring-1 ring-destructive/30" : "",
                )}
              >
                {priorityOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </FormFieldShell>
          </div>

          <FormFieldShell label="Issue Summary" error={errors.summary?.message}>
            <Textarea
              {...register("summary", { onChange: clearFeedback })}
              placeholder="Describe the issue, current impact, and any observations from the requester."
              aria-invalid={Boolean(errors.summary)}
            />
          </FormFieldShell>

          <FormSubmitBar
            isSubmitting={isSubmitting}
            submitLabel={submitLabel}
            helpText="This request form now uses the shared submit pattern with schema validation, typed mutation handling, and consistent feedback."
          />
        </form>
      </CardContent>
    </Card>
  );
}

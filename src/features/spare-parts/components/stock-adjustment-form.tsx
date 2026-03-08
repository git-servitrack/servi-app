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
import { sparePartFormSchema, type SparePartFormSchemaValues } from "@/features/spare-parts/schemas/spare-part-schema";
import type { SparePartFormValues, StockStatus } from "@/features/spare-parts/types/spare-parts";
import { useStandardFormSubmit } from "@/hooks/use-standard-form-submit";
import { cn } from "@/lib/utils";
import { sparePartsService } from "@/services";

interface StockAdjustmentFormProps {
  title: string;
  description: string;
  submitLabel: string;
  values: SparePartFormValues;
  partId?: string;
}

const statusOptions: StockStatus[] = ["In Stock", "Low Stock", "Critical", "Out of Stock"];

export function StockAdjustmentForm({ title, description, submitLabel, values, partId }: StockAdjustmentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<SparePartFormSchemaValues>({
    resolver: zodResolver(sparePartFormSchema),
    defaultValues: values,
  });
  const { isSubmitting, error, successMessage, run, clearFeedback } = useStandardFormSubmit();

  useEffect(() => {
    reset(values);
  }, [reset, values]);

  async function onSubmit(formValues: SparePartFormSchemaValues) {
    const result = await run(
      () => sparePartsService.save(formValues, partId),
      (response) => response.message,
    );

    if (result.error?.fieldErrors) {
      Object.entries(result.error.fieldErrors).forEach(([field, message]) => {
        setError(field as keyof SparePartFormSchemaValues, {
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
            <FormFieldShell label="Part Name" error={errors.name?.message}>
              <Input {...register("name", { onChange: clearFeedback })} placeholder="Compressor Relay" aria-invalid={Boolean(errors.name)} />
            </FormFieldShell>
            <FormFieldShell label="Part Number" error={errors.partNumber?.message}>
              <Input {...register("partNumber", { onChange: clearFeedback })} placeholder="SP-AC-2201" aria-invalid={Boolean(errors.partNumber)} />
            </FormFieldShell>
            <FormFieldShell label="Category" error={errors.category?.message}>
              <Input {...register("category", { onChange: clearFeedback })} placeholder="HVAC Electrical" aria-invalid={Boolean(errors.category)} />
            </FormFieldShell>
            <FormFieldShell label="Site" error={errors.site?.message}>
              <Input {...register("site", { onChange: clearFeedback })} placeholder="Central Office" aria-invalid={Boolean(errors.site)} />
            </FormFieldShell>
            <FormFieldShell label="Compatible Assets" error={errors.compatibleAssets?.message}>
              <Input {...register("compatibleAssets", { onChange: clearFeedback })} placeholder="AHU-08, CU-12, CU-15" aria-invalid={Boolean(errors.compatibleAssets)} />
            </FormFieldShell>
            <FormFieldShell label="Unit" error={errors.unit?.message}>
              <Input {...register("unit", { onChange: clearFeedback })} placeholder="pcs" aria-invalid={Boolean(errors.unit)} />
            </FormFieldShell>
            <FormFieldShell label="Stock On Hand" error={errors.stockOnHand?.message}>
              <Input {...register("stockOnHand", { onChange: clearFeedback })} placeholder="18" aria-invalid={Boolean(errors.stockOnHand)} />
            </FormFieldShell>
            <FormFieldShell label="Reserved Stock" error={errors.reservedStock?.message}>
              <Input {...register("reservedStock", { onChange: clearFeedback })} placeholder="4" aria-invalid={Boolean(errors.reservedStock)} />
            </FormFieldShell>
            <FormFieldShell label="Reorder Point" error={errors.reorderPoint?.message}>
              <Input {...register("reorderPoint", { onChange: clearFeedback })} placeholder="10" aria-invalid={Boolean(errors.reorderPoint)} />
            </FormFieldShell>
            <FormFieldShell label="Bin Location" error={errors.binLocation?.message}>
              <Input {...register("binLocation", { onChange: clearFeedback })} placeholder="Aisle A - Bin 12" aria-invalid={Boolean(errors.binLocation)} />
            </FormFieldShell>
            <FormFieldShell label="Supplier" error={errors.supplier?.message}>
              <Input {...register("supplier", { onChange: clearFeedback })} placeholder="Metro Controls Supply" aria-invalid={Boolean(errors.supplier)} />
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

          <FormFieldShell label="Inventory Notes" error={errors.notes?.message}>
            <Textarea
              {...register("notes", { onChange: clearFeedback })}
              placeholder="Capture storage conditions, procurement notes, or operational handling constraints."
              aria-invalid={Boolean(errors.notes)}
            />
          </FormFieldShell>

          <FormSubmitBar
            isSubmitting={isSubmitting}
            submitLabel={submitLabel}
            helpText="This inventory form now uses the shared submit pattern with schema validation, typed mutation services, and reusable feedback components."
          />
        </form>
      </CardContent>
    </Card>
  );
}

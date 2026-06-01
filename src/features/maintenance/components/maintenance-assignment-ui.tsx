"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { sileo } from "sileo";

import { ApiErrorAlert } from "@/components/feedback/api-error-alert";
import { maintenanceAssignmentSchema, type MaintenanceAssignmentSchemaValues } from "@/features/maintenance/schemas/maintenance-assignment-schema";
import type { MaintenanceAssignment } from "@/features/maintenance/types/maintenance";
import { useStandardFormSubmit } from "@/hooks/use-standard-form-submit";
import { cn } from "@/lib/utils";
import { maintenanceService } from "@/services";
import type { ApiErrorShape } from "@/services/http/types";
import type { MaintenanceTechnicianOption } from "@/services/maintenance/contracts";

const inputClass = "flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100 dark:placeholder:text-stone-500";
const selectClass = "flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100";

interface MaintenanceAssignmentUiProps {
  maintenanceId: string;
  assignment: MaintenanceAssignment;
  technicians: MaintenanceTechnicianOption[];
  onSaved?: () => void | Promise<void>;
}

export function MaintenanceAssignmentUi({
  maintenanceId,
  assignment,
  technicians,
  onSaved,
}: MaintenanceAssignmentUiProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    setValue,
    control,
  } = useForm<MaintenanceAssignmentSchemaValues>({
    resolver: zodResolver(maintenanceAssignmentSchema),
    defaultValues: assignment,
  });
  const { isSubmitting, error, run, clearFeedback } = useStandardFormSubmit();
  const selectedTechnicianId = useWatch({ control, name: "technicianId" });

  useEffect(() => {
    reset(assignment);
  }, [assignment, reset]);

  useEffect(() => {
    const technician = technicians.find((item) => item.id === selectedTechnicianId);

    if (technician) {
      setValue("technician", technician.name);
    }
  }, [selectedTechnicianId, setValue, technicians]);

  async function onSubmit(values: MaintenanceAssignmentSchemaValues) {
    const result = await sileo
      .promise(
        async () => {
          const submission = await run(
            () => maintenanceService.updateAssignment(maintenanceId, values),
            (response) => response.message,
          );

          if (submission.error) {
            throw submission.error;
          }

          if (!submission.data) {
            throw new Error("Maintenance response did not include record data.");
          }

          return submission.data;
        },
        {
          loading: {
            title: "Assigning technician...",
            description: "Saving ownership for this work order.",
          },
          success: (response) => ({
            title: "Assignment saved",
            description: response.message,
          }),
          error: (errorValue) => ({
            title: "Assignment failed",
            description:
              typeof errorValue === "object" && errorValue !== null && "message" in errorValue
                ? String((errorValue as { message?: unknown }).message)
                : "The maintenance assignment could not be saved.",
          }),
        },
      )
      .catch((errorValue: ApiErrorShape) => {
        if (errorValue.fieldErrors) {
          Object.entries(errorValue.fieldErrors).forEach(([field, message]) => {
            setError(field as keyof MaintenanceAssignmentSchemaValues, {
              type: "server",
              message,
            });
          });
        }

        return null;
      });

    if (result) {
      await onSaved?.();
    }
  }

  return (
    <div className="rounded-[20px] border border-slate-200 bg-white shadow-sm sm:rounded-[24px] dark:border-white/10 dark:bg-[#171815]">
      <div className="border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5 dark:border-white/8">
        <h2 className="text-base font-semibold text-slate-900 dark:text-stone-100">Current owner</h2>
        <p className="mt-0.5 text-sm text-slate-400 dark:text-stone-500">Assignment</p>
      </div>
      <div className="px-4 py-5 sm:px-6">
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {error ? <ApiErrorAlert message={error.message} /> : null}

          <div className="grid gap-4 md:grid-cols-2">
            <FieldShell label="Technician" error={errors.technicianId?.message}>
              <select
                {...register("technicianId", { onChange: clearFeedback })}
                className={cn(selectClass, errors.technicianId && "border-destructive")}
              >
                <option value="">Select technician</option>
                {technicians.map((technician) => (
                  <option key={technician.id} value={technician.id}>
                    {technician.name} - {technician.email}
                  </option>
                ))}
              </select>
            </FieldShell>
            <FieldShell label="Team" error={errors.team?.message}>
              <input {...register("team", { onChange: clearFeedback })} placeholder="Electrical Response" className={inputClass} />
            </FieldShell>
            <FieldShell label="Shift" error={errors.shift?.message}>
              <input {...register("shift", { onChange: clearFeedback })} placeholder="Day Shift" className={inputClass} />
            </FieldShell>
            <FieldShell label="ETA" error={errors.eta?.message}>
              <input {...register("eta", { onChange: clearFeedback })} placeholder="Onsite now" className={inputClass} />
            </FieldShell>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={isSubmitting || technicians.length === 0}
              className="flex h-11 items-center gap-2 rounded-full bg-[#145d66] px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0e4d55] disabled:pointer-events-none disabled:opacity-50"
            >
              {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
              {isSubmitting ? "Saving..." : "Save assignment"}
              {!isSubmitting ? <ArrowRight className="h-4 w-4" /> : null}
            </button>
          </div>
        </form>
      </div>
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

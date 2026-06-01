"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { LoaderCircle, Wrench, X } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { sileo } from "sileo";

import { ApiErrorAlert } from "@/components/feedback/api-error-alert";
import {
  createMaintenanceSchema,
  type CreateMaintenanceSchemaValues,
} from "@/features/maintenance/schemas/open-maintenance-schema";
import { useStandardFormSubmit } from "@/hooks/use-standard-form-submit";
import { cn } from "@/lib/utils";
import { maintenanceService } from "@/services";
import type { ApiErrorShape } from "@/services/http/types";
import type { MaintenanceFormOptions } from "@/services/maintenance/contracts";

const inputClass = "flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100 dark:placeholder:text-stone-500";
const selectClass = "flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100";
const textareaClass = "flex min-h-[90px] w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100 dark:placeholder:text-stone-500";

interface CreateMaintenanceModalProps {
  open: boolean;
  onClose: () => void;
  options: MaintenanceFormOptions;
  onSaved?: () => void | Promise<void>;
}

export function CreateMaintenanceModal({
  open,
  onClose,
  options,
  onSaved,
}: CreateMaintenanceModalProps) {
  const firstRequest = options.serviceRequests[0];
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    reset,
    control,
  } = useForm<CreateMaintenanceSchemaValues>({
    resolver: zodResolver(createMaintenanceSchema),
    defaultValues: {
      serviceRequestId: firstRequest?.id ?? "",
      workOrder: "",
      technicianId: options.technicians[0]?.id ?? "",
      team: "Maintenance Team",
      shift: "Day Shift",
      eta: "",
      diagnosisNotes: "",
    },
  });
  const selectedRequestId = useWatch({ control, name: "serviceRequestId" });
  const selectedRequest = options.serviceRequests.find((request) => request.id === selectedRequestId);
  const { isSubmitting, error, run, clearFeedback } = useStandardFormSubmit();

  useEffect(() => {
    if (open) {
      reset({
        serviceRequestId: options.serviceRequests[0]?.id ?? "",
        workOrder: "",
        technicianId: options.technicians[0]?.id ?? "",
        team: "Maintenance Team",
        shift: "Day Shift",
        eta: "",
        diagnosisNotes: "",
      });
    }
  }, [open, options.serviceRequests, options.technicians, reset]);

  useEffect(() => {
    if (selectedRequest?.site) {
      setValue("team", selectedRequest.category || "Maintenance Team");
    }
  }, [selectedRequest, setValue]);

  async function onSubmit(values: CreateMaintenanceSchemaValues) {
    const request = options.serviceRequests.find((item) => item.id === values.serviceRequestId);

    if (!request) {
      setError("serviceRequestId", {
        type: "manual",
        message: "Select a valid service request.",
      });
      return;
    }

    const result = await sileo
      .promise(
        async () => {
          const submission = await run(
            () => maintenanceService.create({
              workOrder: values.workOrder?.trim() || undefined,
              serviceRequest: request.id,
              asset: request.assetId,
              status: "Assigned",
              diagnosisNotes: values.diagnosisNotes?.trim() || undefined,
              assignment: {
                technician: values.technicianId,
                team: values.team,
                shift: values.shift,
                eta: values.eta,
              },
            }),
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
            title: "Creating maintenance...",
            description: "Opening a new maintenance work order.",
          },
          success: (response) => ({
            title: "Maintenance created",
            description: response.message,
          }),
          error: (errorValue) => ({
            title: "Create failed",
            description:
              typeof errorValue === "object" && errorValue !== null && "message" in errorValue
                ? String((errorValue as { message?: unknown }).message)
                : "The maintenance work order could not be created.",
          }),
        },
      )
      .catch((errorValue: ApiErrorShape) => {
        if (errorValue.fieldErrors) {
          Object.entries(errorValue.fieldErrors).forEach(([field, message]) => {
            setError(field as keyof CreateMaintenanceSchemaValues, {
              type: "server",
              message,
            });
          });
        }

        return null;
      });

    if (!result) return;

    await onSaved?.();
    onClose();
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
            className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-[24px] border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#1a1d1b]"
          >
            <div className="flex shrink-0 items-start justify-between border-b border-slate-100 px-6 pb-4 pt-6 dark:border-white/8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#145d66]/10 dark:bg-[#145d66]/20">
                  <Wrench className="h-5 w-5 text-[#145d66] dark:text-[#86d0d8]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-stone-100">
                    Create maintenance
                  </h2>
                  <p className="text-sm text-slate-400 dark:text-stone-500">
                    Open a work order from an existing service request.
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:text-stone-500 dark:hover:bg-white/8 dark:hover:text-stone-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="overflow-y-auto overscroll-contain px-6 py-5">
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                {error ? <ApiErrorAlert message={error.message} /> : null}
                {options.technicians.length === 0 ? <ApiErrorAlert message="Create at least one technician user before opening maintenance." /> : null}
                {options.serviceRequests.length === 0 ? <ApiErrorAlert message="Create at least one service request before opening maintenance." /> : null}

                <FieldShell label="Service request" error={errors.serviceRequestId?.message}>
                  <select
                    {...register("serviceRequestId", { onChange: clearFeedback })}
                    className={cn(selectClass, errors.serviceRequestId && "border-destructive")}
                  >
                    <option value="">Select service request</option>
                    {options.serviceRequests.map((request) => (
                      <option key={request.id} value={request.id}>
                        {request.ticketNumber} - {request.assetName}
                      </option>
                    ))}
                  </select>
                </FieldShell>

                <div className="grid gap-4 md:grid-cols-2">
                  <FieldShell label="Work order code" error={errors.workOrder?.message}>
                    <input {...register("workOrder", { onChange: clearFeedback })} placeholder="Leave blank to auto-generate" className={inputClass} />
                  </FieldShell>
                  <FieldShell label="Technician" error={errors.technicianId?.message}>
                    <select
                      {...register("technicianId", { onChange: clearFeedback })}
                      className={cn(selectClass, errors.technicianId && "border-destructive")}
                    >
                      <option value="">Select technician</option>
                      {options.technicians.map((technician) => (
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
                    <input {...register("eta", { onChange: clearFeedback })} placeholder="Today, 2:00 PM" className={inputClass} />
                  </FieldShell>
                </div>

                <FieldShell label="Initial diagnosis notes" error={errors.diagnosisNotes?.message}>
                  <textarea {...register("diagnosisNotes", { onChange: clearFeedback })} placeholder="Optional initial findings." className={textareaClass} />
                </FieldShell>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex h-12 items-center justify-center rounded-full border border-slate-200 px-8 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:text-stone-300 dark:hover:bg-white/6"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || options.technicians.length === 0 || options.serviceRequests.length === 0}
                    className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#145d66] px-8 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0e4d55] disabled:pointer-events-none disabled:opacity-50"
                  >
                    {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                    {isSubmitting ? "Creating..." : "Create maintenance"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
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

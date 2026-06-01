"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { LoaderCircle, Wrench, X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { sileo } from "sileo";

import { ApiErrorAlert } from "@/components/feedback/api-error-alert";
import {
  repairActionSchema,
  type RepairActionSchemaValues,
} from "@/features/maintenance/schemas/maintenance-workflow-schema";
import type { RepairAction } from "@/features/maintenance/types/maintenance";
import { useStandardFormSubmit } from "@/hooks/use-standard-form-submit";
import { maintenanceService } from "@/services";
import type { ApiErrorShape } from "@/services/http/types";

const inputClass = "flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100 dark:placeholder:text-stone-500";
const selectClass = "flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100";
const textareaClass = "flex min-h-[90px] w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100 dark:placeholder:text-stone-500";

interface RepairActionEditModalProps {
  action: RepairAction | null;
  actions: RepairAction[];
  maintenanceId: string;
  onClose: () => void;
  onSaved?: () => void | Promise<void>;
}

export function RepairActionEditModal({
  action,
  actions,
  maintenanceId,
  onClose,
  onSaved,
}: RepairActionEditModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<RepairActionSchemaValues>({
    resolver: zodResolver(repairActionSchema),
    defaultValues: {
      title: "",
      owner: "",
      status: "Pending",
      note: "",
    },
  });
  const { isSubmitting, error, run, clearFeedback } = useStandardFormSubmit();

  useEffect(() => {
    if (action) {
      reset({
        title: action.title,
        owner: action.owner,
        status: action.status,
        note: action.note,
      });
    }
  }, [action, reset]);

  async function onSubmit(values: RepairActionSchemaValues) {
    if (!action) return;

    const nextActions = actions.map((item) =>
      item.id === action.id
        ? {
            ...item,
            title: values.title,
            owner: values.owner,
            status: values.status,
            note: values.note ?? "",
          }
        : item,
    );

    const result = await sileo
      .promise(
        async () => {
          const submission = await run(
            () => maintenanceService.updateRepairActions(maintenanceId, nextActions),
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
            title: "Updating repair action...",
            description: values.title,
          },
          success: (response) => ({
            title: "Repair action updated",
            description: response.message,
          }),
          error: (errorValue) => ({
            title: "Update failed",
            description:
              typeof errorValue === "object" && errorValue !== null && "message" in errorValue
                ? String((errorValue as { message?: unknown }).message)
                : "The repair action could not be updated.",
          }),
        },
      )
      .catch((errorValue: ApiErrorShape) => {
        if (errorValue.fieldErrors) {
          Object.entries(errorValue.fieldErrors).forEach(([field, message]) => {
            setError(field as keyof RepairActionSchemaValues, {
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
      {action ? (
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
            className="relative flex max-h-[90vh] w-full max-w-xl flex-col rounded-[24px] border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#1a1d1b]"
          >
            <div className="flex shrink-0 items-start justify-between border-b border-slate-100 px-6 pb-4 pt-6 dark:border-white/8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#145d66]/10 dark:bg-[#145d66]/20">
                  <Wrench className="h-5 w-5 text-[#145d66] dark:text-[#86d0d8]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-stone-100">
                    Edit repair action
                  </h2>
                  <p className="text-sm text-slate-400 dark:text-stone-500">
                    Update owner, status, title, or note.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:text-stone-500 dark:hover:bg-white/8 dark:hover:text-stone-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="overflow-y-auto overscroll-contain px-6 py-5">
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                {error ? <ApiErrorAlert message={error.message} /> : null}

                <FieldShell label="Repair action" error={errors.title?.message}>
                  <input {...register("title", { onChange: clearFeedback })} className={inputClass} />
                </FieldShell>
                <div className="grid gap-4 md:grid-cols-2">
                  <FieldShell label="Owner" error={errors.owner?.message}>
                    <input {...register("owner", { onChange: clearFeedback })} className={inputClass} />
                  </FieldShell>
                  <FieldShell label="Status" error={errors.status?.message}>
                    <select {...register("status", { onChange: clearFeedback })} className={selectClass}>
                      {["Pending", "In Progress", "Done"].map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </FieldShell>
                </div>
                <FieldShell label="Note" error={errors.note?.message}>
                  <textarea {...register("note", { onChange: clearFeedback })} className={textareaClass} />
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
                    disabled={isSubmitting}
                    className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#145d66] px-8 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0e4d55] disabled:pointer-events-none disabled:opacity-50"
                  >
                    {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                    {isSubmitting ? "Saving..." : "Save changes"}
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

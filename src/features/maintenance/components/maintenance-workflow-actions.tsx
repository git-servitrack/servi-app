"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LoaderCircle, PauseCircle, PlayCircle, PlusCircle, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { sileo } from "sileo";

import { ApiErrorAlert } from "@/components/feedback/api-error-alert";
import {
  diagnosisNotesSchema,
  holdMaintenanceSchema,
  repairActionSchema,
  type DiagnosisNotesSchemaValues,
  type HoldMaintenanceSchemaValues,
  type RepairActionSchemaValues,
} from "@/features/maintenance/schemas/maintenance-workflow-schema";
import type {
  MaintenanceRecord,
  MaintenanceStatus,
} from "@/features/maintenance/types/maintenance";
import { useStandardFormSubmit } from "@/hooks/use-standard-form-submit";
import { cn } from "@/lib/utils";
import { maintenanceService } from "@/services";
import type { ApiErrorShape } from "@/services/http/types";

const nextStatusOptions: Record<MaintenanceStatus, MaintenanceStatus[]> = {
  Assigned: ["Diagnosing", "On Hold"],
  Diagnosing: ["Awaiting Parts", "Repair In Progress", "On Hold"],
  "Awaiting Parts": ["Repair In Progress", "On Hold"],
  "Repair In Progress": ["Ready for QA", "On Hold"],
  "On Hold": ["Assigned", "Diagnosing", "Awaiting Parts", "Repair In Progress"],
  "Ready for QA": ["Repair In Progress"],
  Completed: [],
};

const inputClass =
  "flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100 dark:placeholder:text-stone-500";
const selectClass =
  "flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100";
const textareaClass =
  "flex min-h-[92px] w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100 dark:placeholder:text-stone-500";

interface MaintenanceWorkflowActionsProps {
  item: MaintenanceRecord;
  actor: string;
  onSaved: () => void | Promise<void>;
}

export function MaintenanceWorkflowActions({
  item,
  actor,
  onSaved,
}: MaintenanceWorkflowActionsProps) {
  const statusOptions = nextStatusOptions[item.status];
  const statusSubmit = useStandardFormSubmit();
  const startSubmit = useStandardFormSubmit();
  const diagnosisSubmit = useStandardFormSubmit();
  const repairSubmit = useStandardFormSubmit();
  const holdSubmit = useStandardFormSubmit();
  const diagnosisForm = useForm<DiagnosisNotesSchemaValues>({
    resolver: zodResolver(diagnosisNotesSchema),
    defaultValues: {
      diagnosisNotes: item.diagnosisNotes === "No diagnosis notes yet." ? "" : item.diagnosisNotes,
    },
  });
  const repairForm = useForm<RepairActionSchemaValues>({
    resolver: zodResolver(repairActionSchema),
    defaultValues: {
      title: "",
      owner: actor,
      status: "Pending",
      note: "",
    },
  });
  const holdForm = useForm<HoldMaintenanceSchemaValues>({
    resolver: zodResolver(holdMaintenanceSchema),
    defaultValues: {
      reason: "",
    },
  });

  async function runMutation<TResponse>(
    executor: () => Promise<{ data: TResponse | null; error: ApiErrorShape | null }>,
    messages: {
      loading: string;
      success: string;
      error: string;
    },
    submit: ReturnType<typeof useStandardFormSubmit>,
  ) {
    const result = await sileo
      .promise(
        async () => {
          const submission = await submit.run(executor, () => messages.success);

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
            title: messages.loading,
            description: item.workOrder,
          },
          success: {
            title: messages.success,
            description: "Maintenance workflow refreshed.",
          },
          error: (errorValue) => ({
            title: messages.error,
            description:
              typeof errorValue === "object" && errorValue !== null && "message" in errorValue
                ? String((errorValue as { message?: unknown }).message)
                : "The workflow action could not be completed.",
          }),
        },
      )
      .catch(() => null);

    if (result) {
      await onSaved();
    }

    return result;
  }

  async function handleStart() {
    await runMutation(
      () => maintenanceService.start(item.id, { actor }),
      {
        loading: "Starting maintenance...",
        success: "Maintenance started",
        error: "Start failed",
      },
      startSubmit,
    );
  }

  async function handleStatusChange(status: MaintenanceStatus) {
    if (status === item.status || status === "Completed") return;

    await runMutation(
      () => maintenanceService.updateStatus(item.id, status),
      {
        loading: "Updating status...",
        success: "Status updated",
        error: "Status update failed",
      },
      statusSubmit,
    );
  }

  async function handleDiagnosisSubmit(values: DiagnosisNotesSchemaValues) {
    const result = await runMutation(
      () => maintenanceService.saveDiagnosis(item.id, { ...values, actor }),
      {
        loading: "Saving diagnosis...",
        success: "Diagnosis saved",
        error: "Diagnosis failed",
      },
      diagnosisSubmit,
    );

    if (result) {
      diagnosisForm.reset(values);
    }
  }

  async function handleRepairSubmit(values: RepairActionSchemaValues) {
    const result = await runMutation(
      () => maintenanceService.addRepairAction(item.id, { ...values, actor }),
      {
        loading: "Adding repair action...",
        success: "Repair action added",
        error: "Repair action failed",
      },
      repairSubmit,
    );

    if (result) {
      repairForm.reset({
        title: "",
        owner: actor,
        status: "Pending",
        note: "",
      });
    }
  }

  async function handleHoldSubmit(values: HoldMaintenanceSchemaValues) {
    const result = await runMutation(
      () => maintenanceService.hold(item.id, { ...values, actor }),
      {
        loading: "Putting work order on hold...",
        success: "Maintenance on hold",
        error: "Hold failed",
      },
      holdSubmit,
    );

    if (result) {
      holdForm.reset({ reason: "" });
    }
  }

  return (
    <div className="rounded-[20px] border border-slate-200 bg-white shadow-sm sm:rounded-[24px] dark:border-white/10 dark:bg-[#171815]">
      <div className="border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5 dark:border-white/8">
        <h2 className="text-base font-semibold text-slate-900 dark:text-stone-100">
          Workflow actions
        </h2>
        <p className="mt-0.5 text-sm text-slate-400 dark:text-stone-500">
          Use guided API actions for valid status changes.
        </p>
      </div>

      <div className="space-y-5 px-4 py-5 sm:px-6">
        {statusSubmit.error ||
        startSubmit.error ||
        diagnosisSubmit.error ||
        repairSubmit.error ||
        holdSubmit.error ? (
          <ApiErrorAlert
            message={
              statusSubmit.error?.message ??
              startSubmit.error?.message ??
              diagnosisSubmit.error?.message ??
              repairSubmit.error?.message ??
              holdSubmit.error?.message ??
              "Workflow action failed."
            }
          />
        ) : null}

        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-white/8 dark:bg-white/4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-stone-500">
            Next status
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <select
              value=""
              disabled={statusOptions.length === 0 || statusSubmit.isSubmitting}
              onChange={(event) => {
                const status = event.target.value as MaintenanceStatus;
                if (status) {
                  void handleStatusChange(status);
                }
              }}
              className={selectClass}
            >
              <option value="">Choose next status</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleStart}
              disabled={
                item.status === "Completed" ||
                item.status === "Diagnosing" ||
                startSubmit.isSubmitting
              }
              className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[#145d66] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0e4d55] disabled:pointer-events-none disabled:opacity-50"
            >
              {startSubmit.isSubmitting ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <PlayCircle className="h-4 w-4" />
              )}
              Start diagnosing
            </button>
          </div>
        </div>

        <form className="space-y-3" onSubmit={diagnosisForm.handleSubmit(handleDiagnosisSubmit)}>
          <FieldShell
            label="Diagnosis notes"
            error={diagnosisForm.formState.errors.diagnosisNotes?.message}
          >
            <textarea
              {...diagnosisForm.register("diagnosisNotes", {
                onChange: diagnosisSubmit.clearFeedback,
              })}
              placeholder="Describe root cause, symptoms, and findings."
              className={textareaClass}
            />
          </FieldShell>
          <ActionButton loading={diagnosisSubmit.isSubmitting} icon={Save} label="Save diagnosis" />
        </form>

        <form className="space-y-3" onSubmit={repairForm.handleSubmit(handleRepairSubmit)}>
          <div className="grid gap-3 md:grid-cols-2">
            <FieldShell label="Repair action" error={repairForm.formState.errors.title?.message}>
              <input
                {...repairForm.register("title", { onChange: repairSubmit.clearFeedback })}
                placeholder="Replace relay assembly"
                className={inputClass}
              />
            </FieldShell>
            <FieldShell label="Owner" error={repairForm.formState.errors.owner?.message}>
              <input
                {...repairForm.register("owner", { onChange: repairSubmit.clearFeedback })}
                placeholder="Technician or team"
                className={inputClass}
              />
            </FieldShell>
            <FieldShell label="Action status" error={repairForm.formState.errors.status?.message}>
              <select
                {...repairForm.register("status", { onChange: repairSubmit.clearFeedback })}
                className={selectClass}
              >
                {["Pending", "In Progress", "Done"].map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </FieldShell>
          </div>
          <FieldShell label="Action note" error={repairForm.formState.errors.note?.message}>
            <textarea
              {...repairForm.register("note", { onChange: repairSubmit.clearFeedback })}
              placeholder="Add context or constraints."
              className={textareaClass}
            />
          </FieldShell>
          <ActionButton
            loading={repairSubmit.isSubmitting}
            icon={PlusCircle}
            label="Add repair action"
          />
        </form>

        <form
          className={cn(
            "space-y-3 rounded-2xl border border-rose-100 bg-rose-50/40 p-4 dark:border-rose-900/40 dark:bg-rose-950/10",
            item.status === "Completed" && "opacity-60",
          )}
          onSubmit={holdForm.handleSubmit(handleHoldSubmit)}
        >
          <FieldShell label="Hold reason" error={holdForm.formState.errors.reason?.message}>
            <textarea
              {...holdForm.register("reason", { onChange: holdSubmit.clearFeedback })}
              placeholder="Waiting for parts, access window, safety clearance..."
              className={textareaClass}
              disabled={item.status === "Completed"}
            />
          </FieldShell>
          <ActionButton
            loading={holdSubmit.isSubmitting}
            icon={PauseCircle}
            label="Put on hold"
            disabled={item.status === "Completed" || item.status === "On Hold"}
            tone="danger"
          />
        </form>
      </div>
    </div>
  );
}

function ActionButton({
  loading,
  icon: Icon,
  label,
  disabled,
  tone = "primary",
}: {
  loading: boolean;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  disabled?: boolean;
  tone?: "primary" | "danger";
}) {
  return (
    <div className="mt-5 flex justify-end">
      <button
        type="submit"
        disabled={loading || disabled}
        className={cn(
          "flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-white transition-colors disabled:pointer-events-none disabled:opacity-50",
          tone === "danger" ? "bg-rose-500 hover:bg-rose-600" : "bg-[#145d66] hover:bg-[#0e4d55]",
        )}
      >
        {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
        {loading ? "Saving..." : label}
        {!loading && tone === "primary" ? <ArrowRight className="h-4 w-4" /> : null}
      </button>
    </div>
  );
}

function FieldShell({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-1.5">
      <span className="text-sm font-medium text-slate-700 dark:text-stone-300">{label}</span>
      {children}
      {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
    </label>
  );
}

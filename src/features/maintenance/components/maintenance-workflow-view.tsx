"use client";

import Link from "next/link";
import { ArrowLeft, Check, LoaderCircle, PauseCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { ApiErrorAlert } from "@/components/feedback/api-error-alert";
import { cn } from "@/lib/utils";
import { MaintenanceAssignmentUi } from "@/features/maintenance/components/maintenance-assignment-ui";
import { MaintenanceCompletionForm } from "@/features/maintenance/components/maintenance-completion-form";
import { MaintenanceStatusBadge } from "@/features/maintenance/components/maintenance-status-badge";
import { MaintenanceTimeline } from "@/features/maintenance/components/maintenance-timeline";
import { MaintenanceWorkflowActions } from "@/features/maintenance/components/maintenance-workflow-actions";
import { RepairActionEditModal } from "@/features/maintenance/components/repair-action-edit-modal";
import { RepairActionList } from "@/features/maintenance/components/repair-action-list";
import type { MaintenanceRecord, RepairAction } from "@/features/maintenance/types/maintenance";
import { authService, maintenanceService } from "@/services";
import type { ApiErrorShape } from "@/services/http/types";
import type { MaintenanceTechnicianOption } from "@/services/maintenance/contracts";

const workflowSteps = [
  "Assigned",
  "Diagnosing",
  "Awaiting Parts",
  "Repair In Progress",
  "Ready for QA",
  "Completed",
] as const;

function getActorFallback() {
  return "Service Desk";
}

export function MaintenanceWorkflowView({ maintenanceId }: { maintenanceId: string }) {
  const [item, setItem] = useState<MaintenanceRecord | null>(null);
  const [technicians, setTechnicians] = useState<MaintenanceTechnicianOption[]>([]);
  const [actor, setActor] = useState(getActorFallback());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiErrorShape | null>(null);
  const [repairActionToEdit, setRepairActionToEdit] = useState<RepairAction | null>(null);

  const loadMaintenance = useCallback(async () => {
    const [itemResult, optionsResult] = await Promise.all([
      maintenanceService.getById(maintenanceId),
      maintenanceService.formOptions(),
    ]);

    if (itemResult.error) {
      setError(itemResult.error);
      setItem(null);
    } else {
      setItem(itemResult.data);
    }

    if (optionsResult.error) {
      setError(optionsResult.error);
      setTechnicians([]);
    } else {
      setTechnicians(optionsResult.data.technicians);
    }

    if (!itemResult.error && !optionsResult.error) {
      setError(null);
    }
  }, [maintenanceId]);

  useEffect(() => {
    let active = true;

    async function loadInitialData() {
      const [currentUserResult] = await Promise.all([
        authService.getCurrentUser(),
        loadMaintenance(),
      ]);

      if (!active) return;

      if (!currentUserResult.error) {
        setActor(currentUserResult.data.session.fullName);
      }

      setIsLoading(false);
    }

    void loadInitialData();

    return () => {
      active = false;
    };
  }, [loadMaintenance]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-2 text-sm text-slate-500 dark:text-stone-400">
        <LoaderCircle className="h-4 w-4 animate-spin" />
        Loading maintenance workflow...
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <ApiErrorAlert message={error?.message ?? "Maintenance workflow could not be found."} />
        <Link
          href="/maintenance"
          className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#145d66] hover:text-[#0e4d55]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to maintenance
        </Link>
      </div>
    );
  }

  const currentStepIndex = workflowSteps.findIndex((step) => step === item.status);
  const isOnHold = item.status === "On Hold";

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <Link
          href="/maintenance"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-900 dark:text-stone-400 dark:hover:text-stone-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to maintenance
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#145d66]">Maintenance Workflow</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-stone-100">
              {item.workOrder}
            </h1>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-stone-400">
              {item.assetName} - {item.site}
            </p>
          </div>
          <MaintenanceStatusBadge status={item.status} />
        </div>

        {isOnHold ? (
          <div className="mt-5 flex items-start gap-3 rounded-[20px] border border-rose-200 bg-rose-50 px-4 py-4 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300">
            <PauseCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="text-sm font-semibold">This work order is on hold.</p>
              <p className="mt-0.5 text-sm opacity-80">
                Use the workflow actions to resume into the correct operational status.
              </p>
            </div>
          </div>
        ) : null}

        <div className="mt-5 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-6">
          {workflowSteps.map((step, index) => {
            const isActive = !isOnHold && index === currentStepIndex;
            const isComplete = currentStepIndex > -1 && index < currentStepIndex;

            return (
              <div
                key={step}
                className={cn(
                  "rounded-2xl border px-3 py-3 text-center sm:px-4 sm:py-4",
                  isActive
                    ? "border-[#145d66] bg-[#145d66]/5 dark:border-[#86d0d8]/40 dark:bg-[#145d66]/10"
                    : isComplete
                      ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-800/40 dark:bg-emerald-950/20"
                      : "border-slate-200 bg-white dark:border-white/10 dark:bg-[#171815]",
                )}
              >
                <div className="flex items-center justify-center gap-1.5">
                  {isComplete ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : null}
                  <p className={cn(
                    "text-[10px] font-semibold uppercase tracking-wider",
                    isActive ? "text-[#145d66] dark:text-[#86d0d8]"
                    : isComplete ? "text-emerald-600 dark:text-emerald-400"
                    : "text-slate-400 dark:text-stone-500",
                  )}>
                    {isComplete ? "Done" : isActive ? "Current" : "Upcoming"}
                  </p>
                </div>
                <p className={cn(
                  "mt-1 text-sm font-semibold",
                  isActive ? "text-slate-900 dark:text-stone-100"
                  : isComplete ? "text-emerald-700 dark:text-emerald-300"
                  : "text-slate-500 dark:text-stone-400",
                )}>
                  {step}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-4 sm:mt-6">
          <MaintenanceWorkflowActions item={item} actor={actor} onSaved={loadMaintenance} />
        </div>

        <div className="mt-4 sm:mt-6">
          <MaintenanceTimeline events={item.timeline} />
        </div>

        <div className="mt-4 grid gap-4 sm:mt-6 sm:gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <MaintenanceAssignmentUi
            maintenanceId={item.id}
            assignment={item.assignment}
            technicians={technicians}
            onSaved={loadMaintenance}
          />
          <RepairActionList actions={item.repairActions} onEdit={setRepairActionToEdit} />
        </div>

        <div className="mt-4 pb-6 sm:mt-6 sm:pb-8">
          <MaintenanceCompletionForm
            maintenanceId={item.id}
            values={item.completion}
            actor={actor}
            onSaved={loadMaintenance}
          />
        </div>
      </div>
      <RepairActionEditModal
        action={repairActionToEdit}
        actions={item.repairActions}
        maintenanceId={item.id}
        onClose={() => setRepairActionToEdit(null)}
        onSaved={loadMaintenance}
      />
    </div>
  );
}

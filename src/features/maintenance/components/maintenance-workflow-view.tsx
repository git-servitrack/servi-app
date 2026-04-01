import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { DiagnosisNotesPanel } from "@/features/maintenance/components/diagnosis-notes-panel";
import { MaintenanceAssignmentUi } from "@/features/maintenance/components/maintenance-assignment-ui";
import { MaintenanceCompletionForm } from "@/features/maintenance/components/maintenance-completion-form";
import { MaintenanceStatusBadge } from "@/features/maintenance/components/maintenance-status-badge";
import { MaintenanceTimeline } from "@/features/maintenance/components/maintenance-timeline";
import { RepairActionList } from "@/features/maintenance/components/repair-action-list";
import type { MaintenanceRecord } from "@/features/maintenance/types/maintenance";

const workflowSteps = [
  "Assigned",
  "Diagnosing",
  "Awaiting Parts",
  "Repair In Progress",
  "Ready for QA",
  "Completed",
] as const;

export function MaintenanceWorkflowView({ item }: { item: MaintenanceRecord }) {
  const currentStepIndex = workflowSteps.findIndex((step) => step === item.status);

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
              {item.assetName} · {item.site}
            </p>
          </div>
          <MaintenanceStatusBadge status={item.status} />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-6">
          {workflowSteps.map((step, index) => {
            const isActive = index === currentStepIndex;
            const isComplete = index < currentStepIndex;

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

        <div className="mt-4 grid gap-4 sm:mt-6 sm:gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <MaintenanceTimeline events={item.timeline} />
          <div className="space-y-4 sm:space-y-6">
            <MaintenanceAssignmentUi maintenanceId={item.id} assignment={item.assignment} />
            <DiagnosisNotesPanel notes={item.diagnosisNotes} />
          </div>
        </div>

        <div className="mt-4 grid gap-4 pb-6 sm:mt-6 sm:gap-6 sm:pb-8 xl:grid-cols-[1.05fr_0.95fr]">
          <RepairActionList actions={item.repairActions} />
          <MaintenanceCompletionForm maintenanceId={item.id} values={item.completion} />
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { DiagnosisNotesPanel } from "@/features/maintenance/components/diagnosis-notes-panel";
import { MaintenanceAssignmentUi } from "@/features/maintenance/components/maintenance-assignment-ui";
import { MaintenanceStatusBadge } from "@/features/maintenance/components/maintenance-status-badge";
import { RepairActionList } from "@/features/maintenance/components/repair-action-list";
import { getMaintenanceWorkflowRoute } from "@/features/maintenance/lib/maintenance";
import type { MaintenanceRecord } from "@/features/maintenance/types/maintenance";

const PRIORITY_COLORS: Record<string, string> = {
  Critical: "#dc2626",
  High: "#d97706",
  Medium: "#145d66",
  Low: "#64748b",
};

export function MaintenanceDetailView({ item }: { item: MaintenanceRecord }) {
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
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-sm"
              style={{ backgroundColor: PRIORITY_COLORS[item.priority] ?? "#64748b" }}
            >
              {item.workOrder.slice(-2)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-stone-100">
                  {item.assetName}
                </h1>
                <MaintenanceStatusBadge status={item.status} />
              </div>
              <p className="mt-1 text-sm text-slate-500 dark:text-stone-400">
                {item.workOrder} · {item.requestTicket} · {item.site}
              </p>
            </div>
          </div>
          <Link
            href={getMaintenanceWorkflowRoute(item.id)}
            className="flex w-fit items-center gap-1.5 rounded-full bg-[#145d66] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0e4d55] dark:hover:bg-[#1a7a86]"
          >
            Open workflow
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {[
            { label: "Work Order", value: item.workOrder },
            { label: "Request Ticket", value: item.requestTicket },
            { label: "Site", value: item.site },
            { label: "Priority", value: item.priority },
          ].map((detail) => (
            <div
              key={detail.label}
              className="rounded-[20px] border border-slate-200 bg-white px-4 py-4 shadow-sm sm:rounded-[24px] sm:px-5 sm:py-5 dark:border-white/10 dark:bg-[#171815]"
            >
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-stone-500">{detail.label}</p>
              <p className="mt-1.5 text-lg font-bold text-slate-900 dark:text-stone-100">{detail.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 sm:mt-6 sm:gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <DiagnosisNotesPanel notes={item.diagnosisNotes} />
          <MaintenanceAssignmentUi maintenanceId={item.id} assignment={item.assignment} />
        </div>

        <div className="mt-4 pb-6 sm:mt-6 sm:pb-8">
          <RepairActionList actions={item.repairActions} />
        </div>
      </div>
    </div>
  );
}

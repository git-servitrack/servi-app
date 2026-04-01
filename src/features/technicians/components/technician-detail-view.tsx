"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

import { TechnicianFormModal } from "@/features/technicians/components/technician-form-modal";
import { TechnicianHistoryTable } from "@/features/technicians/components/technician-history-table";
import { TechnicianProfileCard } from "@/features/technicians/components/technician-profile-card";
import { TechnicianScorecardView } from "@/features/technicians/components/technician-scorecard-view";
import { TechnicianStatusBadge } from "@/features/technicians/components/technician-status-badge";
import { WorkloadSummarySection } from "@/features/technicians/components/workload-summary-section";
import { mapTechnicianToFormValues } from "@/features/technicians/lib/technicians";
import type { TechnicianRecord } from "@/features/technicians/types/technicians";

export function TechnicianDetailView({ technician }: { technician: TechnicianRecord }) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <Link
          href="/technicians"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-900 dark:text-stone-400 dark:hover:text-stone-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to technicians
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-stone-100">
              {technician.name}
            </h1>
            <TechnicianStatusBadge status={technician.status} />
          </div>
          <button
            onClick={() => setEditOpen(true)}
            className="flex w-fit items-center gap-1.5 rounded-full bg-[#145d66] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0e4d55] dark:hover:bg-[#1a7a86]"
          >
            Edit technician
          </button>
        </div>

        <div className="mt-6">
          <TechnicianProfileCard technician={technician} />
        </div>

        <div className="mt-4 grid gap-4 sm:mt-6 sm:gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <WorkloadSummarySection workload={technician.workload} />
          <TechnicianScorecardView scorecard={technician.scorecard} />
        </div>

        <div className="mt-4 pb-6 sm:mt-6 sm:pb-8">
          <TechnicianHistoryTable items={technician.history} />
        </div>
      </div>

      <TechnicianFormModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        mode="edit"
        values={mapTechnicianToFormValues(technician)}
        technicianId={technician.id}
      />
    </div>
  );
}

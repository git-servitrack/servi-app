"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, LoaderCircle } from "lucide-react";

import { ApiErrorAlert } from "@/components/feedback/api-error-alert";
import { TechnicianFormModal } from "@/features/technicians/components/technician-form-modal";
import { TechnicianHistoryTable } from "@/features/technicians/components/technician-history-table";
import { TechnicianProfileCard } from "@/features/technicians/components/technician-profile-card";
import { TechnicianScorecardView } from "@/features/technicians/components/technician-scorecard-view";
import { TechnicianStatusBadge } from "@/features/technicians/components/technician-status-badge";
import { WorkloadSummarySection } from "@/features/technicians/components/workload-summary-section";
import { mapTechnicianToFormValues } from "@/features/technicians/lib/technicians";
import type { TechnicianRecord } from "@/features/technicians/types/technicians";
import { techniciansService } from "@/services";
import type { ApiErrorShape } from "@/services/http/types";

export function TechnicianDetailView({ technicianId }: { technicianId: string }) {
  const [technician, setTechnician] = useState<TechnicianRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiErrorShape | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const loadTechnician = useCallback(async () => {
    const result = await techniciansService.getById(technicianId);

    if (result.error) {
      setError(result.error);
      setTechnician(null);
      return;
    }

    setError(null);
    setTechnician(result.data);
  }, [technicianId]);

  useEffect(() => {
    let active = true;

    async function loadInitialData() {
      await loadTechnician();

      if (active) {
        setIsLoading(false);
      }
    }

    void loadInitialData();

    return () => {
      active = false;
    };
  }, [loadTechnician]);

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

        {error ? <ApiErrorAlert message={error.message} /> : null}

        {isLoading ? (
          <div className="flex items-center justify-center gap-2 rounded-[20px] border border-slate-200 bg-white px-6 py-16 text-sm text-slate-500 shadow-sm dark:border-white/10 dark:bg-[#171815] dark:text-stone-400">
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Loading technician profile...
          </div>
        ) : null}

        {!isLoading && !technician ? (
          <div className="rounded-[20px] border border-slate-200 bg-white px-6 py-16 text-center shadow-sm dark:border-white/10 dark:bg-[#171815]">
            <p className="font-medium text-slate-900 dark:text-stone-100">Technician not found</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-stone-400">
              This account may have been removed or no longer has the technician role.
            </p>
          </div>
        ) : null}

        {technician ? (
          <>
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

            <TechnicianFormModal
              open={editOpen}
              onClose={() => setEditOpen(false)}
              mode="edit"
              values={mapTechnicianToFormValues(technician)}
              technicianId={technician.id}
              onSaved={loadTechnician}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}

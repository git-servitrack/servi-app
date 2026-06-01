"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, LoaderCircle } from "lucide-react";

import { ApiErrorAlert } from "@/components/feedback/api-error-alert";
import { ROUTES } from "@/constants/routes";
import { TechnicianForm } from "@/features/technicians/components/technician-form";
import { emptyTechnicianFormValues } from "@/features/technicians/data/technicians";
import { mapTechnicianToFormValues } from "@/features/technicians/lib/technicians";
import type { TechnicianFormValues } from "@/features/technicians/types/technicians";
import { techniciansService } from "@/services";
import type { ApiErrorShape } from "@/services/http/types";

interface TechnicianFormViewProps {
  mode: "create" | "edit";
  technicianId?: string;
}

export function TechnicianFormView({ mode, technicianId }: TechnicianFormViewProps) {
  const router = useRouter();
  const isEdit = mode === "edit";
  const [values, setValues] = useState<TechnicianFormValues>(emptyTechnicianFormValues);
  const [isLoading, setIsLoading] = useState(isEdit);
  const [error, setError] = useState<ApiErrorShape | null>(null);

  useEffect(() => {
    if (!isEdit || !technicianId) return;

    let active = true;
    const activeTechnicianId = technicianId;

    async function loadTechnician() {
      const result = await techniciansService.getById(activeTechnicianId);

      if (!active) return;

      if (result.error) {
        setError(result.error);
        setValues(emptyTechnicianFormValues);
      } else {
        setError(null);
        setValues(mapTechnicianToFormValues(result.data));
      }

      setIsLoading(false);
    }

    void loadTechnician();

    return () => {
      active = false;
    };
  }, [isEdit, technicianId]);

  function handleSuccess() {
    router.push(ROUTES.technicians);
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        <Link
          href={ROUTES.technicians}
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-900 dark:text-stone-400 dark:hover:text-stone-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to technicians
        </Link>

        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#145d66]">
            {isEdit ? "Edit technician" : "Create technician"}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-stone-100">
            {isEdit ? "Update technician access" : "Create technician access"}
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-stone-400">
            {isEdit
              ? "Update the technician user account and optional password reset."
              : "Provision a technician account through the same API user model as workspace access."}
          </p>
        </div>

        <div className="rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm sm:rounded-[24px] sm:p-8 dark:border-white/10 dark:bg-[#171815]">
          {error ? <ApiErrorAlert message={error.message} /> : null}
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 px-6 py-16 text-sm text-slate-500 dark:text-stone-400">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Loading technician account...
            </div>
          ) : (
            <TechnicianForm
              submitLabel={isEdit ? "Save changes" : "Create technician"}
              values={values}
              technicianId={technicianId}
              onSuccess={handleSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
}

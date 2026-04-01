import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ROUTES } from "@/constants/routes";
import { TechnicianForm } from "@/features/technicians/components/technician-form";
import type { TechnicianFormValues } from "@/features/technicians/types/technicians";

interface TechnicianFormViewProps {
  mode: "create" | "edit";
  values: TechnicianFormValues;
  technicianId?: string;
}

export function TechnicianFormView({ mode, values, technicianId }: TechnicianFormViewProps) {
  const isEdit = mode === "edit";

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
            {isEdit ? "Update technician profile" : "Create technician profile"}
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-stone-400">
            {isEdit
              ? "Maintain workforce profile, credentials, and scheduling data."
              : "Set up a technician profile structure for dispatch and identity data."}
          </p>
        </div>

        <div className="rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm sm:rounded-[24px] sm:p-8 dark:border-white/10 dark:bg-[#171815]">
          <TechnicianForm
            submitLabel={isEdit ? "Save changes" : "Create technician"}
            values={values}
            technicianId={technicianId}
          />
        </div>
      </div>
    </div>
  );
}

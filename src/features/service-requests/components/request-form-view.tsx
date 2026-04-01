import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ROUTES } from "@/constants/routes";
import { RequestForm } from "@/features/service-requests/components/request-form";
import type { ServiceRequestFormValues } from "@/features/service-requests/types/service-requests";

interface RequestFormViewProps {
  mode: "create" | "edit";
  values: ServiceRequestFormValues;
  requestId?: string;
}

export function RequestFormView({ mode, values, requestId }: RequestFormViewProps) {
  const isEdit = mode === "edit";

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        <Link
          href={ROUTES.serviceRequests}
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-900 dark:text-stone-400 dark:hover:text-stone-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to requests
        </Link>

        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#145d66]">
            {isEdit ? "Update request" : "Create request"}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-stone-100">
            {isEdit ? "Update service request" : "Create service request"}
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-stone-400">
            {isEdit
              ? "Adjust triage state, scheduling, and request context."
              : "Capture request context in a reusable structure for backend submission."}
          </p>
        </div>

        <div className="rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm sm:rounded-[24px] sm:p-8 dark:border-white/10 dark:bg-[#171815]">
          <RequestForm
            submitLabel={isEdit ? "Save update" : "Create request"}
            values={values}
            requestId={requestId}
          />
        </div>
      </div>
    </div>
  );
}

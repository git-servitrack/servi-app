"use client";

import { ArrowLeft, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { ApiErrorAlert } from "@/components/feedback/api-error-alert";
import { RequestFormModal } from "@/features/service-requests/components/request-form-modal";
import { RequestStatusBadge } from "@/features/service-requests/components/request-status-badge";
import { RequestTimeline } from "@/features/service-requests/components/request-timeline";
import { mapServiceRequestToFormValues } from "@/features/service-requests/lib/service-requests";
import type {
  ServiceRequestAssetOption,
  ServiceRequestRecord,
  ServiceRequestRequesterOption,
} from "@/features/service-requests/types/service-requests";
import { serviceRequestsService } from "@/services";
import type { ApiErrorShape } from "@/services/http/types";

const PRIORITY_COLORS: Record<string, string> = {
  Critical: "#dc2626",
  High: "#d97706",
  Medium: "#145d66",
  Low: "#64748b",
};

export function RequestDetailView({ requestId }: { requestId: string }) {
  const [request, setRequest] = useState<ServiceRequestRecord | null>(null);
  const [assets, setAssets] = useState<ServiceRequestAssetOption[]>([]);
  const [requesters, setRequesters] = useState<ServiceRequestRequesterOption[]>([]);
  const [error, setError] = useState<ApiErrorShape | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);

  const loadRequest = useCallback(async () => {
    const [requestResult, optionResult] = await Promise.all([
      serviceRequestsService.getById(requestId),
      serviceRequestsService.formOptions(),
    ]);

    if (requestResult.error) {
      setError(requestResult.error);
      setRequest(null);
    } else {
      setRequest(requestResult.data);
    }

    if (optionResult.error) {
      setError(optionResult.error);
      setAssets([]);
      setRequesters([]);
    } else {
      setAssets(optionResult.data.assets);
      setRequesters(optionResult.data.requesters);
    }

    if (!requestResult.error && !optionResult.error) {
      setError(null);
    }
  }, [requestId]);

  useEffect(() => {
    let active = true;

    async function loadInitialData() {
      await loadRequest();

      if (active) {
        setIsLoading(false);
      }
    }

    void loadInitialData();

    return () => {
      active = false;
    };
  }, [loadRequest]);

  async function handleSaved() {
    await loadRequest();
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-2 text-sm text-slate-500 dark:text-stone-400">
        <LoaderCircle className="h-4 w-4 animate-spin" />
        Loading service request...
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <ApiErrorAlert message={error?.message ?? "Service request could not be found."} />
        <Link
          href="/service-requests"
          className="mt-5 inline-flex text-sm font-medium text-[#145d66] hover:text-[#0e4d55]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to requests
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <Link
          href="/service-requests"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-900 dark:text-stone-400 dark:hover:text-stone-100"
        >
          Back to requests
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-sm"
              style={{ backgroundColor: PRIORITY_COLORS[request.priority] ?? "#64748b" }}
            >
              {request.ticketNumber.slice(-2)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-stone-100">
                  {request.title}
                </h1>
                <RequestStatusBadge status={request.status} />
              </div>
              <p className="mt-1 text-sm text-slate-500 dark:text-stone-400">
                {request.ticketNumber} - {request.requester} - {request.site}
              </p>
            </div>
          </div>
          <button
            onClick={() => setEditOpen(true)}
            className="flex w-fit items-center gap-1.5 rounded-full bg-[#145d66] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0e4d55] dark:hover:bg-[#1a7a86]"
          >
            Update request
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {[
            { label: "Ticket", value: request.ticketNumber },
            { label: "Priority", value: request.priority },
            { label: "Submitted", value: request.submittedAt },
            { label: "Scheduled", value: request.scheduledFor },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-[20px] border border-slate-200 bg-white px-4 py-4 shadow-sm sm:rounded-[24px] sm:px-5 sm:py-5 dark:border-white/10 dark:bg-[#171815]"
            >
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-stone-500">{item.label}</p>
              <p className="mt-1.5 text-lg font-bold text-slate-900 dark:text-stone-100">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 sm:mt-6">
          <div className="rounded-[20px] border border-slate-200 bg-white shadow-sm sm:rounded-[24px] dark:border-white/10 dark:bg-[#171815]">
            <div className="border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5 dark:border-white/8">
              <h2 className="text-base font-semibold text-slate-900 dark:text-stone-100">Request summary</h2>
              <p className="mt-0.5 text-sm text-slate-400 dark:text-stone-500">Core issue details and service context</p>
            </div>
            <div className="grid gap-px bg-slate-100 sm:grid-cols-2 dark:bg-white/6">
              {[
                { label: "Category", value: request.category },
                { label: "Related Asset", value: request.assetName },
                { label: "Submitted At", value: request.submittedAt },
                { label: "Scheduled For", value: request.scheduledFor },
              ].map((item) => (
                <div key={item.label} className="bg-white px-4 py-4 sm:px-6 sm:py-5 dark:bg-[#171815]">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-stone-500">{item.label}</p>
                  <p className="mt-1.5 text-sm font-medium text-slate-900 dark:text-stone-100">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 px-4 py-4 sm:px-6 sm:py-5 dark:border-white/8">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-stone-500">Summary</p>
              <p className="mt-1.5 text-sm leading-6 text-slate-700 dark:text-stone-300">{request.summary}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 pb-6 sm:mt-6 sm:pb-8">
          <RequestTimeline events={request.timeline} />
        </div>
      </div>

      <RequestFormModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        mode="edit"
        values={mapServiceRequestToFormValues(request)}
        requestId={request.id}
        assets={assets}
        requesters={requesters}
        onSaved={handleSaved}
      />
    </div>
  );
}

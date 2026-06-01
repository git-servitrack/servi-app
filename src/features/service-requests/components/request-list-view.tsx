"use client";

import { LoaderCircle, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { sileo } from "sileo";

import { ApiErrorAlert } from "@/components/feedback/api-error-alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RequestFilters } from "@/features/service-requests/components/request-filters";
import { RequestFormModal } from "@/features/service-requests/components/request-form-modal";
import { RequestTable } from "@/features/service-requests/components/request-table";
import {
  defaultRequestFilters,
  emptyServiceRequestFormValues,
  requestFilterOptions,
} from "@/features/service-requests/data/service-requests";
import { filterServiceRequests, mapServiceRequestToFormValues } from "@/features/service-requests/lib/service-requests";
import type {
  RequestFilterState,
  ServiceRequestAssetOption,
  ServiceRequestFormValues,
  ServiceRequestRecord,
  ServiceRequestRequesterOption,
} from "@/features/service-requests/types/service-requests";
import { serviceRequestsService } from "@/services";
import type { ApiErrorShape } from "@/services/http/types";

function buildEmptyRequestValues(
  assets: ServiceRequestAssetOption[],
  requesters: ServiceRequestRequesterOption[],
): ServiceRequestFormValues {
  const firstAsset = assets[0];

  return {
    ...emptyServiceRequestFormValues,
    requester: requesters[0]?.id ?? "",
    asset: firstAsset?.id ?? "",
    site: firstAsset?.site ?? emptyServiceRequestFormValues.site,
  };
}

export function RequestListView() {
  const [requests, setRequests] = useState<ServiceRequestRecord[]>([]);
  const [assets, setAssets] = useState<ServiceRequestAssetOption[]>([]);
  const [requesters, setRequesters] = useState<ServiceRequestRequesterOption[]>([]);
  const [filters, setFilters] = useState<RequestFilterState>(defaultRequestFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiErrorShape | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [modalValues, setModalValues] = useState<ServiceRequestFormValues>(emptyServiceRequestFormValues);
  const [modalRequestId, setModalRequestId] = useState<string | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<ServiceRequestRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredRequests = useMemo(() => filterServiceRequests(requests, filters), [filters, requests]);
  const siteOptions = useMemo(
    () => ["All", ...Array.from(new Set(requests.map((request) => request.site))).sort()],
    [requests],
  );
  const statItems = useMemo(
    () => [
      {
        label: "Open",
        value: requests.filter((r) => r.status !== "Resolved" && r.status !== "Closed").length.toString(),
        color: "#145d66",
      },
      {
        label: "Critical",
        value: requests.filter((r) => r.priority === "Critical").length.toString(),
        color: "#dc2626",
      },
      {
        label: "Scheduled",
        value: requests.filter((r) => r.status === "Scheduled").length.toString(),
        color: "#7c3aed",
      },
      {
        label: "Total",
        value: requests.length.toString(),
        color: "#1e293b",
      },
    ],
    [requests],
  );

  async function loadRequests() {
    const [requestResult, optionResult] = await Promise.all([
      serviceRequestsService.list(),
      serviceRequestsService.formOptions(),
    ]);

    if (requestResult.error) {
      setError(requestResult.error);
      setRequests([]);
    } else {
      setRequests(requestResult.data);
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
  }

  useEffect(() => {
    let active = true;

    async function loadInitialData() {
      await loadRequests();

      if (active) {
        setIsLoading(false);
      }
    }

    void loadInitialData();

    return () => {
      active = false;
    };
  }, []);

  function handleCreate() {
    setModalMode("create");
    setModalValues(buildEmptyRequestValues(assets, requesters));
    setModalRequestId(undefined);
    setModalOpen(true);
  }

  function handleEdit(requestId: string) {
    const request = requests.find((r) => r.id === requestId);
    if (!request) return;

    setModalMode("edit");
    setModalValues(mapServiceRequestToFormValues(request));
    setModalRequestId(request.id);
    setModalOpen(true);
  }

  function handleDelete(requestId: string) {
    const request = requests.find((item) => item.id === requestId);
    if (!request) return;

    setDeleteTarget(request);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    setIsDeleting(true);

    const deletedRequest = await sileo
      .promise(
        async () => {
          const result = await serviceRequestsService.delete(deleteTarget.id);

          if (result.error) {
            throw result.error;
          }

          return result.data;
        },
        {
          loading: {
            title: "Deleting request...",
            description: `Removing ${deleteTarget.ticketNumber} from the queue.`,
          },
          success: {
            title: "Request deleted",
            description: `${deleteTarget.ticketNumber} was removed successfully.`,
          },
          error: (errorValue) => ({
            title: "Delete failed",
            description:
              typeof errorValue === "object" && errorValue !== null && "message" in errorValue
                ? String((errorValue as { message?: unknown }).message)
                : "The service request could not be deleted.",
          }),
        },
      )
      .catch((errorValue: ApiErrorShape) => {
        setError(errorValue);
        return null;
      });

    setIsDeleting(false);

    if (!deletedRequest) return;

    setRequests((current) => current.filter((request) => request.id !== deleteTarget.id));
    setError(null);
    setDeleteTarget(null);
  }

  async function handleModalSaved() {
    await loadRequests();
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-stone-100">
              Service Requests
            </h1>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-stone-400">
              Manage intake, triage, scheduling, and follow-up across operational sites.
            </p>
          </div>
          <button
            onClick={handleCreate}
            disabled={assets.length === 0 || requesters.length === 0}
            className="flex w-fit items-center gap-1.5 rounded-full bg-[#145d66] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0e4d55] disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-[#1a7a86]"
          >
            <Plus className="h-4 w-4" />
            Create request
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {statItems.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[20px] border border-slate-200 bg-white px-4 py-4 shadow-sm sm:rounded-[24px] sm:px-5 sm:py-5 dark:border-white/10 dark:bg-[#171815]"
            >
              <p className="text-sm font-medium text-slate-500 dark:text-stone-400">{stat.label}</p>
              <p className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:mt-4 sm:text-5xl dark:text-stone-100">
                {stat.value}
              </p>
              <div className="mt-3 h-1.5 w-12 rounded-full sm:mt-4" style={{ backgroundColor: stat.color, opacity: 0.5 }} />
            </div>
          ))}
        </div>

        <div className="mt-4 sm:mt-6">
          <RequestFilters
            filters={filters}
            statuses={requestFilterOptions.statuses}
            priorities={requestFilterOptions.priorities}
            sites={siteOptions}
            onChange={setFilters}
          />
        </div>

        <div className="mt-4 space-y-3 sm:mt-6">
          {error ? <ApiErrorAlert message={error.message} /> : null}
          {!isLoading && assets.length === 0 ? (
            <ApiErrorAlert message="Create at least one asset before opening service requests." />
          ) : null}
          {!isLoading && requesters.length === 0 ? (
            <ApiErrorAlert message="Create at least one user before opening service requests." />
          ) : null}
        </div>

        <div className="mt-4 sm:mt-6">
          <div className="rounded-[20px] border border-slate-200 bg-white shadow-sm sm:rounded-[24px] dark:border-white/10 dark:bg-[#171815]">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5 dark:border-white/8">
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-stone-100">
                  Request queue
                </h2>
                <p className="mt-0.5 text-sm text-slate-400 dark:text-stone-500">
                  {filteredRequests.length} requests matching current filters
                </p>
              </div>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 px-6 py-16 text-sm text-slate-500 dark:text-stone-400">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Loading service requests...
              </div>
            ) : (
              <RequestTable requests={filteredRequests} onEdit={handleEdit} onDelete={handleDelete} />
            )}
          </div>
        </div>
      </div>

      <RequestFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        values={modalValues}
        requestId={modalRequestId}
        assets={assets}
        requesters={requesters}
        onSaved={handleModalSaved}
      />

      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setDeleteTarget(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete service request?</DialogTitle>
            <DialogDescription>
              {deleteTarget
                ? `This will remove ${deleteTarget.ticketNumber} from the service request queue. This action cannot be undone.`
                : "This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting}
              className="flex h-11 items-center justify-center rounded-full border border-slate-200 px-5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-50 dark:border-white/10 dark:text-stone-300 dark:hover:bg-white/6"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="flex h-11 items-center justify-center gap-2 rounded-full bg-rose-500 px-5 text-sm font-semibold text-white transition-colors hover:bg-rose-600 disabled:pointer-events-none disabled:opacity-50"
            >
              {isDeleting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
              {isDeleting ? "Deleting..." : "Delete request"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

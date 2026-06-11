"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { TablePagination } from "@/components/shared/table-pagination";
import { RequestStatusBadge } from "@/features/service-requests/components/request-status-badge";
import { getServiceRequestDetailRoute } from "@/features/service-requests/lib/service-requests";
import type { ServiceRequestRecord } from "@/features/service-requests/types/service-requests";

const PAGE_SIZE = 10;

const PRIORITY_COLORS: Record<string, string> = {
  Critical: "#dc2626",
  High: "#d97706",
  Medium: "#145d66",
  Low: "#64748b",
};

interface RequestTableProps {
  requests: ServiceRequestRecord[];
  onEdit?: (requestId: string) => void;
  onDelete?: (requestId: string) => void;
}

export function RequestTable({ requests, onEdit, onDelete }: RequestTableProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(requests.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;

    return requests.slice(start, start + PAGE_SIZE);
  }, [requests, currentPage]);

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
        <p className="font-medium text-slate-900 dark:text-stone-100">No requests found</p>
        <p className="text-sm text-slate-400 dark:text-stone-500">
          Try a broader filter or create a new service request.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="divide-y divide-slate-100 dark:divide-white/6">
        {paginatedRequests.map((request) => (
          <div
            key={request.id}
            className="grid items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50/50 sm:grid-cols-[auto_minmax(0,1fr)_140px_auto] sm:gap-4 sm:px-6 sm:py-4 dark:hover:bg-white/3"
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
              style={{ backgroundColor: PRIORITY_COLORS[request.priority] ?? "#64748b" }}
            >
              {request.ticketNumber.slice(-2)}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-stone-100">
                {request.title}
              </p>
              <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-stone-400">
                <span className="font-medium text-[#145d66] dark:text-[#86d0d8]">{request.ticketNumber}</span>
                {" - "}
                {request.requester} - {request.site} - {request.priority}
              </p>
            </div>

            <div className="flex justify-start sm:justify-center">
              <RequestStatusBadge status={request.status} />
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Link
                href={getServiceRequestDetailRoute(request.id)}
                className="rounded-full border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:text-stone-300 dark:hover:bg-white/6"
              >
                View
              </Link>
              <button
                onClick={() => onDelete?.(request.id)}
                className="rounded-full border border-slate-200 px-4 py-2 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50 dark:border-white/10 dark:text-rose-300 dark:hover:bg-rose-500/10"
              >
                Delete
              </button>
              <button
                onClick={() => onEdit?.(request.id)}
                className="rounded-full bg-[#145d66] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[#0e4d55]"
              >
                Update
              </button>
            </div>
          </div>
        ))}
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={requests.length}
        pageSize={PAGE_SIZE}
        itemLabel="requests"
        onPageChange={setPage}
      />
    </>
  );
}

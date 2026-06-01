import { ROUTES } from "@/constants/routes";
import type {
  RequestFilterState,
  ServiceRequestFormValues,
  ServiceRequestRecord,
} from "@/features/service-requests/types/service-requests";

export function getServiceRequestById(requestId: string, requests: ServiceRequestRecord[]) {
  return requests.find((request) => request.id === requestId);
}

export function filterServiceRequests(requests: ServiceRequestRecord[], filters: RequestFilterState) {
  return requests.filter((request) => {
    const matchesQuery =
      filters.query.length === 0 ||
      [request.title, request.ticketNumber, request.site, request.requester, request.assetName]
        .join(" ")
        .toLowerCase()
        .includes(filters.query.toLowerCase());

    const matchesStatus = filters.status === "All" || request.status === filters.status;
    const matchesPriority = filters.priority === "All" || request.priority === filters.priority;
    const matchesSite = filters.site === "All" || request.site === filters.site;

    return matchesQuery && matchesStatus && matchesPriority && matchesSite;
  });
}

export function getServiceRequestDetailRoute(requestId: string) {
  return `${ROUTES.serviceRequests}/${requestId}`;
}

export function getServiceRequestEditRoute(requestId: string) {
  return `${ROUTES.serviceRequests}/${requestId}/edit`;
}

export function mapServiceRequestToFormValues(request: ServiceRequestRecord): ServiceRequestFormValues {
  return {
    title: request.title,
    requester: request.requesterId,
    site: request.site,
    asset: request.assetId,
    status: request.status,
    priority: request.priority,
    scheduledFor: request.scheduledFor.includes("Pending") || request.scheduledFor === "Unassigned" ? "" : request.scheduledFor,
    summary: request.summary,
  };
}

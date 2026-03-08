import { notFound } from "next/navigation";

import { RequestFormView } from "@/features/service-requests/components/request-form-view";
import { serviceRequestRecords } from "@/features/service-requests/data/service-requests";
import { getServiceRequestById, mapServiceRequestToFormValues } from "@/features/service-requests/lib/service-requests";

export default async function ServiceRequestEditPage({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;
  const request = getServiceRequestById(requestId, serviceRequestRecords);

  if (!request) {
    notFound();
  }

  return <RequestFormView mode="edit" values={mapServiceRequestToFormValues(request)} />;
}

import { notFound } from "next/navigation";

import { RequestDetailView } from "@/features/service-requests/components/request-detail-view";
import { serviceRequestRecords } from "@/features/service-requests/data/service-requests";
import { getServiceRequestById } from "@/features/service-requests/lib/service-requests";

export default async function ServiceRequestDetailPage({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;
  const request = getServiceRequestById(requestId, serviceRequestRecords);

  if (!request) {
    notFound();
  }

  return <RequestDetailView request={request} />;
}

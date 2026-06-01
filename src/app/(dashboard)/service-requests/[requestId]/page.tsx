import { RequestDetailView } from "@/features/service-requests/components/request-detail-view";

export default async function ServiceRequestDetailPage({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;

  return <RequestDetailView requestId={requestId} />;
}

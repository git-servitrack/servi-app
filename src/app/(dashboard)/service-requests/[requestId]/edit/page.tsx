import { RequestFormPageView } from "@/features/service-requests/components/request-form-page-view";

export default async function ServiceRequestEditPage({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;

  return <RequestFormPageView mode="edit" requestId={requestId} />;
}

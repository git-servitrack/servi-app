import { SparePartDetailView } from "@/features/spare-parts/components/spare-part-detail-view";

export default async function SparePartDetailPage({
  params,
}: {
  params: Promise<{ partId: string }>;
}) {
  const { partId } = await params;

  return <SparePartDetailView partId={partId} />;
}

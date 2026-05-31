import { AssetDetailView } from "@/features/assets/components/asset-detail-view";

export default async function AssetDetailPage({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const { assetId } = await params;

  return <AssetDetailView assetId={assetId} />;
}

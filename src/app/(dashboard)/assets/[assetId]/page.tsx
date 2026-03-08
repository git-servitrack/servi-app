import { notFound } from "next/navigation";

import { AssetDetailView } from "@/features/assets/components/asset-detail-view";
import { assetRecords } from "@/features/assets/data/assets";
import { getAssetById } from "@/features/assets/lib/assets";

export default async function AssetDetailPage({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const { assetId } = await params;
  const asset = getAssetById(assetId, assetRecords);

  if (!asset) {
    notFound();
  }

  return <AssetDetailView asset={asset} />;
}

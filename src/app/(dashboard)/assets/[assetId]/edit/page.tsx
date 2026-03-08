import { notFound } from "next/navigation";

import { AssetFormView } from "@/features/assets/components/asset-form-view";
import { assetRecords } from "@/features/assets/data/assets";
import { getAssetById, mapAssetToFormValues } from "@/features/assets/lib/assets";

export default async function AssetEditPage({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const { assetId } = await params;
  const asset = getAssetById(assetId, assetRecords);

  if (!asset) {
    notFound();
  }

  return <AssetFormView mode="edit" values={mapAssetToFormValues(asset)} assetId={asset.id} />;
}

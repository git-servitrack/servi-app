import { AssetFormPageView } from "@/features/assets/components/asset-form-page-view";

export default async function AssetEditPage({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const { assetId } = await params;

  return <AssetFormPageView mode="edit" assetId={assetId} />;
}

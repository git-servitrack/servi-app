import { AssetFormView } from "@/features/assets/components/asset-form-view";
import { emptyAssetFormValues } from "@/features/assets/data/assets";

export default function AssetCreatePage() {
  return <AssetFormView mode="create" values={emptyAssetFormValues} />;
}

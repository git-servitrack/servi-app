import { ROUTES } from "@/constants/routes";
import type { AssetFilterState, AssetFormValues, AssetRecord } from "@/features/assets/types/assets";

export function getAssetById(assetId: string, assets: AssetRecord[]) {
  return assets.find((asset) => asset.id === assetId);
}

export function filterAssets(assets: AssetRecord[], filters: AssetFilterState) {
  return assets.filter((asset) => {
    const matchesQuery =
      filters.query.length === 0 ||
      [
        asset.name,
        asset.code,
        asset.site,
        asset.category,
        asset.assetType,
        asset.manufacturer,
        asset.model,
        asset.serialNumber,
        asset.supplier,
        asset.unitOfMeasure,
      ]
        .join(" ")
        .toLowerCase()
        .includes(filters.query.toLowerCase());

    const matchesCategory = filters.category === "All" || asset.category === filters.category;
    const matchesSite = filters.site === "All" || asset.site === filters.site;
    const matchesStatus = filters.status === "All" || asset.status === filters.status;

    return matchesQuery && matchesCategory && matchesSite && matchesStatus;
  });
}

export function getAssetDetailRoute(assetId: string) {
  return `${ROUTES.assets}/${assetId}`;
}

export function getAssetEditRoute(assetId: string) {
  return `${ROUTES.assets}/${assetId}/edit`;
}

export function mapAssetToFormValues(asset: AssetRecord): AssetFormValues {
  return {
    name: asset.name,
    code: asset.code,
    category: asset.categoryId,
    assetType: asset.assetType ?? "",
    site: asset.site,
    assignedTeam: asset.assignedTeam,
    status: asset.status,
    criticality: asset.criticality,
    condition: asset.condition,
    manufacturer: asset.manufacturer,
    model: asset.model,
    serialNumber: asset.serialNumber,
    quantity: asset.quantity?.toString() ?? "",
    unitOfMeasure: asset.unitOfMeasure ?? "",
    supplier: asset.supplier ?? "",
    acquisitionDate: asset.acquisitionDate === "N/A" ? "" : asset.acquisitionDate ?? "",
    lastServiceDate: asset.lastServiceDate === "N/A" ? "" : asset.lastServiceDate,
    nextServiceDate: asset.nextServiceDate === "N/A" ? "" : asset.nextServiceDate,
    notes: asset.notes,
  };
}

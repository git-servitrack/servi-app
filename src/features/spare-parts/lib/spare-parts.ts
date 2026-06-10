import { ROUTES } from "@/constants/routes";
import type { SparePartFormValues, SparePartRecord } from "@/features/spare-parts/types/spare-parts";

export function getSparePartById(partId: string, parts: SparePartRecord[]) {
  return parts.find((part) => part.id === partId);
}

export function getSparePartDetailRoute(partId: string) {
  return `${ROUTES.spareParts}/${partId}`;
}

export function getSparePartEditRoute(partId: string) {
  return `${ROUTES.spareParts}/${partId}/edit`;
}

export function mapSparePartToFormValues(part: SparePartRecord): SparePartFormValues {
  return {
    partNumber: part.partNumber,
    name: part.name,
    category: part.categoryId,
    site: part.site,
    compatibleAssets: part.compatibleAssetIds,
    unit: part.unit,
    stockOnHand: part.stockOnHand.toString(),
    reservedStock: part.reservedStock.toString(),
    reorderPoint: part.reorderPoint.toString(),
    binLocation: part.binLocation,
    supplier: part.supplier,
    notes: part.notes,
  };
}

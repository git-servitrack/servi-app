import { notFound } from "next/navigation";

import { SparePartFormView } from "@/features/spare-parts/components/spare-part-form-view";
import { sparePartRecords } from "@/features/spare-parts/data/spare-parts";
import { getSparePartById, mapSparePartToFormValues } from "@/features/spare-parts/lib/spare-parts";

export default async function SparePartEditPage({
  params,
}: {
  params: Promise<{ partId: string }>;
}) {
  const { partId } = await params;
  const part = getSparePartById(partId, sparePartRecords);

  if (!part) {
    notFound();
  }

  return <SparePartFormView mode="edit" values={mapSparePartToFormValues(part)} />;
}

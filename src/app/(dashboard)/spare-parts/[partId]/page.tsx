import { notFound } from "next/navigation";

import { SparePartDetailView } from "@/features/spare-parts/components/spare-part-detail-view";
import { sparePartRecords } from "@/features/spare-parts/data/spare-parts";
import { getSparePartById } from "@/features/spare-parts/lib/spare-parts";

export default async function SparePartDetailPage({
  params,
}: {
  params: Promise<{ partId: string }>;
}) {
  const { partId } = await params;
  const part = getSparePartById(partId, sparePartRecords);

  if (!part) {
    notFound();
  }

  return <SparePartDetailView part={part} />;
}

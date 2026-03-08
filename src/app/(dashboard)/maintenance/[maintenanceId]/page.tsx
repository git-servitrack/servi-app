import { notFound } from "next/navigation";

import { MaintenanceDetailView } from "@/features/maintenance/components/maintenance-detail-view";
import { maintenanceRecords } from "@/features/maintenance/data/maintenance";
import { getMaintenanceById } from "@/features/maintenance/lib/maintenance";

export default async function MaintenanceDetailPage({
  params,
}: {
  params: Promise<{ maintenanceId: string }>;
}) {
  const { maintenanceId } = await params;
  const item = getMaintenanceById(maintenanceId, maintenanceRecords);

  if (!item) {
    notFound();
  }

  return <MaintenanceDetailView item={item} />;
}

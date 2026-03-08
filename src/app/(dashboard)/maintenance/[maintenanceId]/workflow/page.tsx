import { notFound } from "next/navigation";

import { MaintenanceWorkflowView } from "@/features/maintenance/components/maintenance-workflow-view";
import { maintenanceRecords } from "@/features/maintenance/data/maintenance";
import { getMaintenanceById } from "@/features/maintenance/lib/maintenance";

export default async function MaintenanceWorkflowPage({
  params,
}: {
  params: Promise<{ maintenanceId: string }>;
}) {
  const { maintenanceId } = await params;
  const item = getMaintenanceById(maintenanceId, maintenanceRecords);

  if (!item) {
    notFound();
  }

  return <MaintenanceWorkflowView item={item} />;
}

import { MaintenanceWorkflowView } from "@/features/maintenance/components/maintenance-workflow-view";

export default async function MaintenanceWorkflowPage({
  params,
}: {
  params: Promise<{ maintenanceId: string }>;
}) {
  const { maintenanceId } = await params;

  return <MaintenanceWorkflowView maintenanceId={maintenanceId} />;
}

import { MaintenanceDetailView } from "@/features/maintenance/components/maintenance-detail-view";

export default async function MaintenanceDetailPage({
  params,
}: {
  params: Promise<{ maintenanceId: string }>;
}) {
  const { maintenanceId } = await params;

  return <MaintenanceDetailView maintenanceId={maintenanceId} />;
}

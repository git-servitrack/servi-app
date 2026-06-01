import { TechnicianDetailView } from "@/features/technicians/components/technician-detail-view";

export default async function TechnicianDetailPage({
  params,
}: {
  params: Promise<{ technicianId: string }>;
}) {
  const { technicianId } = await params;

  return <TechnicianDetailView technicianId={technicianId} />;
}

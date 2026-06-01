import { TechnicianFormView } from "@/features/technicians/components/technician-form-view";

export default async function TechnicianEditPage({
  params,
}: {
  params: Promise<{ technicianId: string }>;
}) {
  const { technicianId } = await params;

  return <TechnicianFormView mode="edit" technicianId={technicianId} />;
}

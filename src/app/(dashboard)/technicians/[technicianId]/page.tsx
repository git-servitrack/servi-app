import { notFound } from "next/navigation";

import { TechnicianDetailView } from "@/features/technicians/components/technician-detail-view";
import { technicianRecords } from "@/features/technicians/data/technicians";
import { getTechnicianById } from "@/features/technicians/lib/technicians";

export default async function TechnicianDetailPage({
  params,
}: {
  params: Promise<{ technicianId: string }>;
}) {
  const { technicianId } = await params;
  const technician = getTechnicianById(technicianId, technicianRecords);

  if (!technician) {
    notFound();
  }

  return <TechnicianDetailView technician={technician} />;
}

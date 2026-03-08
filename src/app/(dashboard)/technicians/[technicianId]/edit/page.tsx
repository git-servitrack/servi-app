import { notFound } from "next/navigation";

import { TechnicianFormView } from "@/features/technicians/components/technician-form-view";
import { technicianRecords } from "@/features/technicians/data/technicians";
import { getTechnicianById, mapTechnicianToFormValues } from "@/features/technicians/lib/technicians";

export default async function TechnicianEditPage({
  params,
}: {
  params: Promise<{ technicianId: string }>;
}) {
  const { technicianId } = await params;
  const technician = getTechnicianById(technicianId, technicianRecords);

  if (!technician) {
    notFound();
  }

  return <TechnicianFormView mode="edit" values={mapTechnicianToFormValues(technician)} />;
}

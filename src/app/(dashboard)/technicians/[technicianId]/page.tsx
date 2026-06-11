import { redirect } from "next/navigation";

export default async function TechnicianDetailPage({
  params,
}: {
  params: Promise<{ technicianId: string }>;
}) {
  const { technicianId } = await params;

  redirect(`/settings/technicians/${technicianId}`);
}

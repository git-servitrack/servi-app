import { SparePartFormView } from "@/features/spare-parts/components/spare-part-form-view";

export default async function SparePartEditPage({
  params,
}: {
  params: Promise<{ partId: string }>;
}) {
  const { partId } = await params;

  return <SparePartFormView mode="edit" partId={partId} />;
}

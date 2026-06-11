import { redirect } from "next/navigation";

interface UserManagementEditPageProps {
  params: Promise<{ userId: string }>;
}

export default async function UserManagementEditPage({ params }: UserManagementEditPageProps) {
  const { userId } = await params;

  redirect(`/settings/user-management/${userId}/edit`);
}

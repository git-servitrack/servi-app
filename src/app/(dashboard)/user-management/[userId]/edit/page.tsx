import { UserEditView } from "@/features/user-management/components/user-edit-view";
import { UserManagementAccessGate } from "@/features/user-management/components/user-management-access-gate";

interface UserManagementEditPageProps {
  params: Promise<{ userId: string }>;
}

export default async function UserManagementEditPage({ params }: UserManagementEditPageProps) {
  const { userId } = await params;

  return (
    <UserManagementAccessGate>
      <UserEditView userId={userId} />
    </UserManagementAccessGate>
  );
}

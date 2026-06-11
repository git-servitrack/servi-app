import { UserEditView } from "@/features/user-management/components/user-edit-view";
import { UserManagementAccessGate } from "@/features/user-management/components/user-management-access-gate";

interface SettingsUserManagementEditPageProps {
  params: Promise<{ userId: string }>;
}

export default async function SettingsUserManagementEditPage({
  params,
}: SettingsUserManagementEditPageProps) {
  const { userId } = await params;

  return (
    <UserManagementAccessGate>
      <UserEditView userId={userId} />
    </UserManagementAccessGate>
  );
}

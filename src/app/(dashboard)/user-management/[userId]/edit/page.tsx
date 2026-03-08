import { notFound } from "next/navigation";

import { getUserRecord } from "@/features/user-management/lib/user-management";
import { UserFormView } from "@/features/user-management/components/user-form-view";

interface UserManagementEditPageProps {
  params: Promise<{ userId: string }>;
}

export default async function UserManagementEditPage({ params }: UserManagementEditPageProps) {
  const { userId } = await params;
  const user = getUserRecord(userId);

  if (!user) {
    notFound();
  }

  return (
    <UserFormView
      mode="edit"
      userId={user.id}
      values={{
        fullName: user.fullName,
        email: user.email,
        password: "temporary123",
        confirmPassword: "temporary123",
        department: user.department,
        roleId: user.roleId,
        status: user.status,
      }}
    />
  );
}

import { UserManagementAccessGate } from "@/features/user-management/components/user-management-access-gate";
import { UserManagementListView } from "@/features/user-management/components/user-management-list-view";

export default function UserManagementPage() {
  return (
    <UserManagementAccessGate>
      <UserManagementListView />
    </UserManagementAccessGate>
  );
}

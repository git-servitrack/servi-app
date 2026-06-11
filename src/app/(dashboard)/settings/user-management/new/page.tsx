import { UserManagementAccessGate } from "@/features/user-management/components/user-management-access-gate";
import { UserFormView } from "@/features/user-management/components/user-form-view";
import { defaultUserFormValues } from "@/features/user-management/data/user-management";

export default function SettingsUserManagementCreatePage() {
  return (
    <UserManagementAccessGate>
      <UserFormView mode="create" values={defaultUserFormValues} />
    </UserManagementAccessGate>
  );
}

import { defaultUserFormValues } from "@/features/user-management/data/user-management";
import { UserManagementAccessGate } from "@/features/user-management/components/user-management-access-gate";
import { UserFormView } from "@/features/user-management/components/user-form-view";

export default function UserManagementCreatePage() {
  return (
    <UserManagementAccessGate>
      <UserFormView mode="create" values={defaultUserFormValues} />
    </UserManagementAccessGate>
  );
}

import { defaultUserFormValues } from "@/features/user-management/data/user-management";
import { UserFormView } from "@/features/user-management/components/user-form-view";

export default function UserManagementCreatePage() {
  return <UserFormView mode="create" values={defaultUserFormValues} />;
}

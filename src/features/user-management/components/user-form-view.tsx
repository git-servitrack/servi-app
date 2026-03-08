import { FormPageLayout } from "@/components/shared/form-page-layout";
import { ROUTES } from "@/constants/routes";
import { UserForm } from "@/features/user-management/components/user-form";
import type { UserManagementFormValues } from "@/features/user-management/types/user-management";

interface UserFormViewProps {
  mode: "create" | "edit";
  values: UserManagementFormValues;
  userId?: string;
}

export function UserFormView({ mode, values, userId }: UserFormViewProps) {
  const isEdit = mode === "edit";

  return (
    <FormPageLayout
      eyebrow={isEdit ? "Edit User" : "Create User"}
      title={isEdit ? "Update user access" : "Provision workspace user"}
      description={
        isEdit
          ? "Adjust account status, role assignment, and provisioning details using the shared admin form."
          : "Create user accounts inside the dashboard instead of exposing a public self-service sign-up flow."
      }
      flowLabel={isEdit ? "Admin edit" : "Admin create"}
      backHref={ROUTES.userManagement}
      backLabel="Back to users"
      formTitle="User provisioning form"
      formDescription="Account creation and access edits share one form contract so admin provisioning stays consistent."
      formContent={
        <UserForm
          title={isEdit ? "Edit user account" : "New user account"}
          description="The form captures identity, role assignment, temporary password, and account state in one controlled admin flow."
          submitLabel={isEdit ? "Save user changes" : "Create user account"}
          values={values}
          userId={userId}
        />
      }
      guidanceTitle="Provisioning notes"
      guidanceDescription="Keep access control centralized and explicit as backend auth matures."
      guidanceEyebrow="Admin-only direction"
      guidanceCardTitle="User management guidance"
      guidanceContent={
        <>
          <p>Public self-service registration is intentionally removed. This dashboard module becomes the single UI for workspace account provisioning.</p>
          <p>Restrict access server-side to Admin / System Operator sessions once route protection and session claims are available.</p>
          <p>Track invitation state, role changes, and suspensions as audit events when the backend auth provider is integrated.</p>
        </>
      }
    />
  );
}

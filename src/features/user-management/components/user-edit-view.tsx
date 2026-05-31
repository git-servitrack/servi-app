"use client";

import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";

import { ApiErrorAlert } from "@/components/feedback/api-error-alert";
import { ROUTES } from "@/constants/routes";
import { UserFormView } from "@/features/user-management/components/user-form-view";
import type { UserManagementFormValues, UserManagementRecord } from "@/features/user-management/types/user-management";
import { userManagementService } from "@/services";
import type { ApiErrorShape } from "@/services/http/types";

interface UserEditViewProps {
  userId: string;
}

function mapUserToFormValues(user: UserManagementRecord): UserManagementFormValues {
  return {
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    middleName: user.middleName,
    email: user.email,
    password: "temporary123",
    confirmPassword: "temporary123",
    roleId: user.roleId,
  };
}

export function UserEditView({ userId }: UserEditViewProps) {
  const [values, setValues] = useState<UserManagementFormValues | null>(null);
  const [error, setError] = useState<ApiErrorShape | null>(null);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      const result = await userManagementService.getById(userId);

      if (!active) return;

      if (result.error) {
        setError(result.error);
        setValues(null);
        return;
      }

      setError(null);
      setValues(mapUserToFormValues(result.data));
    }

    void loadUser();

    return () => {
      active = false;
    };
  }, [userId]);

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <ApiErrorAlert message={error.message} />
        <Link
          href={ROUTES.userManagement}
          className="mt-5 inline-flex text-sm font-medium text-[#145d66] hover:text-[#0e4d55]"
        >
          Back to users
        </Link>
      </div>
    );
  }

  if (!values) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-2 text-sm text-slate-500 dark:text-stone-400">
        <LoaderCircle className="h-4 w-4 animate-spin" />
        Loading user account...
      </div>
    );
  }

  return <UserFormView mode="edit" userId={userId} values={values} />;
}

"use client";

import { useEffect, useState, type ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";

import { ApiErrorAlert } from "@/components/feedback/api-error-alert";
import { ROUTES } from "@/constants/routes";
import { authService } from "@/services";
import type { ApiErrorShape } from "@/services/http/types";

interface UserManagementAccessGateProps {
  children: ReactNode;
}

export function UserManagementAccessGate({ children }: UserManagementAccessGateProps) {
  const [isAllowed, setIsAllowed] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<ApiErrorShape | null>(null);

  useEffect(() => {
    let active = true;

    async function checkAccess() {
      const result = await authService.getCurrentUser();

      if (!active) return;

      if (result.error) {
        setError(result.error);
        setIsAllowed(false);
        setIsChecking(false);
        return;
      }

      if (result.data.session.roleId !== "admin-operator") {
        setError({
          code: "FORBIDDEN",
          message: "Only Admin / System Operator users can provision and manage accounts.",
          status: 403,
        });
        setIsAllowed(false);
        setIsChecking(false);
        return;
      }

      setError(null);
      setIsAllowed(true);
      setIsChecking(false);
    }

    void checkAccess();

    return () => {
      active = false;
    };
  }, []);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-2 text-sm text-slate-500 dark:text-stone-400">
        <LoaderCircle className="h-4 w-4 animate-spin" />
        Checking account permissions...
      </div>
    );
  }

  if (!isAllowed || error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <ApiErrorAlert message={error?.message ?? "You do not have access to user management."} />
        <Link
          href={ROUTES.dashboard}
          className="mt-5 inline-flex text-sm font-medium text-[#145d66] hover:text-[#0e4d55]"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  return children;
}

"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import { PageLoadingState } from "@/components/feedback/page-loading-state";
import { getDefaultRouteForRole, isRouteAllowedForRole } from "@/config/access-control";
import { ROUTES } from "@/constants/routes";
import { authService, clearAuthTokens, getAccessToken } from "@/services";
import { isSessionExpiredError } from "@/services/auth/session";

export function ProtectedRouteGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let active = true;

    async function verifySession() {
      setIsAuthorized(false);
      const token = getAccessToken();

      if (!token) {
        router.replace(ROUTES.signIn);
        return;
      }

      const result = await authService.getCurrentUser();

      if (!active) return;

      if (result.error) {
        clearAuthTokens();
        if (!isSessionExpiredError(result.error)) {
          router.replace(ROUTES.signIn);
        }
        return;
      }

      const roleId = result.data.session.roleId;

      if (!isRouteAllowedForRole(pathname, roleId)) {
        router.replace(getDefaultRouteForRole(roleId));
        return;
      }

      setIsAuthorized(true);
    }

    void verifySession();

    return () => {
      active = false;
    };
  }, [pathname, router]);

  if (!isAuthorized) {
    return (
      <PageLoadingState
        eyebrow="Secure access"
        title="Checking access"
        description="Verifying your Servi session and page permissions before opening the workspace."
      />
    );
  }

  return children;
}

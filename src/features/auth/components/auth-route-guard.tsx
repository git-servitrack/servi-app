"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { PageLoadingState } from "@/components/feedback/page-loading-state";
import { ROUTES } from "@/constants/routes";
import { authService, clearAuthTokens, getAccessToken } from "@/services";

export function AuthRouteGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [canShowAuthPage, setCanShowAuthPage] = useState(false);

  useEffect(() => {
    let active = true;

    async function redirectAuthenticatedUser() {
      const token = getAccessToken();

      if (!token) {
        if (active) setCanShowAuthPage(true);
        return;
      }

      const result = await authService.getCurrentUser();

      if (!active) return;

      if (result.error) {
        clearAuthTokens();
        setCanShowAuthPage(true);
        return;
      }

      router.replace(result.data.session.redirectTo || ROUTES.dashboard);
    }

    void redirectAuthenticatedUser();

    return () => {
      active = false;
    };
  }, [router]);

  if (!canShowAuthPage) {
    return (
      <PageLoadingState
        eyebrow="Session"
        title="Checking session"
        description="Preparing the right Servi entry point for your account."
      />
    );
  }

  return children;
}

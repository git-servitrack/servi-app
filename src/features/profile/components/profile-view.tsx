"use client";

import { useEffect, useMemo, useState } from "react";
import { Mail, ShieldCheck, UserCircle, UserRound, type LucideIcon } from "lucide-react";

import { ApiErrorAlert } from "@/components/feedback/api-error-alert";
import { PageLoadingState } from "@/components/feedback/page-loading-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authService } from "@/services";
import type { CurrentUserResponse } from "@/services/auth/contracts";
import type { ApiErrorShape } from "@/services/http/types";

function getInitials(name: string) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2);

  return initials || "SW";
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-white/5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#145d66] dark:text-[#86d0d8]" />
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase text-slate-400 dark:text-stone-500">
          {label}
        </p>
        <p className="mt-1 break-words text-sm font-medium text-slate-900 dark:text-stone-100">
          {value}
        </p>
      </div>
    </div>
  );
}

export function ProfileView() {
  const [currentUser, setCurrentUser] = useState<CurrentUserResponse | null>(null);
  const [error, setError] = useState<ApiErrorShape | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      const result = await authService.getCurrentUser();
      if (!active) return;

      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      setCurrentUser(result.data);
      setError(null);
      setIsLoading(false);
    }

    void loadProfile();

    return () => {
      active = false;
    };
  }, []);

  const fullName = currentUser?.session.fullName ?? "Servi user";
  const initials = useMemo(() => getInitials(fullName), [fullName]);

  if (isLoading) {
    return (
      <PageLoadingState
        eyebrow="Profile"
        title="Loading profile"
        description="Fetching your current account information."
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase text-[#145d66] dark:text-[#86d0d8]">
          Account
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-slate-950 dark:text-stone-100">
          Profile
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-stone-400">
          Review the account information connected to your current SERVI-WEB session.
        </p>
      </div>

      {error ? <ApiErrorAlert message={error.message} /> : null}

      {currentUser ? (
        <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <Card className="border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#1a1d1b]">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                {currentUser.user.avatar ? (
                  <span
                    aria-label={fullName}
                    role="img"
                    className="h-24 w-24 rounded-full bg-cover bg-center shadow-sm"
                    style={{ backgroundImage: `url(${currentUser.user.avatar})` }}
                  />
                ) : (
                  <div className="grid h-24 w-24 place-items-center rounded-full bg-[#145d66] text-2xl font-bold text-white shadow-sm">
                    {initials}
                  </div>
                )}
                <h2 className="mt-5 text-xl font-bold text-slate-950 dark:text-stone-100">
                  {fullName}
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-stone-400">
                  {currentUser.session.roleLabel}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#1a1d1b]">
            <CardHeader>
              <CardTitle>Account details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <DetailRow icon={UserRound} label="Username" value={currentUser.user.username} />
              <DetailRow icon={Mail} label="Email" value={currentUser.user.email} />
              <DetailRow icon={ShieldCheck} label="Role" value={currentUser.session.roleLabel} />
              <DetailRow icon={UserCircle} label="User ID" value={currentUser.user._id} />
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}

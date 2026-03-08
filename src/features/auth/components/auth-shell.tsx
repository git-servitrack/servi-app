import Link from "next/link";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { authRoles } from "@/features/auth/data/auth-roles";

interface AuthShellProps {
  children: ReactNode;
}

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,_rgba(19,94,93,0.14),_transparent_28%),linear-gradient(180deg,_#f7f3ea_0%,_#f1ede4_100%)] text-foreground lg:h-screen lg:overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-border/70" />
      <div className="mx-auto grid min-h-screen w-full max-w-[1440px] gap-10 px-6 py-8 lg:h-screen lg:grid-cols-[minmax(0,0.96fr)_minmax(420px,520px)] lg:gap-6 lg:px-7 lg:py-5">
        <aside className="hidden flex-col justify-between rounded-[2rem] border border-white/50 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(248,244,236,0.88))] p-8 shadow-[0_28px_80px_-40px_rgba(34,47,61,0.4)] lg:flex lg:h-full lg:min-h-0 lg:overflow-hidden lg:p-8">
          <div className="space-y-6 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-2">
            <div className="flex items-center gap-4">
              <div className="grid size-14 place-items-center rounded-[1.4rem] bg-primary text-lg font-bold text-primary-foreground shadow-[0_18px_32px_-22px_rgba(19,94,93,0.85)]">
                SW
              </div>
              <div>
                <p className="font-display text-3xl leading-none text-slate-800">SERVI-WEB</p>
                <p className="text-xs uppercase tracking-[0.38em] text-slate-500">Operations Workspace</p>
              </div>
            </div>

            <div className="space-y-4">
              <Badge variant="outline" className="rounded-full px-4 py-1 uppercase tracking-[0.24em]">
                Secure access
              </Badge>
              <div className="space-y-2.5">
                <h1 className="max-w-3xl font-display text-4xl leading-[0.94] text-slate-900 lg:text-[3.5rem] xl:text-[4rem]">
                  Role-aware access for every operational lane.
                </h1>
                <p className="max-w-xl text-base leading-7 text-slate-600 lg:text-[0.98rem]">
                  Keep sign-in and onboarding clean while preserving the structure needed for system operators, technicians, requestors, supervisors, and management.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {authRoles.map((role) => (
                <Card key={role.id} className="border-white/70 bg-white/75 shadow-none backdrop-blur">
                  <CardContent className="space-y-2 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">{role.shortLabel}</p>
                    <p className="text-sm leading-6 text-slate-700">{role.audience}</p>
                    <p className="text-xs leading-5 text-slate-500">Landing: {role.defaultRoute}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-[1.6rem] border border-dashed border-border/70 bg-white/55 p-5 lg:shrink-0">
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="sm">
                <Link href={ROUTES.signIn}>Sign in</Link>
              </Button>
              <Button asChild size="sm" variant="ghost">
                <Link href={ROUTES.recoverAccount}>Recover access</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Accounts are provisioned by Admin / System Operator users inside dashboard user management. Public self-service sign-up is intentionally disabled.
            </p>
          </div>
        </aside>

        <section className="flex items-center justify-center lg:h-full lg:min-h-0 lg:justify-end">
          <div className="w-full max-w-[540px] lg:max-h-full lg:overflow-y-auto lg:pr-2">{children}</div>
        </section>
      </div>
    </div>
  );
}

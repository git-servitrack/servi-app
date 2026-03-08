"use client";

import { CheckCircle2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { UserRoleDefinition, UserRoleId } from "@/features/auth/types/auth";

interface AuthRoleSelectorProps {
  roles: UserRoleDefinition[];
  selectedRoleId?: UserRoleId;
  onSelect: (roleId: UserRoleId) => void;
  error?: string;
}

export function AuthRoleSelector({ roles, selectedRoleId, onSelect, error }: AuthRoleSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3">
        {roles.map((role) => {
          const isActive = role.id === selectedRoleId;

          return (
            <button key={role.id} type="button" onClick={() => onSelect(role.id)} className="text-left">
              <Card
                className={cn(
                  "transition-colors duration-200",
                  isActive ? "border-primary bg-primary/5 shadow-[0_18px_40px_-28px_rgba(19,94,93,0.55)]" : "hover:border-primary/40 hover:bg-white",
                )}
              >
                <CardContent className="flex items-start justify-between gap-4 p-4">
                  <div className="space-y-1.5">
                    <p className="text-sm font-semibold text-slate-900">{role.label}</p>
                    <p className="text-sm leading-6 text-slate-600">{role.description}</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{role.audience}</p>
                  </div>
                  <div
                    className={cn(
                      "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border",
                      isActive ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-transparent",
                    )}
                    aria-hidden="true"
                  >
                    <CheckCircle2 className="size-4" />
                  </div>
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>
      {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
    </div>
  );
}

"use client";

import { CircleHelp, FolderKanban } from "lucide-react";

import { AppLogo } from "@/components/layout/app-logo";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DASHBOARD_NAVIGATION } from "@/constants/routes";

interface DashboardSidebarContentProps {
  onNavigate?: () => void;
}

export function DashboardSidebarContent({ onNavigate }: DashboardSidebarContentProps) {
  return (
    <div className="flex h-full flex-col gap-6">
      <div className="space-y-6">
        <AppLogo />
        <div className="rounded-[calc(var(--radius)+0.25rem)] border border-border/80 bg-card/80 p-4 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Current phase</p>
              <p className="mt-1 text-lg font-semibold text-foreground">Foundation setup</p>
            </div>
            <Badge>Phase 1</Badge>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        <DashboardNav groups={DASHBOARD_NAVIGATION} onNavigate={onNavigate} />
      </div>

      <div className="space-y-3 rounded-[calc(var(--radius)+0.25rem)] border border-dashed border-border bg-card/70 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <FolderKanban className="size-4 text-accent" />
          Delivery discipline
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          Keep pages thin, reuse shared shells, and hold feature-specific logic inside feature folders.
        </p>
        <Button variant="ghost" className="w-full justify-start px-0 text-sm text-muted-foreground hover:text-foreground">
          <CircleHelp className="size-4" />
          Agent guidance ready
        </Button>
      </div>
    </div>
  );
}

export function DashboardSidebar() {
  return (
    <aside className="hidden h-screen border-r border-border/80 bg-[linear-gradient(180deg,rgba(255,252,245,0.95),rgba(246,241,232,0.8))] px-5 py-6 lg:sticky lg:top-0 lg:flex lg:w-[20rem] lg:flex-col">
      <DashboardSidebarContent />
    </aside>
  );
}

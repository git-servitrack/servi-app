"use client";

import { AppLogo } from "@/components/layout/app-logo";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { DASHBOARD_NAVIGATION } from "@/constants/routes";

interface DashboardSidebarContentProps {
  onNavigate?: () => void;
}

export function DashboardSidebarContent({ onNavigate }: DashboardSidebarContentProps) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-6">
      <AppLogo />

      <div className="flex-1 overflow-y-auto pr-1">
        <DashboardNav groups={DASHBOARD_NAVIGATION} onNavigate={onNavigate} />
      </div>
    </div>
  );
}

export function DashboardSidebar() {
  return (
    <aside className="hidden box-border min-w-0 border-r border-border/80 bg-[linear-gradient(180deg,rgba(255,252,245,0.95),rgba(246,241,232,0.8))] px-5 py-6 lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-[20rem] lg:flex-col">
      <DashboardSidebarContent />
    </aside>
  );
}

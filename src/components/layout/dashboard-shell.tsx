import type { ReactNode } from "react";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <DashboardSidebar />
      <div className="flex min-h-screen min-w-0 flex-col lg:pl-[20rem]">
        <DashboardHeader />
        <main className="flex-1 min-w-0 lg:pt-20">{children}</main>
      </div>
    </div>
  );
}

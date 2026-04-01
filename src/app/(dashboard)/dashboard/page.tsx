import Link from "next/link";
import { Plus } from "lucide-react";

import { KpiCard } from "@/features/dashboard/components/kpi-card";
import { ServiceActivitySection } from "@/features/dashboard/components/service-activity-section";
import { RecentRequestsCard } from "@/features/dashboard/components/recent-requests-card";
import { TeamActivityCard } from "@/features/dashboard/components/team-activity-card";
import { MaintenanceTrendSection } from "@/features/dashboard/components/maintenance-trend-section";
import { KPI_STATS } from "@/features/dashboard/data/dashboard-kpi-data";

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-stone-100">
              Dashboard
            </h1>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-stone-400">
              Track service demand, maintenance throughput, and resource pressure at a glance.
            </p>
          </div>
          <Link
            href="/service-requests"
            className="flex w-fit items-center gap-1.5 rounded-full bg-[#145d66] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0e4d55] dark:hover:bg-[#1a7a86]"
          >
            <Plus className="h-4 w-4" />
            New Request
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {KPI_STATS.map((stat) => (
            <KpiCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className="mt-4 grid gap-4 sm:mt-6 sm:gap-6 xl:grid-cols-[1fr_minmax(0,360px)]">
          <ServiceActivitySection />
          <RecentRequestsCard />
        </div>

        <div className="mt-4 grid gap-4 pb-6 sm:mt-6 sm:gap-6 sm:pb-8 xl:grid-cols-2">
          <TeamActivityCard />
          <MaintenanceTrendSection />
        </div>
      </div>
    </div>
  );
}

import { ArrowRight, CalendarClock } from "lucide-react";
import Link from "next/link";

import {
  dashboardMaintenanceItems,
  dashboardQuickStats,
  dashboardRecentActivity,
  dashboardRequestItems,
  dashboardSummaryMetrics,
} from "@/features/dashboard/data/dashboard-overview";
import { DashboardActivityFeed } from "@/features/dashboard/components/dashboard-activity-feed";
import { DashboardMaintenancePreview } from "@/features/dashboard/components/dashboard-maintenance-preview";
import { DashboardQuickStats } from "@/features/dashboard/components/dashboard-quick-stats";
import { DashboardRequestPreview } from "@/features/dashboard/components/dashboard-request-preview";
import { DashboardSummaryCard } from "@/features/dashboard/components/dashboard-summary-card";
import { ROUTES } from "@/constants/routes";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardOverviewView() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Dashboard"
        title="Operational overview"
        description="Track service demand, maintenance throughput, and resource pressure from a single summary surface designed for daily coordination."
        actions={
          <>
            <Badge variant="accent">Live-ready structure</Badge>
            <Button asChild variant="outline">
              <Link href={ROUTES.serviceRequests}>
                Review requests
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {dashboardSummaryMetrics.map((metric) => (
          <DashboardSummaryCard key={metric.label} metric={metric} />
        ))}
      </section>

      <div className="grid gap-6 2xl:grid-cols-[1.3fr_0.7fr]">
        <SectionWrapper
          title="Operational activity"
          description="Latest work across maintenance, service requests, inventory, and documentation."
        >
          <DashboardActivityFeed items={dashboardRecentActivity} />
        </SectionWrapper>

        <SectionWrapper
          title="Quick stats"
          description="Compact supporting metrics for the current operating window."
        >
          <DashboardQuickStats stats={dashboardQuickStats} />

          <Card className="bg-[linear-gradient(160deg,rgba(23,78,79,0.96),rgba(20,32,51,0.96))] text-primary-foreground">
            <CardHeader className="gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-white/10">
                <CalendarClock className="size-5" />
              </div>
              <CardTitle className="text-2xl text-primary-foreground">Today at a glance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-primary-foreground/80">
              <p>6 service visits are scheduled before noon, including 2 critical site checks.</p>
              <p>3 maintenance jobs are waiting for part confirmation and may affect completion targets.</p>
              <Button asChild variant="secondary" size="sm">
                <Link href={ROUTES.maintenance}>View maintenance queue</Link>
              </Button>
            </CardContent>
          </Card>
        </SectionWrapper>
      </div>

      <div className="grid gap-6">
        <SectionWrapper
          title="Maintenance summary preview"
          description="Immediate visibility into priority work orders and ownership."
        >
          <DashboardMaintenancePreview items={dashboardMaintenanceItems} />
        </SectionWrapper>

        <SectionWrapper
          title="Service request preview"
          description="Frontline request volume and current triage status across sites."
        >
          <DashboardRequestPreview items={dashboardRequestItems} />
        </SectionWrapper>
      </div>
    </PageContainer>
  );
}

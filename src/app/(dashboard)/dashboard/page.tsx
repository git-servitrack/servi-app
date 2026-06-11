"use client";

import Link from "next/link";
import { LoaderCircle, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { ApiErrorAlert } from "@/components/feedback/api-error-alert";
import { isRouteAllowedForRole } from "@/config/access-control";
import { ROUTES } from "@/constants/routes";
import { HighRiskEquipmentCard } from "@/features/dashboard/components/high-risk-equipment-card";
import { KpiCard } from "@/features/dashboard/components/kpi-card";
import { MaintenanceTrendSection } from "@/features/dashboard/components/maintenance-trend-section";
import { RecentRequestsCard } from "@/features/dashboard/components/recent-requests-card";
import { ServiceActivitySection } from "@/features/dashboard/components/service-activity-section";
import { TeamActivityCard } from "@/features/dashboard/components/team-activity-card";
import type {
  ActivityItem,
  KpiStat,
  MaintenanceTrendPoint,
  RecentRequestItem,
  ServiceActivityPoint,
} from "@/features/dashboard/data/dashboard-kpi-data";
import type { MaintenanceRecord } from "@/features/maintenance/types/maintenance";
import type { HighRiskEquipmentReportRow } from "@/features/reports/types/reports";
import type { ServiceRequestRecord } from "@/features/service-requests/types/service-requests";
import { authService, maintenanceService, reportsService, serviceRequestsService, sparePartsService } from "@/services";
import type { UserRoleId } from "@/features/auth/types/auth";
import type { ApiErrorShape } from "@/services/http/types";

const priorityDots: Record<string, string> = {
  Critical: "#dc2626",
  High: "#d97706",
  Medium: "#145d66",
  Low: "#64748b",
};

const activityColors = ["#145d66", "#7c3aed", "#0891b2", "#d97706", "#0f766e"];

function getMetricValue(metrics: { label: string; value: string }[], label: string, fallback = "0") {
  return metrics.find((metric) => metric.label === label)?.value ?? fallback;
}

function parseDate(value?: string) {
  if (!value || value === "N/A" || value === "Not dated" || value === "Pending review") return null;

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfDay(value: Date) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

function dateKey(value: Date) {
  return value.toISOString().slice(0, 10);
}

function formatDate(value?: string) {
  const date = parseDate(value);
  if (!date) return value || "N/A";

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getInitials(value: string) {
  const parts = value
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) return "NA";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function buildDailyBuckets(days: number) {
  const today = startOfDay(new Date());

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (days - 1 - index));

    return date;
  });
}

function buildServiceActivity(requests: ServiceRequestRecord[]): ServiceActivityPoint[] {
  const requestCounts = new Map<string, number>();

  requests.forEach((request) => {
    const date = parseDate(request.submittedAt);
    if (!date) return;

    const key = dateKey(date);
    requestCounts.set(key, (requestCounts.get(key) ?? 0) + 1);
  });

  return buildDailyBuckets(7).map((date) => ({
    day: date.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 1),
    requests: requestCounts.get(dateKey(date)) ?? 0,
  }));
}

function buildMaintenanceTrend(
  requests: ServiceRequestRecord[],
  maintenanceItems: MaintenanceRecord[],
): MaintenanceTrendPoint[] {
  const requestCounts = new Map<string, number>();
  const completedCounts = new Map<string, number>();

  requests.forEach((request) => {
    const date = parseDate(request.submittedAt);
    if (!date) return;

    const key = dateKey(date);
    requestCounts.set(key, (requestCounts.get(key) ?? 0) + 1);
  });

  maintenanceItems.forEach((item) => {
    const date = parseDate(item.completion.completedAt);
    if (!date) return;

    const key = dateKey(date);
    completedCounts.set(key, (completedCounts.get(key) ?? 0) + 1);
  });

  return buildDailyBuckets(14).map((date) => ({
    date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    requested: requestCounts.get(dateKey(date)) ?? 0,
    completed: completedCounts.get(dateKey(date)) ?? 0,
  }));
}

function buildRecentRequests(requests: ServiceRequestRecord[]): RecentRequestItem[] {
  return [...requests]
    .sort((a, b) => (parseDate(b.submittedAt)?.getTime() ?? 0) - (parseDate(a.submittedAt)?.getTime() ?? 0))
    .slice(0, 10)
    .map((request) => ({
      id: request.ticketNumber,
      source: `${request.title} - ${request.site}`,
      date: formatDate(request.submittedAt),
      dot: priorityDots[request.priority] ?? "#145d66",
    }));
}

function buildTeamActivity(
  requests: ServiceRequestRecord[],
  maintenanceItems: MaintenanceRecord[],
): ActivityItem[] {
  const requestActivity = requests.map((request, index) => ({
    sortAt: parseDate(request.submittedAt)?.getTime() ?? 0,
    item: {
      id: request.ticketNumber,
      source: request.requester,
      task: `${request.title} - ${request.site}`,
      status: request.status,
      initials: getInitials(request.requester),
      color: activityColors[index % activityColors.length],
    },
  }));

  const maintenanceActivity = maintenanceItems.map((item, index) => ({
    sortAt:
      parseDate(item.completion.completedAt)?.getTime() ??
      parseDate(item.scheduledFor)?.getTime() ??
      parseDate(item.timeline[0]?.createdAt)?.getTime() ??
      0,
    item: {
      id: item.workOrder,
      source: item.assignment.technician || item.assignedTeam,
      task: `${item.assetName} - ${item.site}`,
      status: item.status,
      initials: getInitials(item.assignment.technician || item.assignedTeam),
      color: activityColors[(index + 2) % activityColors.length],
    },
  }));

  return [...requestActivity, ...maintenanceActivity]
    .sort((a, b) => b.sortAt - a.sortAt)
    .slice(0, 10)
    .map((entry) => entry.item);
}

export default function DashboardPage() {
  const emptyServiceActivity = useMemo(() => buildServiceActivity([]), []);
  const emptyMaintenanceTrend = useMemo(() => buildMaintenanceTrend([], []), []);
  const [stats, setStats] = useState<KpiStat[]>([]);
  const [recentRequests, setRecentRequests] = useState<RecentRequestItem[]>([]);
  const [serviceActivity, setServiceActivity] = useState<ServiceActivityPoint[]>(emptyServiceActivity);
  const [teamActivity, setTeamActivity] = useState<ActivityItem[]>([]);
  const [maintenanceTrend, setMaintenanceTrend] = useState<MaintenanceTrendPoint[]>(emptyMaintenanceTrend);
  const [highRiskEquipment, setHighRiskEquipment] = useState<HighRiskEquipmentReportRow[]>([]);
  const [error, setError] = useState<ApiErrorShape | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [roleId, setRoleId] = useState<UserRoleId | null>(null);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      const [userResult, overviewResult, requestResult, lowStockResult, maintenanceResult] = await Promise.all([
        authService.getCurrentUser(),
        reportsService.overview({ period: "Last 30 days", limit: "10" }),
        serviceRequestsService.list({ limit: 100 }),
        sparePartsService.lowStock({ limit: 100 }),
        maintenanceService.list({ limit: 100 }),
      ]);

      if (!active) return;

      const currentRole = userResult.data?.session.roleId ?? null;
      const getAllowedHref = (route: string) =>
        currentRole && isRouteAllowedForRole(route, currentRole) ? route : undefined;
      const firstError =
        userResult.error ?? overviewResult.error ?? requestResult.error ?? lowStockResult.error ?? maintenanceResult.error;
      const requests = requestResult.error ? [] : requestResult.data;
      const maintenanceItems = maintenanceResult.error ? [] : maintenanceResult.data;

      setRoleId(currentRole);
      setError(firstError);
      setHighRiskEquipment(overviewResult.error ? [] : overviewResult.data.highRiskEquipment);
      setRecentRequests(buildRecentRequests(requests));
      setServiceActivity(buildServiceActivity(requests));
      setTeamActivity(buildTeamActivity(requests, maintenanceItems));
      setMaintenanceTrend(buildMaintenanceTrend(requests, maintenanceItems));
      setStats([
        {
          label: "Open Requests",
          value: String(requests.filter((item) => !["Resolved", "Closed"].includes(item.status)).length),
          trend: "Open service requests",
          highlight: true,
          href: getAllowedHref(ROUTES.serviceRequests),
        },
        {
          label: "Completion Rate",
          value: overviewResult.error ? "0%" : getMetricValue(overviewResult.data.metrics, "Average SLA rate", "0%"),
          trend: "Current report window",
          highlight: false,
          href: getAllowedHref(ROUTES.reports),
        },
        {
          label: "Attention Needed",
          value: overviewResult.error ? "0" : String(overviewResult.data.highRiskEquipment.length),
          trend: "High-risk predictive results",
          highlight: false,
          href: getAllowedHref(ROUTES.predictiveMaintenance),
        },
        {
          label: "Low Stock Parts",
          value: lowStockResult.error ? "0" : String(lowStockResult.data.length),
          trend: "Parts below reorder point",
          highlight: false,
          href: getAllowedHref(ROUTES.spareParts),
        },
      ]);

      setIsLoading(false);
    }

    void loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-stone-100">
                Dashboard
              </h1>
              {isLoading ? <LoaderCircle className="h-5 w-5 animate-spin text-[#145d66]" /> : null}
            </div>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-stone-400">
              Track service demand, maintenance throughput, resource pressure, and predictive risk at a glance.
            </p>
          </div>
          {roleId && isRouteAllowedForRole(ROUTES.serviceRequests, roleId) ? (
            <Link
              href={ROUTES.serviceRequests}
              className="flex w-fit items-center gap-1.5 rounded-full bg-[#145d66] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0e4d55] dark:hover:bg-[#1a7a86]"
            >
              <Plus className="h-4 w-4" />
              New Request
            </Link>
          ) : null}
        </div>

        {error ? (
          <div className="mt-5">
            <ApiErrorAlert message={error.message} />
          </div>
        ) : null}

        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {stats.map((stat) => (
            <KpiCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className="mt-4 grid gap-4 sm:mt-6 sm:gap-6 xl:grid-cols-[1fr_minmax(0,360px)]">
          <ServiceActivitySection data={serviceActivity} />
          <RecentRequestsCard items={recentRequests} />
        </div>

        <div className="mt-4 grid gap-4 sm:mt-6 sm:gap-6 xl:grid-cols-2">
          <HighRiskEquipmentCard items={highRiskEquipment} />
          <TeamActivityCard items={teamActivity} />
        </div>

        <div className="mt-4 grid gap-4 pb-6 sm:mt-6 sm:gap-6 sm:pb-8">
          <MaintenanceTrendSection data={maintenanceTrend} />
        </div>
      </div>
    </div>
  );
}

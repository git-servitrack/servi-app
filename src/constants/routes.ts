import {
  BarChart3,
  ClipboardList,
  FileStack,
  Gauge,
  Package,
  ShieldCheck,
  SquareKanban,
  UsersRound,
  Wrench,
} from "lucide-react";

import type { NavigationGroup } from "@/types/navigation";

export const ROUTES = {
  home: "/",
  signIn: "/sign-in",
  signUp: "/sign-up",
  recoverAccount: "/recover-account",
  dashboard: "/dashboard",
  assets: "/assets",
  serviceRequests: "/service-requests",
  maintenance: "/maintenance",
  technicians: "/technicians",
  userManagement: "/user-management",
  spareParts: "/spare-parts",
  documentation: "/documentation",
  reports: "/reports",
  settings: "/settings",
} as const;

export const DASHBOARD_NAVIGATION: NavigationGroup[] = [
  {
    title: "Operations",
    items: [
      {
        title: "Dashboard",
        href: ROUTES.dashboard,
        icon: Gauge,
        description: "Overview of system activity and operational health.",
      },
      {
        title: "Assets",
        href: ROUTES.assets,
        icon: SquareKanban,
        description: "Inventory and asset management workflows.",
      },
      {
        title: "Service Requests",
        href: ROUTES.serviceRequests,
        icon: ClipboardList,
        description: "Request intake, updates, and histories.",
      },
      {
        title: "Maintenance",
        href: ROUTES.maintenance,
        icon: Wrench,
        description: "Repair actions, statuses, and assignments.",
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        title: "Technicians",
        href: ROUTES.technicians,
        icon: ShieldCheck,
        description: "Profiles, workload, and performance summaries.",
      },
      {
        title: "User Management",
        href: ROUTES.userManagement,
        icon: UsersRound,
        description: "Admin-only user provisioning and role assignment.",
      },
      {
        title: "Spare Parts",
        href: ROUTES.spareParts,
        icon: Package,
        description: "Stock visibility and movement history.",
      },
      {
        title: "Documentation",
        href: ROUTES.documentation,
        icon: FileStack,
        description: "Uploads, previews, and linked references.",
      },
      {
        title: "Reports",
        href: ROUTES.reports,
        icon: BarChart3,
        description: "Operational reports and exports.",
      },
    ],
  },
];

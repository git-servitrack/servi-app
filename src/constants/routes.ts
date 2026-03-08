import {
  BarChart3,
  ClipboardList,
  FileStack,
  Gauge,
  Package,
  ShieldCheck,
  SquareKanban,
  Wrench,
} from "lucide-react";

import type { NavigationGroup } from "@/types/navigation";

export const ROUTES = {
  home: "/",
  dashboard: "/dashboard",
  assets: "/assets",
  serviceRequests: "/service-requests",
  maintenance: "/maintenance",
  technicians: "/technicians",
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
        upcoming: true,
      },
      {
        title: "Service Requests",
        href: ROUTES.serviceRequests,
        icon: ClipboardList,
        description: "Request intake, updates, and histories.",
        upcoming: true,
      },
      {
        title: "Maintenance",
        href: ROUTES.maintenance,
        icon: Wrench,
        description: "Repair actions, statuses, and assignments.",
        upcoming: true,
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
        title: "Spare Parts",
        href: ROUTES.spareParts,
        icon: Package,
        description: "Stock visibility and movement history.",
        upcoming: true,
      },
      {
        title: "Documentation",
        href: ROUTES.documentation,
        icon: FileStack,
        description: "Uploads, previews, and linked references.",
        upcoming: true,
      },
      {
        title: "Reports",
        href: ROUTES.reports,
        icon: BarChart3,
        description: "Operational reports and exports.",
        upcoming: true,
      },
    ],
  },
];

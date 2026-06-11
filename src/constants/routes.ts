import {
  BarChart3,
  BrainCircuit,
  ClipboardList,
  FileStack,
  Gauge,
  Package,
  Settings,
  SquareKanban,
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
  predictiveMaintenance: "/predictive-maintenance",
  technicians: "/settings/technicians",
  userManagement: "/settings/user-management",
  category: "/settings/category",
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
      // {
      //   title: "Predictive Maintenance",
      //   href: ROUTES.predictiveMaintenance,
      //   icon: BrainCircuit,
      //   description: "Decision-tree risk prediction and saved results.",
      // },
      {
        title: "Reports",
        href: ROUTES.reports,
        icon: BarChart3,
        description: "Operational reports and exports.",
      },
      {
        title: "Settings",
        href: ROUTES.settings,
        icon: Settings,
        description: "Technicians, users, and category administration.",
      },
    ],
  },
];

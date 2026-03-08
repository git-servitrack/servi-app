import type { LucideIcon } from "lucide-react";

export interface NavigationItem {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  upcoming?: boolean;
}

export interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}

export interface NavigationBreadcrumb {
  label: string;
  href: string;
  current: boolean;
}

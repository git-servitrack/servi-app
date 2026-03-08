import { DASHBOARD_NAVIGATION, ROUTES } from "@/constants/routes";
import type { NavigationBreadcrumb } from "@/types/navigation";

function getNavigationItems() {
  return DASHBOARD_NAVIGATION.flatMap((group) => group.items);
}

function formatSegmentLabel(segment: string) {
  return segment
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getNavigationMatch(pathname: string) {
  const items = getNavigationItems();

  return items.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
}

export function getBreadcrumbs(pathname: string): NavigationBreadcrumb[] {
  if (!pathname || pathname === ROUTES.home) {
    return [];
  }

  const items = getNavigationItems();
  const segments = pathname.split("/").filter(Boolean);
  let currentPath = "";

  return segments.map((segment, index) => {
    currentPath += `/${segment}`;

    const match = items.find((item) => item.href === currentPath);
    const label = match?.title ?? formatSegmentLabel(segment);

    return {
      label,
      href: currentPath,
      current: index === segments.length - 1,
    };
  });
}

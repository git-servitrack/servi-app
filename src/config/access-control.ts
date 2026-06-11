import { DASHBOARD_NAVIGATION, ROUTES } from "@/constants/routes";
import { authRoles } from "@/features/auth/data/auth-roles";
import type { UserRoleId } from "@/features/auth/types/auth";
import type { NavigationGroup, NavigationItem } from "@/types/navigation";

export const roleAccessMap = {
  "admin-operator": [
    ROUTES.dashboard,
    ROUTES.assets,
    ROUTES.serviceRequests,
    ROUTES.maintenance,
    ROUTES.spareParts,
    ROUTES.documentation,
    ROUTES.reports,
    ROUTES.settings,
    ROUTES.technicians,
    ROUTES.userManagement,
    ROUTES.category,
    ROUTES.profile,
  ],
  "head-technician": [
    ROUTES.dashboard,
    ROUTES.assets,
    ROUTES.serviceRequests,
    ROUTES.maintenance,
    ROUTES.documentation,
    ROUTES.reports,
    ROUTES.settings,
    ROUTES.technicians,
    ROUTES.category,
    ROUTES.profile,
  ],
  technician: [
    ROUTES.dashboard,
    ROUTES.maintenance,
    ROUTES.documentation,
    // ROUTES.predictiveMaintenance,
    ROUTES.profile,
  ],
  "project-site": [ROUTES.dashboard, ROUTES.documentation, ROUTES.profile],
  "warehouse-staff": [ROUTES.dashboard, ROUTES.spareParts, ROUTES.reports, ROUTES.profile],
  management: [
    ROUTES.dashboard,
    ROUTES.reports,
    ROUTES.documentation,
    ROUTES.spareParts,
    // ROUTES.predictiveMaintenance,
    ROUTES.profile,
  ],
} satisfies Record<UserRoleId, string[]>;

function isNestedRoute(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

function hasAllowedSettingsChild(role: UserRoleId) {
  return roleAccessMap[role].some((route) => route.startsWith(`${ROUTES.settings}/`));
}

export function getAllowedRoutesForRole(role: UserRoleId) {
  return roleAccessMap[role];
}

export function getDefaultRouteForRole(role: UserRoleId) {
  const roleDefinition = authRoles.find((item) => item.id === role);
  const preferredRoute = roleDefinition?.defaultRoute ?? ROUTES.dashboard;

  if (isRouteAllowedForRole(preferredRoute, role)) return preferredRoute;

  return roleAccessMap[role][0] ?? ROUTES.dashboard;
}

export function isRouteAllowedForRole(pathname: string, role: UserRoleId) {
  if (pathname === ROUTES.settings && hasAllowedSettingsChild(role)) return true;

  return roleAccessMap[role].some((route) => isNestedRoute(pathname, route));
}

export function isNavigationItemAllowed(item: NavigationItem, role: UserRoleId) {
  if (item.href === ROUTES.settings && hasAllowedSettingsChild(role)) return true;

  return isRouteAllowedForRole(item.href, role);
}

export function getNavigationForRole(role?: UserRoleId | null): NavigationGroup[] {
  if (!role) return [];

  return DASHBOARD_NAVIGATION.map((group) => ({
    ...group,
    items: group.items.filter((item) => isNavigationItemAllowed(item, role)),
  })).filter((group) => group.items.length > 0);
}

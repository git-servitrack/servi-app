import { DASHBOARD_NAVIGATION } from "@/constants/routes";

export function getNavigationMatch(pathname: string) {
  const items = DASHBOARD_NAVIGATION.flatMap((group) => group.items);

  return items.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
}

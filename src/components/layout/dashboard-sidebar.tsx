"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronsLeft,
  ChevronsRight,
  Moon,
  MoreVertical,
  Sun,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { useTheme } from "@/components/providers/theme-provider";
import { useSidebar } from "@/components/providers/sidebar-provider";
import { getNavigationForRole } from "@/config/access-control";
import { cn } from "@/lib/utils";
import { authService } from "@/services";
import type { UserRoleId } from "@/features/auth/types/auth";
import type { NavigationGroup } from "@/types/navigation";

function CollapsedTooltip({ label, children }: { label: string; children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white shadow-xl"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ExpandedNavItem({
  item,
  pathname,
  onLinkClick,
}: {
  item: NavigationGroup["items"][number];
  pathname: string;
  onLinkClick?: () => void;
}) {
  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onLinkClick}
      className={cn(
        "flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors",
        isActive
          ? "bg-[#145d66] text-white"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-stone-400 dark:hover:bg-white/8 dark:hover:text-stone-100",
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span>{item.title}</span>
    </Link>
  );
}

function SidebarBody({
  collapsed,
  groups,
  onLinkClick,
}: {
  collapsed: boolean;
  groups: NavigationGroup[];
  onLinkClick?: () => void;
}) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <>
      <nav className="flex flex-1 flex-col gap-6 overflow-y-auto overflow-x-hidden px-2 py-5">
        {groups.map((group) => (
          <div key={group.title} className="space-y-0.5">
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-stone-600"
                >
                  {group.title}
                </motion.p>
              )}
            </AnimatePresence>

            {collapsed ? (
              <div className="flex flex-col items-center gap-0.5">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <CollapsedTooltip key={item.href} label={item.title}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
                          isActive
                            ? "bg-[#145d66] text-white"
                            : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-stone-400 dark:hover:bg-white/8 dark:hover:text-stone-100",
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                      </Link>
                    </CollapsedTooltip>
                  );
                })}
              </div>
            ) : (
              group.items.map((item) => (
                <ExpandedNavItem
                  key={item.href}
                  item={item}
                  pathname={pathname}
                  onLinkClick={onLinkClick}
                />
              ))
            )}
          </div>
        ))}
      </nav>

      <div
        className={cn(
          "shrink-0 border-t border-slate-100 px-2 py-4 dark:border-white/6",
          collapsed && "flex justify-center",
        )}
      >
        {collapsed ? (
          <CollapsedTooltip label={isDark ? "Switch to Light" : "Switch to Dark"}>
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-stone-400 dark:hover:bg-white/8 dark:hover:text-stone-100"
            >
              {isDark ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}
            </button>
          </CollapsedTooltip>
        ) : (
          <div className="flex h-10 items-center rounded-xl bg-slate-100 p-1 dark:bg-white/6">
            <button
              onClick={() => setTheme("light")}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-lg py-1.5 text-xs font-medium transition-colors",
                !isDark
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:text-stone-500 dark:hover:text-stone-300",
              )}
            >
              <Sun className="h-3.5 w-3.5" />
              Light
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-lg py-1.5 text-xs font-medium transition-colors",
                isDark
                  ? "bg-[#252926] text-stone-100 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:text-stone-500 dark:hover:text-stone-300",
              )}
            >
              <Moon className="h-3.5 w-3.5" />
              Dark
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function SidebarLogo({
  collapsed,
  onClose,
  showCloseButton = false,
}: {
  collapsed: boolean;
  onClose?: () => void;
  showCloseButton?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex h-16 shrink-0 items-center border-b border-slate-100 px-3 dark:border-white/6",
        collapsed ? "justify-center" : "justify-between",
      )}
    >
      <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#145d66] font-display text-xs font-bold text-white shadow-sm">
          SW
        </span>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap font-semibold tracking-tight text-slate-900 dark:text-stone-100"
            >
              SERVI-WEB
            </motion.span>
          )}
        </AnimatePresence>
      </Link>

      {!collapsed &&
        (showCloseButton ? (
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:text-stone-600 dark:hover:bg-white/8 dark:hover:text-stone-400"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <button className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:text-stone-600 dark:hover:bg-white/8 dark:hover:text-stone-400">
            <MoreVertical className="h-4 w-4" />
          </button>
        ))}
    </div>
  );
}

export function DashboardSidebar() {
  const { isMobileOpen, closeMobile } = useSidebar();
  const [collapsed, setCollapsed] = useState(false);
  const [roleId, setRoleId] = useState<UserRoleId | null>(null);
  const groups = getNavigationForRole(roleId);

  useEffect(() => {
    let active = true;

    async function loadRole() {
      const result = await authService.getCurrentUser();
      if (!active || result.error) return;
      setRoleId(result.data.session.roleId);
    }

    void loadRole();

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-slate-200 bg-white transition-[width] duration-300 ease-in-out dark:border-white/8 dark:bg-[#11120f] lg:flex",
          collapsed ? "w-16" : "w-72",
        )}
      >
        <SidebarLogo collapsed={collapsed} />

        <div className="relative flex h-0 justify-end">
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="absolute -right-3.5 top-0 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-700 dark:border-white/12 dark:bg-[#1a1d1b] dark:text-stone-400 dark:hover:bg-[#252926] dark:hover:text-stone-200"
          >
            {collapsed ? (
              <ChevronsRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronsLeft className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        <SidebarBody collapsed={collapsed} groups={groups} />
      </aside>

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMobile}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            />

            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r border-slate-200 bg-white dark:border-white/8 dark:bg-[#11120f] lg:hidden"
            >
              <SidebarLogo collapsed={false} onClose={closeMobile} showCloseButton />
              <SidebarBody collapsed={false} groups={groups} onLinkClick={closeMobile} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

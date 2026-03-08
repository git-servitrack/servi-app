"use client";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { AppLogo } from "@/components/layout/app-logo";
import { DashboardBreadcrumbs } from "@/components/layout/dashboard-breadcrumbs";
import { DashboardSidebarContent } from "@/components/layout/dashboard-sidebar";
import { DashboardUserMenu } from "@/components/layout/dashboard-user-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { getNavigationMatch } from "@/lib/navigation";
import { formatShortDate } from "@/lib/utils";

export function DashboardHeader() {
  const pathname = usePathname();
  const currentItem = getNavigationMatch(pathname);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-border/80 bg-background/85 backdrop-blur-xl lg:fixed lg:left-[20rem] lg:right-0">
      <div className="flex h-20 min-w-0 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="size-4" />
                <span className="sr-only">Open navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <SheetHeader className="border-b border-border/80 px-5 py-4 text-left">
                <SheetTitle>Workspace navigation</SheetTitle>
                <SheetDescription>Foundation shell with route groups ready for later phases.</SheetDescription>
              </SheetHeader>
              <div className="h-[calc(100%-5.5rem)] px-5 py-5">
                <DashboardSidebarContent onNavigate={() => setMobileOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>

          <div className="lg:hidden">
            <AppLogo />
          </div>

          <div className="hidden lg:block">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Current workspace</p>
            <h2 className="text-2xl text-foreground">{currentItem?.title ?? "Operations shell"}</h2>
            <DashboardBreadcrumbs />
          </div>
        </div>

        <div className="hidden shrink-0 items-center gap-3 sm:flex">
          <div className="rounded-full border border-border/80 bg-card px-4 py-2 text-right shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Foundation build</p>
            <p className="text-sm font-semibold text-foreground">{formatShortDate(new Date())}</p>
          </div>
          <DashboardUserMenu />
        </div>
      </div>

      <div className="border-t border-border/70 px-4 py-3 lg:hidden sm:px-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Current workspace</p>
        <h2 className="mt-1 text-xl text-foreground">{currentItem?.title ?? "Operations shell"}</h2>
        <div className="mt-2">
          <DashboardBreadcrumbs />
        </div>
      </div>
    </header>
  );
}

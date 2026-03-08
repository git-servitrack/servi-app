"use client";

import { Menu, PanelTop } from "lucide-react";
import { usePathname } from "next/navigation";

import { DashboardSidebarContent } from "@/components/layout/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { getNavigationMatch } from "@/lib/navigation";
import { formatShortDate } from "@/lib/utils";

export function DashboardHeader() {
  const pathname = usePathname();
  const currentItem = getNavigationMatch(pathname);

  return (
    <header className="sticky top-0 z-20 border-b border-border/80 bg-background/85 backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Sheet>
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
                <DashboardSidebarContent />
              </div>
            </SheetContent>
          </Sheet>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Current workspace</p>
            <h2 className="text-2xl text-foreground">{currentItem?.title ?? "Operations shell"}</h2>
          </div>
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          <div className="rounded-full border border-border/80 bg-card px-4 py-2 text-right shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Foundation build</p>
            <p className="text-sm font-semibold text-foreground">{formatShortDate(new Date())}</p>
          </div>
          <Button variant="outline">
            <PanelTop className="size-4" />
            User menu placeholder
          </Button>
        </div>
      </div>
    </header>
  );
}

"use client";

import { Bell, LogOut, UserRound } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function DashboardUserMenu() {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" aria-label="Notifications placeholder">
        <Bell className="size-4" />
      </Button>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            <UserRound className="size-4" />
            Workspace menu
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>App actions placeholder</DialogTitle>
            <DialogDescription>
              This is the Phase 2 placeholder area for account actions, logout, role switching, and settings entry points.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 rounded-[calc(var(--radius)+0.25rem)] border border-border/80 bg-card/70 p-4">
            <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-background px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-foreground">Signed-in user</p>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Placeholder profile</p>
              </div>
              <UserRound className="size-4 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-dashed border-border bg-background px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-foreground">Logout action</p>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Reserved for auth integration</p>
              </div>
              <LogOut className="size-4 text-muted-foreground" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { NavigationGroup } from "@/types/navigation";

interface DashboardNavProps {
  groups: NavigationGroup[];
  onNavigate?: () => void;
}

export function DashboardNav({ groups, onNavigate }: DashboardNavProps) {
  const pathname = usePathname();

  return (
    <nav className="space-y-6" aria-label="Dashboard navigation">
      {groups.map((group) => (
        <div key={group.title} className="space-y-2">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {group.title}
          </p>
          <div className="space-y-1">
            {group.items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "group flex items-start gap-3 rounded-[calc(var(--radius)-0.25rem)] border px-3 py-3 transition-colors",
                    isActive
                      ? "border-primary/20 bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                      : "border-transparent text-foreground hover:border-border/70 hover:bg-muted/60"
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-2xl border transition-colors",
                      isActive
                        ? "border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground"
                        : "border-border bg-background/70 text-muted-foreground group-hover:text-foreground"
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1 space-y-1">
                    <span className="flex items-center gap-2 text-sm font-semibold">
                      {item.title}
                      {item.upcoming ? (
                        <Badge variant={isActive ? "secondary" : "outline"} className="px-2 py-0.5 text-[10px] tracking-[0.14em]">
                          Upcoming
                        </Badge>
                      ) : null}
                    </span>
                    {item.description ? (
                      <span className={cn("block text-xs leading-6", isActive ? "text-primary-foreground/80" : "text-muted-foreground")}>
                        {item.description}
                      </span>
                    ) : null}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

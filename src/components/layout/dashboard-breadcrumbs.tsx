"use client";

import Link from "next/link";
import { Slash } from "lucide-react";
import { usePathname } from "next/navigation";

import { getBreadcrumbs } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function DashboardBreadcrumbs() {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="overflow-x-auto">
      <ol className="flex min-w-max items-center gap-2 text-sm text-muted-foreground">
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.href} className="flex items-center gap-2">
            {index > 0 ? <Slash className="size-3.5 text-muted-foreground/60" /> : null}
            {crumb.current ? (
              <span className="font-medium text-foreground">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className={cn("transition-colors hover:text-foreground")}>
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

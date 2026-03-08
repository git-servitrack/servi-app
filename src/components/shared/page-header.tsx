import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ eyebrow, title, description, actions, className }: PageHeaderProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-[calc(var(--radius)+0.5rem)] border border-border/80 bg-[linear-gradient(135deg,rgba(255,252,245,0.94),rgba(236,227,209,0.84))] p-6 shadow-[var(--shadow-soft)] sm:p-8",
        className
      )}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-3">
          {eyebrow ? <Badge variant="outline">{eyebrow}</Badge> : null}
          <div className="space-y-2">
            <h1 className="text-4xl text-balance text-foreground sm:text-5xl">{title}</h1>
            {description ? <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">{description}</p> : null}
          </div>
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
      </div>
    </section>
  );
}

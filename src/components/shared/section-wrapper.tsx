import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SectionWrapperProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  actions?: ReactNode;
  contentClassName?: string;
}

export function SectionWrapper({
  title,
  description,
  actions,
  className,
  contentClassName,
  children,
  ...props
}: SectionWrapperProps) {
  return (
    <section className={cn("space-y-4", className)} {...props}>
      {title || description || actions ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            {title ? <h2 className="text-2xl text-foreground">{title}</h2> : null}
            {description ? <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p> : null}
          </div>
          {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
        </div>
      ) : null}
      <div className={cn("space-y-4", contentClassName)}>{children}</div>
    </section>
  );
}

import type { ReactNode } from "react";
import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FormSubmitBarProps {
  isSubmitting: boolean;
  submitLabel: string;
  helpText: string;
  className?: string;
  helpTextClassName?: string;
  actions?: ReactNode;
}

export function FormSubmitBar({ isSubmitting, submitLabel, helpText, className, helpTextClassName, actions }: FormSubmitBarProps) {
  const hasHelpText = helpText.trim().length > 0;

  return (
    <div
      className={cn(
        "rounded-[calc(var(--radius)-0.15rem)] text-sm text-muted-foreground",
        hasHelpText
          ? "flex flex-col gap-3 border border-dashed border-border bg-muted/35 p-4 xl:flex-row xl:items-center xl:justify-between"
          : "flex justify-end p-0",
        className,
      )}
    >
      {hasHelpText ? <p className={cn("leading-6", helpTextClassName)}>{helpText}</p> : null}
      {actions ?? (
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <LoaderCircle className="size-4 animate-spin" /> : null}
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      )}
    </div>
  );
}

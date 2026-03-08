import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

interface FormSubmitBarProps {
  isSubmitting: boolean;
  submitLabel: string;
  helpText: string;
}

export function FormSubmitBar({ isSubmitting, submitLabel, helpText }: FormSubmitBarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-[calc(var(--radius)-0.15rem)] border border-dashed border-border bg-muted/35 p-4 text-sm text-muted-foreground lg:flex-row lg:items-center lg:justify-between">
      <p>{helpText}</p>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? <LoaderCircle className="size-4 animate-spin" /> : null}
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </div>
  );
}

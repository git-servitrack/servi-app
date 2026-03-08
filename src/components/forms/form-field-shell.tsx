import type { ReactNode } from "react";

interface FormFieldShellProps {
  label: string;
  error?: string;
  children: ReactNode;
  description?: string;
}

export function FormFieldShell({ label, error, children, description }: FormFieldShellProps) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
      {children}
      {description ? <p className="text-xs leading-5 text-muted-foreground">{description}</p> : null}
      {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
    </label>
  );
}

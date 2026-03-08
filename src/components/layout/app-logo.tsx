import Link from "next/link";

import { cn } from "@/lib/utils";

export function AppLogo({ className }: { className?: string }) {
  return (
    <Link href="/dashboard" className={cn("inline-flex items-center gap-3", className)}>
      <span className="flex size-11 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground shadow-[var(--shadow-soft)]">
        SW
      </span>
      <span className="flex flex-col">
        <span className="font-display text-xl leading-none text-foreground">SERVI-WEB</span>
        <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Operations workspace</span>
      </span>
    </Link>
  );
}

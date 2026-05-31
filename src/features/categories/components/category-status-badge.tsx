import { cn } from "@/lib/utils";

export function CategoryStatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-1 text-xs font-medium",
        isActive
          ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300"
          : "border-slate-200 bg-slate-50 text-slate-500 dark:border-white/10 dark:bg-white/4 dark:text-stone-400",
      )}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

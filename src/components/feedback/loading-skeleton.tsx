import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  cardCount?: number;
  rowCount?: number;
}

export function LoadingSkeleton({ className, cardCount = 3, rowCount = 4 }: LoadingSkeletonProps) {
  return (
    <div
      className={cn("space-y-6", className)}
      role="status"
      aria-live="polite"
      aria-label="Loading content"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: cardCount }).map((_, index) => (
          <div
            key={index}
            className="rounded-[calc(var(--radius)+0.25rem)] border border-border/80 bg-card p-5 shadow-[var(--shadow-soft)]"
          >
            <Skeleton className="mb-4 h-4 w-28" />
            <Skeleton className="mb-3 h-8 w-20" />
            <Skeleton className="h-4 w-40" />
          </div>
        ))}
      </div>

      <div className="rounded-[calc(var(--radius)+0.25rem)] border border-border/80 bg-card p-5 shadow-[var(--shadow-soft)]">
        <Skeleton className="mb-5 h-5 w-48" />
        <div className="space-y-3">
          {Array.from({ length: rowCount }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

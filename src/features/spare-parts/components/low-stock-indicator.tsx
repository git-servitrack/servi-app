import { AlertTriangle, CircleCheck } from "lucide-react";

import { cn } from "@/lib/utils";

interface LowStockIndicatorProps {
  stockOnHand: number;
  reorderPoint: number;
}

export function LowStockIndicator({ stockOnHand, reorderPoint }: LowStockIndicatorProps) {
  const isLow = stockOnHand <= reorderPoint;

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm font-medium",
        isLow ? "text-accent" : "text-emerald-700",
      )}
    >
      {isLow ? <AlertTriangle className="size-4" /> : <CircleCheck className="size-4" />}
      <span>{isLow ? "Reorder now" : "Healthy stock"}</span>
    </div>
  );
}

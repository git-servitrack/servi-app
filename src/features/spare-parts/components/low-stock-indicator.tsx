import { AlertTriangle, CircleCheck } from "lucide-react";

interface LowStockIndicatorProps {
  stockOnHand: number;
  reorderPoint: number;
}

export function LowStockIndicator({ stockOnHand, reorderPoint }: LowStockIndicatorProps) {
  const isLow = stockOnHand <= reorderPoint;

  return (
    <div
      className={`flex items-center gap-2 text-sm font-medium ${
        isLow
          ? "text-rose-600 dark:text-rose-400"
          : "text-emerald-600 dark:text-emerald-400"
      }`}
    >
      {isLow ? <AlertTriangle className="h-4 w-4" /> : <CircleCheck className="h-4 w-4" />}
      <span>{isLow ? "Reorder now" : "Healthy stock"}</span>
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
import type { StockStatus } from "@/features/spare-parts/types/spare-parts";

const statusVariantMap: Record<StockStatus, React.ComponentProps<typeof Badge>["variant"]> = {
  "In Stock": "default",
  "Low Stock": "secondary",
  Critical: "accent",
  "Out of Stock": "outline",
};

export function StockBadge({ status }: { status: StockStatus }) {
  return <Badge variant={statusVariantMap[status]}>{status}</Badge>;
}

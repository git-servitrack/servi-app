import { Badge } from "@/components/ui/badge";
import type { AssetStatus } from "@/features/assets/types/assets";

const statusVariantMap = {
  Operational: "default",
  "Maintenance Due": "secondary",
  "Under Repair": "accent",
  Decommissioned: "outline",
} as const;

export function AssetStatusBadge({ status }: { status: AssetStatus }) {
  return <Badge variant={statusVariantMap[status]}>{status}</Badge>;
}

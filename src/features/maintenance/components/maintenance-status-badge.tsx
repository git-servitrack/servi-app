import { Badge } from "@/components/ui/badge";
import type { MaintenanceStatus } from "@/features/maintenance/types/maintenance";

const statusVariantMap = {
  Assigned: "outline",
  Diagnosing: "secondary",
  "Awaiting Parts": "accent",
  "Repair In Progress": "default",
  "Ready for QA": "secondary",
  Completed: "default",
} as const;

export function MaintenanceStatusBadge({ status }: { status: MaintenanceStatus }) {
  return <Badge variant={statusVariantMap[status]}>{status}</Badge>;
}

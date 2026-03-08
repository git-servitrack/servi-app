import { Badge } from "@/components/ui/badge";
import type { RequestStatus } from "@/features/service-requests/types/service-requests";

const statusVariantMap = {
  New: "accent",
  "Under Review": "secondary",
  Scheduled: "default",
  "In Progress": "default",
  Resolved: "outline",
  Closed: "outline",
} as const;

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  return <Badge variant={statusVariantMap[status]}>{status}</Badge>;
}

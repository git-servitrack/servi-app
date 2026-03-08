import { Badge } from "@/components/ui/badge";
import type { TechnicianStatus } from "@/features/technicians/types/technicians";

const statusVariantMap = {
  Available: "default",
  "On Assignment": "secondary",
  "Off Shift": "outline",
  Leave: "accent",
} as const;

export function TechnicianStatusBadge({ status }: { status: TechnicianStatus }) {
  return <Badge variant={statusVariantMap[status]}>{status}</Badge>;
}

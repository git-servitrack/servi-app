import { Badge } from "@/components/ui/badge";
import type { UserAccountStatus } from "@/features/user-management/types/user-management";

interface UserStatusBadgeProps {
  status: UserAccountStatus;
}

const variantMap: Record<UserAccountStatus, "default" | "outline" | "secondary"> = {
  Active: "default",
  "Pending Activation": "secondary",
  Suspended: "outline",
};

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
  return <Badge variant={variantMap[status]}>{status}</Badge>;
}

import { authRoles } from "@/features/auth/data/auth-roles";
import type { UserRoleDefinition, UserRoleId } from "@/features/auth/types/auth";

export function getRoleDefinition(roleId: UserRoleId): UserRoleDefinition {
  const role = authRoles.find((item) => item.id === roleId);

  if (!role) {
    throw new Error(`Unknown auth role: ${roleId}`);
  }

  return role;
}

import Link from "next/link";

import { EmptyTableState } from "@/components/shared/empty-table-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ROUTES } from "@/constants/routes";
import { authRoles } from "@/features/auth/data/auth-roles";
import type { UserManagementRecord } from "@/features/user-management/types/user-management";
import { UserStatusBadge } from "@/features/user-management/components/user-status-badge";

interface UserTableProps {
  users: UserManagementRecord[];
}

export function UserTable({ users }: UserTableProps) {
  if (users.length === 0) {
    return <EmptyTableState colSpan={6} title="No user accounts" description="Provisioned users will appear here once admins start inviting and assigning roles." />;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last sign in</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const role = authRoles.find((item) => item.id === user.roleId);

            return (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">{user.fullName}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">{role?.shortLabel ?? user.roleId}</p>
                    <p className="text-xs text-muted-foreground">Provisioned by {user.invitedBy}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <UserStatusBadge status={user.status} />
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{user.lastSignIn}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`${ROUTES.userManagement}/${user.id}/edit`}>Edit access</Link>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

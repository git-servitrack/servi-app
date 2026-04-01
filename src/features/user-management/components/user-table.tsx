import { authRoles } from "@/features/auth/data/auth-roles";
import { UserStatusBadge } from "@/features/user-management/components/user-status-badge";
import type { UserManagementRecord } from "@/features/user-management/types/user-management";

const STATUS_COLORS: Record<string, string> = {
  Active: "#059669",
  "Pending Activation": "#d97706",
  Suspended: "#dc2626",
};

interface UserTableProps {
  users: UserManagementRecord[];
  onEdit?: (userId: string) => void;
}

export function UserTable({ users, onEdit }: UserTableProps) {
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
        <p className="font-medium text-slate-900 dark:text-stone-100">No user accounts</p>
        <p className="text-sm text-slate-400 dark:text-stone-500">
          Provisioned users will appear here once admins start inviting and assigning roles.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100 dark:divide-white/6">
      {users.map((user) => {
        const role = authRoles.find((r) => r.id === user.roleId);

        return (
          <div
            key={user.id}
            className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50/50 sm:gap-4 sm:px-6 sm:py-4 dark:hover:bg-white/3"
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: STATUS_COLORS[user.status] ?? "#64748b" }}
            >
              {user.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-stone-100">
                  {user.fullName}
                </p>
                <UserStatusBadge status={user.status} />
              </div>
              <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-stone-400">
                <span className="font-medium text-[#145d66] dark:text-[#86d0d8]">{role?.shortLabel ?? user.roleId}</span>
                {" — "}
                {user.email} · {user.department}
              </p>
            </div>

            <div className="hidden shrink-0 sm:flex">
              <button
                onClick={() => onEdit?.(user.id)}
                className="rounded-full bg-[#145d66] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#0e4d55]"
              >
                Edit access
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

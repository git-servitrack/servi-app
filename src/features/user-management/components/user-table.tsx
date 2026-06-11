"use client";

import { useMemo, useState } from "react";

import { TablePagination } from "@/components/shared/table-pagination";
import { authRoles } from "@/features/auth/data/auth-roles";
import { UserStatusBadge } from "@/features/user-management/components/user-status-badge";
import type { UserManagementRecord } from "@/features/user-management/types/user-management";

const PAGE_SIZE = 10;

const STATUS_COLORS: Record<string, string> = {
  Active: "#059669",
  "Pending Activation": "#d97706",
  Suspended: "#dc2626",
};

interface UserTableProps {
  users: UserManagementRecord[];
  onEdit?: (userId: string) => void;
  onDelete?: (userId: string) => void;
}

export function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(users.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;

    return users.slice(start, start + PAGE_SIZE);
  }, [users, currentPage]);

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
    <>
      <div className="divide-y divide-slate-100 dark:divide-white/6">
        {paginatedUsers.map((user) => {
          const role = authRoles.find((r) => r.id === user.roleId);

          return (
            <div
              key={user.id}
              className="grid items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50/50 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto_auto] sm:gap-4 sm:px-6 sm:py-4 dark:hover:bg-white/3"
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: STATUS_COLORS[user.status] ?? "#64748b" }}
              >
                {user.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-stone-100">
                  {user.fullName}
                </p>
                <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-stone-400">
                  <span className="font-medium text-[#145d66] dark:text-[#86d0d8]">
                    {role?.shortLabel ?? user.roleId}
                  </span>
                  {" - "}
                  @{user.username} - {user.email}
                </p>
              </div>

              <div className="justify-self-start sm:justify-self-end">
                <UserStatusBadge status={user.status} />
              </div>

              <div className="flex shrink-0 items-center gap-2 justify-self-start sm:justify-self-end">
                {onDelete ? (
                  <button
                    onClick={() => onDelete(user.id)}
                    className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                ) : null}
                {onEdit ? (
                  <button
                    onClick={() => onEdit(user.id)}
                    className="rounded-full bg-[#145d66] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#0e4d55]"
                  >
                    Edit access
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={users.length}
        pageSize={PAGE_SIZE}
        itemLabel="users"
        onPageChange={setPage}
      />
    </>
  );
}

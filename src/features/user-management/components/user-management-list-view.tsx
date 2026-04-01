"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { authRoles } from "@/features/auth/data/auth-roles";
import { UserFormModal } from "@/features/user-management/components/user-form-modal";
import { UserTable } from "@/features/user-management/components/user-table";
import { defaultUserFormValues, userRecords } from "@/features/user-management/data/user-management";
import type { UserManagementFormValues } from "@/features/user-management/types/user-management";

const STAT_ITEMS = [
  { label: "Active", value: userRecords.filter((u) => u.status === "Active").length.toString(), color: "#059669" },
  { label: "Pending", value: userRecords.filter((u) => u.status === "Pending Activation").length.toString(), color: "#d97706" },
  { label: "Roles", value: authRoles.length.toString(), color: "#145d66" },
  { label: "Total Users", value: userRecords.length.toString(), color: "#1e293b" },
];

export function UserManagementListView() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [modalValues, setModalValues] = useState<UserManagementFormValues>(defaultUserFormValues);
  const [modalUserId, setModalUserId] = useState<string | undefined>();

  function handleCreate() {
    setModalMode("create");
    setModalValues(defaultUserFormValues);
    setModalUserId(undefined);
    setModalOpen(true);
  }

  function handleEdit(userId: string) {
    const user = userRecords.find((u) => u.id === userId);
    if (!user) return;
    setModalMode("edit");
    setModalValues({
      fullName: user.fullName,
      email: user.email,
      password: "temporary123",
      confirmPassword: "temporary123",
      department: user.department,
      roleId: user.roleId,
      status: user.status,
    });
    setModalUserId(user.id);
    setModalOpen(true);
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-stone-100">
              User Management
            </h1>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-stone-400">
              Provision workspace accounts, assign roles, and manage access.
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="flex w-fit items-center gap-1.5 rounded-full bg-[#145d66] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0e4d55] dark:hover:bg-[#1a7a86]"
          >
            <Plus className="h-4 w-4" />
            Create user
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {STAT_ITEMS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[20px] border border-slate-200 bg-white px-4 py-4 shadow-sm sm:rounded-[24px] sm:px-5 sm:py-5 dark:border-white/10 dark:bg-[#171815]"
            >
              <p className="text-sm font-medium text-slate-500 dark:text-stone-400">{stat.label}</p>
              <p className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:mt-4 sm:text-5xl dark:text-stone-100">
                {stat.value}
              </p>
              <div className="mt-3 h-1.5 w-12 rounded-full sm:mt-4" style={{ backgroundColor: stat.color, opacity: 0.5 }} />
            </div>
          ))}
        </div>

        <div className="mt-4 sm:mt-6">
          <div className="rounded-[20px] border border-dashed border-slate-300 bg-white/60 p-4 text-sm leading-6 text-slate-500 sm:rounded-[24px] sm:p-5 dark:border-white/10 dark:bg-white/3 dark:text-stone-400">
            Public self-service registration is removed. Use this module to create accounts, assign the correct role, and manage activation state.
          </div>
        </div>

        <div className="mt-4 sm:mt-6">
          <div className="rounded-[20px] border border-slate-200 bg-white shadow-sm sm:rounded-[24px] dark:border-white/10 dark:bg-[#171815]">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5 dark:border-white/8">
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-stone-100">
                  Workspace users
                </h2>
                <p className="mt-0.5 text-sm text-slate-400 dark:text-stone-500">
                  {userRecords.length} provisioned accounts
                </p>
              </div>
            </div>
            <UserTable users={userRecords} onEdit={handleEdit} />
          </div>
        </div>
      </div>

      <UserFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        values={modalValues}
        userId={modalUserId}
      />
    </div>
  );
}

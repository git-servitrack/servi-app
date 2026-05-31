"use client";

import { LoaderCircle, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { sileo } from "sileo";

import { ApiErrorAlert } from "@/components/feedback/api-error-alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { authRoles } from "@/features/auth/data/auth-roles";
import { UserFormModal } from "@/features/user-management/components/user-form-modal";
import { UserTable } from "@/features/user-management/components/user-table";
import { defaultUserFormValues } from "@/features/user-management/data/user-management";
import type {
  UserManagementFormValues,
  UserManagementRecord,
} from "@/features/user-management/types/user-management";
import { userManagementService } from "@/services";
import type { ApiErrorShape } from "@/services/http/types";

export function UserManagementListView() {
  const [users, setUsers] = useState<UserManagementRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiErrorShape | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [modalValues, setModalValues] = useState<UserManagementFormValues>(defaultUserFormValues);
  const [modalUserId, setModalUserId] = useState<string | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<UserManagementRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const statItems = useMemo(
    () => [
      {
        label: "Active",
        value: users.filter((u) => u.status === "Active").length.toString(),
        color: "#059669",
      },
      {
        label: "Pending",
        value: users.filter((u) => u.status === "Pending Activation").length.toString(),
        color: "#d97706",
      },
      { label: "Roles", value: authRoles.length.toString(), color: "#145d66" },
      { label: "Total Users", value: users.length.toString(), color: "#1e293b" },
    ],
    [users],
  );

  useEffect(() => {
    let active = true;

    async function loadUsers() {
      const result = await userManagementService.list();

      if (!active) return;

      if (result.error) {
        setError(result.error);
        setUsers([]);
      } else {
        setError(null);
        setUsers(result.data);
      }

      setIsLoading(false);
    }

    void loadUsers();

    return () => {
      active = false;
    };
  }, []);

  async function refreshUsers() {
    const result = await userManagementService.list();

    if (result.error) {
      setError(result.error);
      return;
    }

    setError(null);
    setUsers(result.data);
  }

  function handleCreate() {
    setModalMode("create");
    setModalValues(defaultUserFormValues);
    setModalUserId(undefined);
    setModalOpen(true);
  }

  function handleEdit(userId: string) {
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    setModalMode("edit");
    setModalValues({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      email: user.email,
      password: "temporary123",
      confirmPassword: "temporary123",
      roleId: user.roleId,
    });
    setModalUserId(user.id);
    setModalOpen(true);
  }

  function handleDelete(userId: string) {
    const user = users.find((item) => item.id === userId);
    if (!user) return;

    setDeleteTarget(user);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    setIsDeleting(true);

    const deletedUser = await sileo
      .promise(
        async () => {
          const result = await userManagementService.delete(deleteTarget.id);

          if (result.error) {
            throw result.error;
          }

          return result.data;
        },
        {
          loading: {
            title: "Deleting user...",
            description: `Removing ${deleteTarget.fullName} from Servi.`,
          },
          success: {
            title: "User deleted",
            description: `${deleteTarget.fullName} was removed successfully.`,
          },
          error: (errorValue) => ({
            title: "Delete failed",
            description:
              typeof errorValue === "object" && errorValue !== null && "message" in errorValue
                ? String((errorValue as { message?: unknown }).message)
                : "The user account could not be deleted.",
          }),
        },
      )
      .catch((errorValue: ApiErrorShape) => {
        setError(errorValue);
        return null;
      });

    setIsDeleting(false);

    if (!deletedUser) return;

    setUsers((current) => current.filter((user) => user.id !== deleteTarget.id));
    setError(null);
    setDeleteTarget(null);
  }

  async function handleModalSaved() {
    await refreshUsers();
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
          {statItems.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[20px] border border-slate-200 bg-white px-4 py-4 shadow-sm sm:rounded-[24px] sm:px-5 sm:py-5 dark:border-white/10 dark:bg-[#171815]"
            >
              <p className="text-sm font-medium text-slate-500 dark:text-stone-400">{stat.label}</p>
              <p className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:mt-4 sm:text-5xl dark:text-stone-100">
                {stat.value}
              </p>
              <div
                className="mt-3 h-1.5 w-12 rounded-full sm:mt-4"
                style={{ backgroundColor: stat.color, opacity: 0.5 }}
              />
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-3 sm:mt-6">
          {error ? <ApiErrorAlert message={error.message} /> : null}
        </div>

        <div className="mt-4 sm:mt-6">
          <div className="rounded-[20px] border border-slate-200 bg-white shadow-sm sm:rounded-[24px] dark:border-white/10 dark:bg-[#171815]">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5 dark:border-white/8">
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-stone-100">
                  Workspace users
                </h2>
                <p className="mt-0.5 text-sm text-slate-400 dark:text-stone-500">
                  {users.length} provisioned accounts
                </p>
              </div>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 px-6 py-16 text-sm text-slate-500 dark:text-stone-400">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Loading user accounts...
              </div>
            ) : (
              <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} />
            )}
          </div>
        </div>
      </div>

      <UserFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        values={modalValues}
        userId={modalUserId}
        onSaved={handleModalSaved}
      />

      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setDeleteTarget(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete user account?</DialogTitle>
            <DialogDescription>
              {deleteTarget
                ? `This will remove ${deleteTarget.fullName} from the workspace. This action cannot be undone.`
                : "This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting}
              className="flex h-11 items-center justify-center rounded-full border border-slate-200 px-5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-50 dark:border-white/10 dark:text-stone-300 dark:hover:bg-white/6"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="flex h-11 items-center justify-center gap-2 rounded-full bg-rose-500 px-5 text-sm font-semibold text-white transition-colors hover:bg-rose-600 disabled:pointer-events-none disabled:opacity-50"
            >
              {isDeleting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
              {isDeleting ? "Deleting..." : "Delete user"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

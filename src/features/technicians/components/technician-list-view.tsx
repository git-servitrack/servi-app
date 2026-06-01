"use client";

import { useEffect, useMemo, useState } from "react";
import { LoaderCircle, Plus } from "lucide-react";
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
import { TechnicianFormModal } from "@/features/technicians/components/technician-form-modal";
import { TechnicianTable } from "@/features/technicians/components/technician-table";
import { emptyTechnicianFormValues } from "@/features/technicians/data/technicians";
import { mapTechnicianToFormValues } from "@/features/technicians/lib/technicians";
import type { TechnicianFormValues, TechnicianRecord } from "@/features/technicians/types/technicians";
import { techniciansService } from "@/services";
import type { ApiErrorShape } from "@/services/http/types";

export function TechnicianListView() {
  const [technicians, setTechnicians] = useState<TechnicianRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiErrorShape | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [modalValues, setModalValues] = useState<TechnicianFormValues>(emptyTechnicianFormValues);
  const [modalTechId, setModalTechId] = useState<string | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<TechnicianRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const statItems = useMemo(
    () => [
      { label: "Available", value: technicians.filter((t) => t.status === "Available").length.toString(), color: "#059669" },
      { label: "On Assignment", value: technicians.filter((t) => t.status === "On Assignment").length.toString(), color: "#7c3aed" },
      { label: "Teams", value: new Set(technicians.map((t) => t.team)).size.toString(), color: "#145d66" },
      { label: "Total", value: technicians.length.toString(), color: "#1e293b" },
    ],
    [technicians],
  );

  async function loadTechnicians() {
    const result = await techniciansService.list();

    if (result.error) {
      setError(result.error);
      setTechnicians([]);
      return;
    }

    setError(null);
    setTechnicians(result.data);
  }

  useEffect(() => {
    let active = true;

    async function loadInitialData() {
      await loadTechnicians();

      if (active) {
        setIsLoading(false);
      }
    }

    void loadInitialData();

    return () => {
      active = false;
    };
  }, []);

  function handleCreate() {
    setModalMode("create");
    setModalValues(emptyTechnicianFormValues);
    setModalTechId(undefined);
    setModalOpen(true);
  }

  function handleEdit(technicianId: string) {
    const tech = technicians.find((t) => t.id === technicianId);
    if (!tech) return;
    setModalMode("edit");
    setModalValues(mapTechnicianToFormValues(tech));
    setModalTechId(tech.id);
    setModalOpen(true);
  }

  function handleDelete(technicianId: string) {
    const technician = technicians.find((item) => item.id === technicianId);
    if (!technician) return;

    setDeleteTarget(technician);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    setIsDeleting(true);

    const deletedTechnician = await sileo
      .promise(
        async () => {
          const result = await techniciansService.delete(deleteTarget.id);

          if (result.error) {
            throw result.error;
          }

          return result.data;
        },
        {
          loading: {
            title: "Deleting technician...",
            description: `Removing ${deleteTarget.name} from technician access.`,
          },
          success: {
            title: "Technician deleted",
            description: `${deleteTarget.name} was removed successfully.`,
          },
          error: (errorValue) => ({
            title: "Delete failed",
            description:
              typeof errorValue === "object" && errorValue !== null && "message" in errorValue
                ? String((errorValue as { message?: unknown }).message)
                : "The technician account could not be deleted.",
          }),
        },
      )
      .catch((errorValue: ApiErrorShape) => {
        setError(errorValue);
        return null;
      });

    setIsDeleting(false);

    if (!deletedTechnician) return;

    setTechnicians((current) => current.filter((technician) => technician.id !== deleteTarget.id));
    setError(null);
    setDeleteTarget(null);
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-stone-100">
              Technicians
            </h1>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-stone-400">
              Monitor technician availability, skill coverage, and assignment load.
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="flex w-fit items-center gap-1.5 rounded-full bg-[#145d66] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0e4d55] dark:hover:bg-[#1a7a86]"
          >
            <Plus className="h-4 w-4" />
            Create technician
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
              <div className="mt-3 h-1.5 w-12 rounded-full sm:mt-4" style={{ backgroundColor: stat.color, opacity: 0.5 }} />
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
                  Technician directory
                </h2>
                <p className="mt-0.5 text-sm text-slate-400 dark:text-stone-500">
                  {technicians.length} API technician accounts
                </p>
              </div>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 px-6 py-16 text-sm text-slate-500 dark:text-stone-400">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Loading technicians...
              </div>
            ) : (
              <TechnicianTable technicians={technicians} onEdit={handleEdit} onDelete={handleDelete} />
            )}
          </div>
        </div>
      </div>

      <TechnicianFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        values={modalValues}
        technicianId={modalTechId}
        onSaved={loadTechnicians}
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
            <DialogTitle>Delete technician account?</DialogTitle>
            <DialogDescription>
              {deleteTarget
                ? `This will remove ${deleteTarget.name} from technician access. This action cannot be undone.`
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
              {isDeleting ? "Deleting..." : "Delete technician"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

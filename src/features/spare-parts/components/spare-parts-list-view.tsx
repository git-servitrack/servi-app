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
import { SparePartFormModal } from "@/features/spare-parts/components/spare-part-form-modal";
import { SparePartsTable } from "@/features/spare-parts/components/spare-parts-table";
import { emptySparePartFormValues } from "@/features/spare-parts/data/spare-parts";
import { mapSparePartToFormValues } from "@/features/spare-parts/lib/spare-parts";
import type {
  SparePartFormOptions,
  SparePartFormValues,
  SparePartRecord,
} from "@/features/spare-parts/types/spare-parts";
import { authService, sparePartsService } from "@/services";
import type { UserRoleId } from "@/features/auth/types/auth";
import type { ApiErrorShape } from "@/services/http/types";

const emptyOptions: SparePartFormOptions = {
  categories: [],
  assets: [],
  maintenanceJobs: [],
};

function buildCreateValues(options: SparePartFormOptions): SparePartFormValues {
  return {
    ...emptySparePartFormValues,
    category: options.categories.find((category) => category.isActive)?.id ?? options.categories[0]?.id ?? "",
  };
}

export function SparePartsListView() {
  const [parts, setParts] = useState<SparePartRecord[]>([]);
  const [lowStockParts, setLowStockParts] = useState<SparePartRecord[]>([]);
  const [options, setOptions] = useState<SparePartFormOptions>(emptyOptions);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiErrorShape | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [modalValues, setModalValues] = useState<SparePartFormValues>(emptySparePartFormValues);
  const [modalPartId, setModalPartId] = useState<string | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<SparePartRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [roleId, setRoleId] = useState<UserRoleId | null>(null);
  const canManageParts = roleId === "admin-operator" || roleId === "head-technician" || roleId === "warehouse-staff";
  const canDeleteParts = roleId === "admin-operator";

  const statItems = useMemo(
    () => [
      { label: "In Stock", value: parts.filter((p) => p.status === "In Stock").length.toString(), color: "#059669" },
      { label: "Needs Attention", value: lowStockParts.length.toString(), color: "#d97706" },
      { label: "Reserved Units", value: parts.reduce((total, part) => total + part.reservedStock, 0).toString(), color: "#145d66" },
      { label: "Total Parts", value: parts.length.toString(), color: "#1e293b" },
    ],
    [lowStockParts.length, parts],
  );

  async function loadSpareParts() {
    const [userResult, partsResult, lowStockResult, optionsResult] = await Promise.all([
      authService.getCurrentUser(),
      sparePartsService.list(),
      sparePartsService.lowStock(),
      sparePartsService.formOptions(),
    ]);

    if (!userResult.error) {
      setRoleId(userResult.data.session.roleId);
    }

    if (partsResult.error) {
      setError(partsResult.error);
      setParts([]);
    } else {
      setParts(partsResult.data);
    }

    if (lowStockResult.error) {
      setError(lowStockResult.error);
      setLowStockParts([]);
    } else {
      setLowStockParts(lowStockResult.data);
    }

    if (optionsResult.error) {
      setError(optionsResult.error);
      setOptions(emptyOptions);
    } else {
      setOptions(optionsResult.data);
    }

    if (!userResult.error && !partsResult.error && !lowStockResult.error && !optionsResult.error) {
      setError(null);
    }
  }

  useEffect(() => {
    let active = true;

    async function loadInitialData() {
      await loadSpareParts();

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
    setModalValues(buildCreateValues(options));
    setModalPartId(undefined);
    setModalOpen(true);
  }

  function handleEdit(partId: string) {
    const part = parts.find((p) => p.id === partId);
    if (!part) return;

    setModalMode("edit");
    setModalValues(mapSparePartToFormValues(part));
    setModalPartId(part.id);
    setModalOpen(true);
  }

  function handleDelete(partId: string) {
    const part = parts.find((item) => item.id === partId);
    if (!part) return;

    setDeleteTarget(part);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    setIsDeleting(true);

    const deletedPart = await sileo
      .promise(
        async () => {
          const result = await sparePartsService.delete(deleteTarget.id);

          if (result.error) {
            throw result.error;
          }

          return result.data;
        },
        {
          loading: {
            title: "Deleting spare part...",
            description: `Removing ${deleteTarget.name} from inventory.`,
          },
          success: {
            title: "Spare part deleted",
            description: `${deleteTarget.name} was removed successfully.`,
          },
          error: (errorValue) => ({
            title: "Delete failed",
            description:
              typeof errorValue === "object" && errorValue !== null && "message" in errorValue
                ? String((errorValue as { message?: unknown }).message)
                : "The spare part could not be deleted.",
          }),
        },
      )
      .catch((errorValue: ApiErrorShape) => {
        setError(errorValue);
        return null;
      });

    setIsDeleting(false);

    if (!deletedPart) return;

    setParts((current) => current.filter((part) => part.id !== deleteTarget.id));
    setLowStockParts((current) => current.filter((part) => part.id !== deleteTarget.id));
    setError(null);
    setDeleteTarget(null);
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-stone-100">
              Spare Parts
            </h1>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-stone-400">
              Track stock health, reservations, and part availability.
            </p>
          </div>
          {canManageParts ? (
            <button
              onClick={handleCreate}
              disabled={options.categories.length === 0}
              className="flex w-fit items-center gap-1.5 rounded-full bg-[#145d66] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0e4d55] disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-[#1a7a86]"
            >
              <Plus className="h-4 w-4" />
              Create spare part
            </button>
          ) : null}
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
          {!isLoading && options.categories.length === 0 ? (
            <ApiErrorAlert message="Create an active category before adding spare parts." />
          ) : null}
        </div>

        <div className="mt-4 sm:mt-6">
          <div className="rounded-[20px] border border-slate-200 bg-white shadow-sm sm:rounded-[24px] dark:border-white/10 dark:bg-[#171815]">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5 dark:border-white/8">
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-stone-100">
                  Inventory listing
                </h2>
                <p className="mt-0.5 text-sm text-slate-400 dark:text-stone-500">
                  {parts.length} API-backed stocked parts
                </p>
              </div>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 px-6 py-16 text-sm text-slate-500 dark:text-stone-400">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Loading spare parts...
              </div>
            ) : (
              <SparePartsTable
                parts={parts}
                onEdit={handleEdit}
                onDelete={handleDelete}
                canEdit={canManageParts}
                canDelete={canDeleteParts}
              />
            )}
          </div>
        </div>
      </div>

      <SparePartFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        values={modalValues}
        partId={modalPartId}
        categoryOptions={options.categories}
        assetOptions={options.assets}
        onSaved={loadSpareParts}
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
            <DialogTitle>Delete spare part?</DialogTitle>
            <DialogDescription>
              {deleteTarget
                ? `This will remove ${deleteTarget.name} from inventory. This action cannot be undone.`
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
              {isDeleting ? "Deleting..." : "Delete spare part"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

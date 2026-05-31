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
import { CategoryFormModal } from "@/features/categories/components/category-form-modal";
import { CategoryTable } from "@/features/categories/components/category-table";
import { emptyCategoryFormValues } from "@/features/categories/data/categories";
import type { CategoryFormValues, CategoryRecord } from "@/features/categories/types/categories";
import { categoriesService } from "@/services";
import type { ApiErrorShape } from "@/services/http/types";

function mapCategoryToFormValues(category: CategoryRecord): CategoryFormValues {
  return {
    name: category.name,
    code: category.code,
    description: category.description === "No description provided." ? "" : category.description,
    isActive: category.isActive,
  };
}

export function CategoryListView() {
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiErrorShape | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [modalValues, setModalValues] = useState<CategoryFormValues>(emptyCategoryFormValues);
  const [modalCategoryId, setModalCategoryId] = useState<string | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<CategoryRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const statItems = useMemo(
    () => [
      { label: "Active", value: categories.filter((category) => category.isActive).length.toString(), color: "#145d66" },
      { label: "Inactive", value: categories.filter((category) => !category.isActive).length.toString(), color: "#64748b" },
      { label: "Total Categories", value: categories.length.toString(), color: "#1e293b" },
    ],
    [categories],
  );

  async function loadCategories() {
    const result = await categoriesService.list();

    if (result.error) {
      setError(result.error);
      setCategories([]);
      return;
    }

    setError(null);
    setCategories(result.data);
  }

  useEffect(() => {
    let active = true;

    async function loadInitialData() {
      await loadCategories();

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
    setModalValues(emptyCategoryFormValues);
    setModalCategoryId(undefined);
    setModalOpen(true);
  }

  function handleEdit(category: CategoryRecord) {
    setModalMode("edit");
    setModalValues(mapCategoryToFormValues(category));
    setModalCategoryId(category.id);
    setModalOpen(true);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    setIsDeleting(true);

    const deletedCategory = await sileo
      .promise(
        async () => {
          const result = await categoriesService.delete(deleteTarget.id);

          if (result.error) {
            throw result.error;
          }

          return result.data;
        },
        {
          loading: {
            title: "Deleting category...",
            description: `Removing ${deleteTarget.name} from category records.`,
          },
          success: {
            title: "Category deleted",
            description: `${deleteTarget.name} was removed successfully.`,
          },
          error: (errorValue) => ({
            title: "Delete failed",
            description:
              typeof errorValue === "object" && errorValue !== null && "message" in errorValue
                ? String((errorValue as { message?: unknown }).message)
                : "The category could not be deleted.",
          }),
        },
      )
      .catch((errorValue: ApiErrorShape) => {
        setError(errorValue);
        return null;
      });

    setIsDeleting(false);

    if (!deletedCategory) return;

    setCategories((current) => current.filter((category) => category.id !== deleteTarget.id));
    setError(null);
    setDeleteTarget(null);
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-stone-100">
              Category
            </h1>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-stone-400">
              Manage reusable categories for assets, spare parts, and operational records.
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="flex w-fit items-center gap-1.5 rounded-full bg-[#145d66] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0e4d55] dark:hover:bg-[#1a7a86]"
          >
            <Plus className="h-4 w-4" />
            Create category
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
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
                  Category records
                </h2>
                <p className="mt-0.5 text-sm text-slate-400 dark:text-stone-500">
                  {categories.length} reusable categories
                </p>
              </div>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 px-6 py-16 text-sm text-slate-500 dark:text-stone-400">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Loading categories...
              </div>
            ) : (
              <CategoryTable categories={categories} onEdit={handleEdit} onDelete={setDeleteTarget} />
            )}
          </div>
        </div>
      </div>

      <CategoryFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        values={modalValues}
        categoryId={modalCategoryId}
        onSaved={loadCategories}
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
            <DialogTitle>Delete category?</DialogTitle>
            <DialogDescription>
              {deleteTarget
                ? `This will remove ${deleteTarget.name}. Assets or spare parts using this category may need reassignment.`
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
              {isDeleting ? "Deleting..." : "Delete category"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

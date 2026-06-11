"use client";

import { useMemo, useState } from "react";

import { TablePagination } from "@/components/shared/table-pagination";
import { CategoryStatusBadge } from "@/features/categories/components/category-status-badge";
import type { CategoryRecord } from "@/features/categories/types/categories";

const PAGE_SIZE = 10;

interface CategoryTableProps {
  categories: CategoryRecord[];
  onEdit: (category: CategoryRecord) => void;
  onDelete: (category: CategoryRecord) => void;
}

export function CategoryTable({ categories, onEdit, onDelete }: CategoryTableProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(categories.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;

    return categories.slice(start, start + PAGE_SIZE);
  }, [categories, currentPage]);

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
        <p className="font-medium text-slate-900 dark:text-stone-100">No categories found</p>
        <p className="text-sm text-slate-400 dark:text-stone-500">
          Create categories before assigning them to assets and inventory records.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="divide-y divide-slate-100 dark:divide-white/6">
        {paginatedCategories.map((category) => (
          <div
            key={category.id}
            className="grid items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50/50 sm:grid-cols-[2.5rem_minmax(0,1fr)_7rem_auto] sm:gap-4 sm:px-6 sm:py-4 dark:hover:bg-white/3"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#145d66] text-[11px] font-bold text-white">
              {category.name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-stone-100">
                {category.name}
              </p>
              <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-stone-400">
                <span className="font-medium text-[#145d66] dark:text-[#86d0d8]">{category.code}</span>
                {" - "}
                {category.description}
              </p>
            </div>

            <div className="justify-self-start sm:justify-self-center">
              <CategoryStatusBadge isActive={category.isActive} />
            </div>

            <div className="flex shrink-0 items-center gap-2 justify-self-start sm:justify-self-end">
              <button
                onClick={() => onDelete(category)}
                className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-500/10"
              >
                Delete
              </button>
              <button
                onClick={() => onEdit(category)}
                className="rounded-full bg-[#145d66] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#0e4d55]"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={categories.length}
        pageSize={PAGE_SIZE}
        itemLabel="categories"
        onPageChange={setPage}
      />
    </>
  );
}

"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

const MAX_PAGE_BUTTONS = 5;

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  itemLabel: string;
  onPageChange: (page: number) => void;
}

function getPageNumbers(currentPage: number, totalPages: number) {
  const pageNumbers: number[] = [];
  let start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + MAX_PAGE_BUTTONS - 1);
  start = Math.max(1, end - MAX_PAGE_BUTTONS + 1);

  for (let pageNumber = start; pageNumber <= end; pageNumber += 1) {
    pageNumbers.push(pageNumber);
  }

  return pageNumbers;
}

export function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  itemLabel,
  onPageChange,
}: TablePaginationProps) {
  if (totalItems === 0) {
    return null;
  }

  const rangeStart = (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalItems);
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div className="flex flex-col items-stretch gap-4 border-t border-slate-100 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-white/8">
      <p className="text-center text-sm text-slate-500 dark:text-stone-400 sm:text-left">
        Showing{" "}
        <span className="font-semibold tabular-nums text-slate-800 dark:text-stone-200">{rangeStart}</span>
        -
        <span className="font-semibold tabular-nums text-slate-800 dark:text-stone-200">{rangeEnd}</span>
        <span className="text-slate-400 dark:text-stone-500"> of </span>
        <span className="font-semibold tabular-nums text-slate-800 dark:text-stone-200">{totalItems}</span>
        <span className="text-slate-400 dark:text-stone-500"> {itemLabel}</span>
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className="flex h-9 items-center gap-1 rounded-full border border-slate-200 px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40 dark:border-white/10 dark:text-stone-300 dark:hover:bg-white/6"
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </button>

        <div className="flex items-center gap-1">
          {pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              className={`flex h-9 min-w-9 items-center justify-center rounded-full text-sm font-semibold tabular-nums transition-colors ${
                pageNumber === currentPage
                  ? "bg-[#145d66] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 dark:text-stone-400 dark:hover:bg-white/8"
              }`}
            >
              {pageNumber}
            </button>
          ))}
        </div>

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          className="flex h-9 items-center gap-1 rounded-full border border-slate-200 px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40 dark:border-white/10 dark:text-stone-300 dark:hover:bg-white/6"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

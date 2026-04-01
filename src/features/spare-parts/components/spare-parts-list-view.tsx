"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { SparePartFormModal } from "@/features/spare-parts/components/spare-part-form-modal";
import { SparePartsTable } from "@/features/spare-parts/components/spare-parts-table";
import { emptySparePartFormValues, sparePartRecords } from "@/features/spare-parts/data/spare-parts";
import { mapSparePartToFormValues } from "@/features/spare-parts/lib/spare-parts";
import type { SparePartFormValues } from "@/features/spare-parts/types/spare-parts";

const STAT_ITEMS = [
  { label: "In Stock", value: sparePartRecords.filter((p) => p.status === "In Stock").length.toString(), color: "#059669" },
  { label: "Needs Attention", value: sparePartRecords.filter((p) => p.status !== "In Stock").length.toString(), color: "#d97706" },
  { label: "Reserved Units", value: sparePartRecords.reduce((t, p) => t + p.reservedStock, 0).toString(), color: "#145d66" },
  { label: "Total Parts", value: sparePartRecords.length.toString(), color: "#1e293b" },
];

export function SparePartsListView() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [modalValues, setModalValues] = useState<SparePartFormValues>(emptySparePartFormValues);
  const [modalPartId, setModalPartId] = useState<string | undefined>();

  function handleCreate() {
    setModalMode("create");
    setModalValues(emptySparePartFormValues);
    setModalPartId(undefined);
    setModalOpen(true);
  }

  function handleEdit(partId: string) {
    const part = sparePartRecords.find((p) => p.id === partId);
    if (!part) return;
    setModalMode("edit");
    setModalValues(mapSparePartToFormValues(part));
    setModalPartId(part.id);
    setModalOpen(true);
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
          <button
            onClick={handleCreate}
            className="flex w-fit items-center gap-1.5 rounded-full bg-[#145d66] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0e4d55] dark:hover:bg-[#1a7a86]"
          >
            <Plus className="h-4 w-4" />
            Create spare part
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
          <div className="rounded-[20px] border border-slate-200 bg-white shadow-sm sm:rounded-[24px] dark:border-white/10 dark:bg-[#171815]">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5 dark:border-white/8">
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-stone-100">
                  Inventory listing
                </h2>
                <p className="mt-0.5 text-sm text-slate-400 dark:text-stone-500">
                  {sparePartRecords.length} stocked parts
                </p>
              </div>
            </div>
            <SparePartsTable parts={sparePartRecords} onEdit={handleEdit} />
          </div>
        </div>
      </div>

      <SparePartFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        values={modalValues}
        partId={modalPartId}
      />
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Cog } from "lucide-react";

import { ROUTES } from "@/constants/routes";
import { LowStockIndicator } from "@/features/spare-parts/components/low-stock-indicator";
import { PartUsageSection } from "@/features/spare-parts/components/part-usage-section";
import { SparePartFormModal } from "@/features/spare-parts/components/spare-part-form-modal";
import { StockBadge } from "@/features/spare-parts/components/stock-badge";
import { StockMovementHistoryView } from "@/features/spare-parts/components/stock-movement-history-view";
import { mapSparePartToFormValues } from "@/features/spare-parts/lib/spare-parts";
import type { SparePartRecord } from "@/features/spare-parts/types/spare-parts";

export function SparePartDetailView({ part }: { part: SparePartRecord }) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <Link
          href={ROUTES.spareParts}
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-900 dark:text-stone-400 dark:hover:text-stone-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to spare parts
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#145d66]/10 dark:bg-[#145d66]/20">
              <Cog className="h-6 w-6 text-[#145d66] dark:text-[#86d0d8]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-stone-100">
                {part.name}
              </h1>
              <p className="mt-0.5 text-sm text-slate-500 dark:text-stone-400">
                {part.partNumber} · {part.category}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StockBadge status={part.status} />
            <button
              onClick={() => setEditOpen(true)}
              className="rounded-full bg-[#145d66] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0e4d55]"
            >
              Edit part
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {[
            { label: "Part Number", value: part.partNumber },
            { label: "Stock On Hand", value: `${part.stockOnHand} ${part.unit}` },
            { label: "Reserved", value: `${part.reservedStock} ${part.unit}` },
            { label: "Reorder Point", value: `${part.reorderPoint} ${part.unit}` },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-[20px] border border-slate-200 bg-white px-4 py-4 shadow-sm sm:rounded-[24px] sm:px-5 sm:py-5 dark:border-white/10 dark:bg-[#171815]"
            >
              <p className="text-sm font-medium text-slate-500 dark:text-stone-400">{item.label}</p>
              <p className="mt-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-stone-100">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 sm:mt-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[20px] border border-slate-200 bg-white shadow-sm sm:rounded-[24px] dark:border-white/10 dark:bg-[#171815]">
            <div className="border-b border-slate-100 px-5 py-4 sm:px-6 sm:py-5 dark:border-white/8">
              <h2 className="text-base font-semibold text-slate-900 dark:text-stone-100">Inventory profile</h2>
            </div>
            <div className="grid gap-px bg-slate-100 p-px md:grid-cols-2 dark:bg-white/6">
              {[
                { label: "Category", value: part.category },
                { label: "Site", value: part.site },
                { label: "Compatible Assets", value: part.compatibleAssets },
                { label: "Bin Location", value: part.binLocation },
                { label: "Supplier", value: part.supplier },
              ].map((item) => (
                <div key={item.label} className="bg-white p-4 dark:bg-[#171815]">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-stone-500">{item.label}</p>
                  <p className="mt-1.5 text-sm font-medium text-slate-900 dark:text-stone-100">{item.value}</p>
                </div>
              ))}
            </div>
            {part.notes ? (
              <div className="border-t border-slate-100 px-5 py-4 sm:px-6 dark:border-white/8">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-stone-500">Operational Notes</p>
                <p className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-stone-400">{part.notes}</p>
              </div>
            ) : null}
          </div>

          <div className="rounded-[20px] border border-slate-200 bg-white shadow-sm sm:rounded-[24px] dark:border-white/10 dark:bg-[#171815]">
            <div className="border-b border-slate-100 px-5 py-4 sm:px-6 sm:py-5 dark:border-white/8">
              <h2 className="text-base font-semibold text-slate-900 dark:text-stone-100">Stock signal</h2>
              <p className="mt-0.5 text-sm text-slate-400 dark:text-stone-500">Replenishment state</p>
            </div>
            <div className="space-y-4 px-5 py-5 sm:px-6">
              <LowStockIndicator stockOnHand={part.stockOnHand} reorderPoint={part.reorderPoint} />
              <p className="text-sm leading-6 text-slate-500 dark:text-stone-400">
                Available stock after reservations: <span className="font-semibold text-slate-900 dark:text-stone-100">{part.stockOnHand - part.reservedStock} {part.unit}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mt-6">
          <StockMovementHistoryView items={part.movements} />
        </div>

        <div className="mt-4 sm:mt-6">
          <PartUsageSection items={part.usage} />
        </div>
      </div>

      <SparePartFormModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        mode="edit"
        values={mapSparePartToFormValues(part)}
        partId={part.id}
      />
    </div>
  );
}

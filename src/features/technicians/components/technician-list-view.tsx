"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { TechnicianFormModal } from "@/features/technicians/components/technician-form-modal";
import { TechnicianTable } from "@/features/technicians/components/technician-table";
import { emptyTechnicianFormValues, technicianRecords } from "@/features/technicians/data/technicians";
import { mapTechnicianToFormValues } from "@/features/technicians/lib/technicians";
import type { TechnicianFormValues } from "@/features/technicians/types/technicians";

const STAT_ITEMS = [
  { label: "Available", value: technicianRecords.filter((t) => t.status === "Available").length.toString(), color: "#059669" },
  { label: "On Assignment", value: technicianRecords.filter((t) => t.status === "On Assignment").length.toString(), color: "#7c3aed" },
  { label: "Teams", value: new Set(technicianRecords.map((t) => t.team)).size.toString(), color: "#145d66" },
  { label: "Total", value: technicianRecords.length.toString(), color: "#1e293b" },
];

export function TechnicianListView() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [modalValues, setModalValues] = useState<TechnicianFormValues>(emptyTechnicianFormValues);
  const [modalTechId, setModalTechId] = useState<string | undefined>();

  function handleCreate() {
    setModalMode("create");
    setModalValues(emptyTechnicianFormValues);
    setModalTechId(undefined);
    setModalOpen(true);
  }

  function handleEdit(technicianId: string) {
    const tech = technicianRecords.find((t) => t.id === technicianId);
    if (!tech) return;
    setModalMode("edit");
    setModalValues(mapTechnicianToFormValues(tech));
    setModalTechId(tech.id);
    setModalOpen(true);
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
                  Technician directory
                </h2>
                <p className="mt-0.5 text-sm text-slate-400 dark:text-stone-500">
                  {technicianRecords.length} profiles
                </p>
              </div>
            </div>
            <TechnicianTable technicians={technicianRecords} onEdit={handleEdit} />
          </div>
        </div>
      </div>

      <TechnicianFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        values={modalValues}
        technicianId={modalTechId}
      />
    </div>
  );
}

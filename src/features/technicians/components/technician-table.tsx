import Link from "next/link";

import { TechnicianStatusBadge } from "@/features/technicians/components/technician-status-badge";
import { getTechnicianDetailRoute } from "@/features/technicians/lib/technicians";
import type { TechnicianRecord } from "@/features/technicians/types/technicians";

const STATUS_COLORS: Record<string, string> = {
  Available: "#059669",
  "On Assignment": "#7c3aed",
  "Off Shift": "#64748b",
  Leave: "#d97706",
};

interface TechnicianTableProps {
  technicians: TechnicianRecord[];
  onEdit?: (technicianId: string) => void;
}

export function TechnicianTable({ technicians, onEdit }: TechnicianTableProps) {
  if (technicians.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
        <p className="font-medium text-slate-900 dark:text-stone-100">No technicians found</p>
        <p className="text-sm text-slate-400 dark:text-stone-500">
          Add a technician profile to start building assignment coverage.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100 dark:divide-white/6">
      {technicians.map((tech) => (
        <div
          key={tech.id}
          className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50/50 sm:gap-4 sm:px-6 sm:py-4 dark:hover:bg-white/3"
        >
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: STATUS_COLORS[tech.status] ?? "#64748b" }}
          >
            {tech.name.split(" ").map((n) => n[0]).join("")}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-stone-100">
                {tech.name}
              </p>
              <TechnicianStatusBadge status={tech.status} />
            </div>
            <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-stone-400">
              <span className="font-medium text-[#145d66] dark:text-[#86d0d8]">{tech.employeeId}</span>
              {" — "}
              {tech.team} · {tech.primarySkill} · {tech.workload.activeAssignments} active
            </p>
          </div>

          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <Link
              href={getTechnicianDetailRoute(tech.id)}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:text-stone-300 dark:hover:bg-white/6"
            >
              View
            </Link>
            <button
              onClick={() => onEdit?.(tech.id)}
              className="rounded-full bg-[#145d66] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#0e4d55]"
            >
              Edit
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

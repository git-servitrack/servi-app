import { getInitials } from "@/lib/utils";
import { TechnicianStatusBadge } from "@/features/technicians/components/technician-status-badge";
import type { TechnicianRecord } from "@/features/technicians/types/technicians";

export function TechnicianProfileCard({ technician }: { technician: TechnicianRecord }) {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-white shadow-sm sm:rounded-[24px] dark:border-white/10 dark:bg-[#171815]">
      <div className="border-b border-slate-100 px-4 py-5 sm:px-6 sm:py-6 dark:border-white/8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#145d66] text-lg font-bold text-white shadow-sm">
              {getInitials(technician.name)}
            </div>
            <div>
              <p className="text-sm text-slate-400 dark:text-stone-500">{technician.role}</p>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-stone-100">{technician.name}</h2>
              <p className="mt-0.5 text-xs font-medium uppercase tracking-widest text-[#145d66] dark:text-[#86d0d8]">{technician.employeeId}</p>
            </div>
          </div>
          <TechnicianStatusBadge status={technician.status} />
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-stone-400">{technician.bio}</p>
      </div>
      <div className="grid gap-px bg-slate-100 sm:grid-cols-2 xl:grid-cols-4 dark:bg-white/6">
        {[
          { label: "Team", value: technician.team },
          { label: "Primary Skill", value: technician.primarySkill },
          { label: "Coverage", value: technician.siteCoverage },
          { label: "Contact", value: technician.phone },
        ].map((item) => (
          <div key={item.label} className="bg-white px-4 py-4 sm:px-6 sm:py-5 dark:bg-[#171815]">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-stone-500">{item.label}</p>
            <p className="mt-1.5 text-sm font-medium text-slate-900 dark:text-stone-100">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

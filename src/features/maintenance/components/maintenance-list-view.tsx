import { maintenanceRecords } from "@/features/maintenance/data/maintenance";
import { MaintenanceTable } from "@/features/maintenance/components/maintenance-table";

const STAT_ITEMS = [
  {
    label: "Active Repairs",
    value: maintenanceRecords.filter((i) => i.status === "Repair In Progress").length.toString(),
    color: "#7c3aed",
  },
  {
    label: "Awaiting Parts",
    value: maintenanceRecords.filter((i) => i.status === "Awaiting Parts").length.toString(),
    color: "#d97706",
  },
  {
    label: "Ready / Done",
    value: maintenanceRecords.filter((i) => i.status === "Ready for QA" || i.status === "Completed").length.toString(),
    color: "#059669",
  },
  {
    label: "Total Orders",
    value: maintenanceRecords.length.toString(),
    color: "#1e293b",
  },
];

export function MaintenanceListView() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-stone-100">
            Maintenance
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-stone-400">
            Track work orders, assignment ownership, repair progress, and workflow readiness.
          </p>
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
                  Maintenance queue
                </h2>
                <p className="mt-0.5 text-sm text-slate-400 dark:text-stone-500">
                  {maintenanceRecords.length} work orders
                </p>
              </div>
            </div>
            <MaintenanceTable items={maintenanceRecords} />
          </div>
        </div>
      </div>
    </div>
  );
}

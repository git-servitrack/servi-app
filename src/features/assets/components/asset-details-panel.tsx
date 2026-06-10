import type { AssetRecord } from "@/features/assets/types/assets";

const detailSections = [
  { label: "Category", key: "category" },
  { label: "Asset Type", key: "assetType" },
  { label: "Site", key: "site" },
  { label: "Assigned Team", key: "assignedTeam" },
  { label: "Brand", key: "manufacturer" },
  { label: "Model", key: "model" },
  { label: "Serial Number", key: "serialNumber" },
  { label: "Quantity", key: "quantity" },
  { label: "UOM", key: "unitOfMeasure" },
  { label: "Supplier", key: "supplier" },
  { label: "Acquisition Date", key: "acquisitionDate" },
  { label: "Last Service", key: "lastServiceDate" },
  { label: "Next Service", key: "nextServiceDate" },
] as const;

export function AssetDetailsPanel({ asset }: { asset: AssetRecord }) {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-white shadow-sm sm:rounded-[24px] dark:border-white/10 dark:bg-[#171815]">
      <div className="border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5 dark:border-white/8">
        <h2 className="text-base font-semibold text-slate-900 dark:text-stone-100">
          Asset profile
        </h2>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500 dark:text-stone-400">
          {asset.condition}
        </p>
      </div>

      <div className="grid gap-px bg-slate-100 sm:grid-cols-2 xl:grid-cols-4 dark:bg-white/6">
        {detailSections.map((detail) => (
          <div key={detail.key} className="bg-white px-4 py-4 sm:px-6 sm:py-5 dark:bg-[#171815]">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-stone-500">
              {detail.label}
            </p>
            <p className="mt-1.5 text-sm font-medium text-slate-900 dark:text-stone-100">
              {asset[detail.key] ?? "N/A"}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-100 px-4 py-4 sm:px-6 sm:py-5 dark:border-white/8">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-stone-500">
          Notes
        </p>
        <p className="mt-1.5 text-sm leading-6 text-slate-700 dark:text-stone-300">
          {asset.notes}
        </p>
      </div>
    </div>
  );
}

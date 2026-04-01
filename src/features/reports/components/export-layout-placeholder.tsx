import { FileSpreadsheet, Printer } from "lucide-react";

export function ExportLayoutPlaceholder() {
  return (
    <div className="rounded-[20px] border border-[#145d66]/30 bg-linear-to-br from-[#145d66] to-[#0e3d44] p-5 text-white shadow-sm sm:rounded-[24px] sm:p-6">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-white/70">Export-ready layout</p>
      <h3 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">Reporting output</h3>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/85">
        Reserve this surface for PDF, spreadsheet, and print-specific compositions once server-generated exports are available.
      </p>
      <div className="mt-5 flex flex-wrap gap-2 sm:gap-3">
        <button
          type="button"
          className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/25"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Spreadsheet export
        </button>
        <button
          type="button"
          className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/25"
        >
          <Printer className="h-4 w-4" />
          Print layout
        </button>
      </div>
    </div>
  );
}

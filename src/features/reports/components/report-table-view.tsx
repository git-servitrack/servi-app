interface ReportTableViewProps {
  columns: string[];
  rows: string[][];
}

const ROW_ACCENTS = ["#145d66", "#059669", "#d97706", "#6366f1", "#dc2626", "#0891b2"];

export function ReportTableView({ columns, rows }: ReportTableViewProps) {
  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
        <p className="font-medium text-slate-900 dark:text-stone-100">No report rows</p>
        <p className="text-sm text-slate-400 dark:text-stone-500">Adjust filters or wait for analytics data.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/95 dark:border-white/8 dark:bg-white/4">
            {columns.map((column) => (
              <th
                key={column}
                className="whitespace-nowrap px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 first:pl-5 last:pr-5 dark:text-stone-500"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-white/6">
          {rows.map((row, rowIndex) => (
            <tr key={`${row.join("-")}-${rowIndex}`} className="transition-colors hover:bg-slate-50/80 dark:hover:bg-white/4">
              {row.map((cell, cellIndex) => (
                <td
                  key={`${cell}-${cellIndex}`}
                  className={`px-4 py-3.5 first:pl-5 last:pr-5 ${
                    cellIndex === 0
                      ? "font-semibold text-slate-900 dark:text-stone-100"
                      : "text-slate-600 dark:text-stone-400"
                  }`}
                >
                  {cellIndex === 0 ? (
                    <span className="flex items-center gap-3">
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                        style={{ backgroundColor: ROW_ACCENTS[rowIndex % ROW_ACCENTS.length] }}
                      >
                        {(cell.slice(0, 2) || "?").toUpperCase()}
                      </span>
                      <span>{cell}</span>
                    </span>
                  ) : (
                    cell
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

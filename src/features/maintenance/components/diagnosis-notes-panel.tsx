export function DiagnosisNotesPanel({ notes }: { notes: string }) {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-white shadow-sm sm:rounded-[24px] dark:border-white/10 dark:bg-[#171815]">
      <div className="border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5 dark:border-white/8">
        <h2 className="text-base font-semibold text-slate-900 dark:text-stone-100">Diagnosis notes</h2>
      </div>
      <div className="px-4 py-4 sm:px-6 sm:py-5">
        <p className="text-sm leading-7 text-slate-600 dark:text-stone-400">{notes}</p>
      </div>
    </div>
  );
}

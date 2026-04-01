interface ReportSectionCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function ReportSectionCard({ title, description, children }: ReportSectionCardProps) {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-white shadow-sm sm:rounded-[24px] dark:border-white/10 dark:bg-[#171815]">
      <div className="border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5 dark:border-white/8">
        <h2 className="text-base font-semibold text-slate-900 dark:text-stone-100">{title}</h2>
        <p className="mt-0.5 text-sm text-slate-400 dark:text-stone-500">{description}</p>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}

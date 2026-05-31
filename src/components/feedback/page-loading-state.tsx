interface PageLoadingStateProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function PageLoadingState({ eyebrow, title, description }: PageLoadingStateProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-5 text-slate-900 dark:bg-[#11120f] dark:text-stone-100">
      <div className="w-full max-w-md text-center" role="status" aria-live="polite">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#145d66] font-display text-2xl font-bold text-white shadow-[0_20px_60px_-28px_rgba(20,93,102,0.85)]">
          S
        </div>

        <div className="relative mx-auto mt-8 h-2 w-56 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
          <div className="absolute inset-y-0 left-0 w-24 animate-[servi-loader_1.2s_ease-in-out_infinite] rounded-full bg-[#145d66] dark:bg-[#86d0d8]" />
        </div>

        <p className="mt-8 text-[11px] font-semibold uppercase text-[#145d66] dark:text-[#86d0d8]">
          {eyebrow}
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-slate-900 dark:text-stone-100">
          {title}
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500 dark:text-stone-400">
          {description}
        </p>

        <div className="mt-8 grid grid-cols-3 gap-3">
          <span className="h-2 rounded-full bg-[#145d66]/25 dark:bg-[#86d0d8]/20" />
          <span className="h-2 rounded-full bg-[#145d66]/45 dark:bg-[#86d0d8]/35" />
          <span className="h-2 rounded-full bg-[#145d66]/25 dark:bg-[#86d0d8]/20" />
        </div>
      </div>
    </div>
  );
}

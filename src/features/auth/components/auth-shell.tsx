import Link from "next/link";
import { ClipboardList, ShieldCheck, Wrench } from "lucide-react";
import type { ReactNode } from "react";

interface AuthShellProps {
  children: ReactNode;
}

const FEATURES = [
  {
    icon: ClipboardList,
    title: "Service-first operations",
    description: "One workspace for service requests, maintenance tracking, and asset management.",
  },
  {
    icon: ShieldCheck,
    title: "Role-aware access",
    description: "Routing adapts to operators, technicians, supervisors, and management.",
  },
  {
    icon: Wrench,
    title: "Maintenance pipeline",
    description: "Track work orders from request through completion with full audit trail.",
  },
];

export function AuthShell({ children }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 lg:grid lg:grid-cols-[1fr_1fr] xl:grid-cols-[1.1fr_0.9fr]">
      <section className="relative hidden overflow-hidden bg-[#11120f] lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-0 top-0 h-[480px] w-[480px] -translate-x-1/4 -translate-y-1/4 rounded-full bg-[#145d66]/20 blur-[120px]" />
          <div className="absolute bottom-0 right-0 h-[300px] w-[300px] translate-x-1/4 translate-y-1/4 rounded-full bg-[#145d66]/10 blur-[100px]" />
        </div>

        <div className="relative px-10 pt-12">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#145d66] font-display text-sm font-bold text-white shadow-sm">
              SW
            </span>
            <div>
              <p className="text-[11px] tracking-[0.2em] text-[#86d0d8] uppercase">SERVI-WEB</p>
              <p className="text-sm font-semibold text-stone-100">Operations Workspace</p>
            </div>
          </Link>
        </div>

        <div className="relative px-10 py-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#86d0d8]">
            Secure access
          </p>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.08] text-stone-100 xl:text-5xl">
            Role-aware access for every operational lane.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-stone-400">
            Keep sign-in and onboarding clean while preserving the structure needed for system
            operators, technicians, requestors, supervisors, and management.
          </p>
        </div>

        <div className="relative border-t border-white/8 px-10 pb-12">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="flex items-start gap-4 border-b border-white/8 py-5 last:border-b-0"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/6">
                <feature.icon className="h-4 w-4 text-[#86d0d8]" />
              </span>
              <div>
                <p className="text-sm font-semibold text-stone-100">{feature.title}</p>
                <p className="mt-0.5 text-sm leading-6 text-stone-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-8 lg:px-10">
        <div className="w-full max-w-[420px]">
          <Link href="/" className="mb-8 inline-flex items-center gap-3 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#145d66] font-display text-sm font-bold text-white">
              SW
            </span>
            <div>
              <p className="text-[11px] tracking-[0.2em] text-[#145d66] uppercase">SERVI-WEB</p>
              <p className="text-sm font-semibold text-slate-900">Operations Workspace</p>
            </div>
          </Link>

          {children}

          <p className="mt-6 text-center text-xs text-slate-400">
            By continuing, you agree to our{" "}
            <span className="font-medium text-slate-500">Terms of Service</span> and{" "}
            <span className="font-medium text-slate-500">Privacy Policy</span>.
          </p>
        </div>
      </section>
    </main>
  );
}

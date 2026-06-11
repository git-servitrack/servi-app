import { ShieldCheck, Tags, UsersRound } from "lucide-react";
import Link from "next/link";

import { ROUTES } from "@/constants/routes";

const settingsItems = [
  {
    title: "Technicians",
    href: ROUTES.technicians,
    icon: ShieldCheck,
    description: "Manage technician profiles, workload visibility, histories, and scorecards.",
    meta: "Support operations",
  },
  {
    title: "User Management",
    href: ROUTES.userManagement,
    icon: UsersRound,
    description: "Provision workspace users, assign roles, and manage account access.",
    meta: "Admin access",
  },
  {
    title: "Category",
    href: ROUTES.category,
    icon: Tags,
    description: "Maintain asset, inventory, and service classification records.",
    meta: "Reference data",
  },
];

export function SettingsOverviewView() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-stone-100">
            Settings
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-slate-500 dark:text-stone-400">
            Centralized support administration for technicians, workspace users, and category records.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {settingsItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#145d66]/30 hover:shadow-md sm:rounded-[24px] dark:border-white/10 dark:bg-[#171815] dark:hover:border-[#86d0d8]/30"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#145d66]/10 transition-colors group-hover:bg-[#145d66] dark:bg-[#145d66]/20">
                  <Icon className="h-5 w-5 text-[#145d66] transition-colors group-hover:text-white dark:text-[#86d0d8]" />
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-stone-500">
                  {item.meta}
                </p>
                <h2 className="mt-1.5 text-lg font-bold text-slate-900 dark:text-stone-100">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-stone-400">
                  {item.description}
                </p>
                <span className="mt-5 inline-flex text-sm font-semibold text-[#145d66] dark:text-[#86d0d8]">
                  Open {item.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

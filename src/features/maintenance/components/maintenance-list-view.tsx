"use client";

import { LoaderCircle, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ApiErrorAlert } from "@/components/feedback/api-error-alert";
import { CreateMaintenanceModal } from "@/features/maintenance/components/create-maintenance-modal";
import { MaintenanceTable } from "@/features/maintenance/components/maintenance-table";
import type { MaintenanceRecord } from "@/features/maintenance/types/maintenance";
import { maintenanceService } from "@/services";
import type { ApiErrorShape } from "@/services/http/types";
import type { MaintenanceFormOptions } from "@/services/maintenance/contracts";

export function MaintenanceListView() {
  const [items, setItems] = useState<MaintenanceRecord[]>([]);
  const [options, setOptions] = useState<MaintenanceFormOptions>({
    technicians: [],
    serviceRequests: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiErrorShape | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const statItems = useMemo(
    () => [
      {
        label: "Active Repairs",
        value: items.filter((i) => i.status === "Repair In Progress").length.toString(),
        color: "#7c3aed",
      },
      {
        label: "Awaiting Parts",
        value: items.filter((i) => i.status === "Awaiting Parts").length.toString(),
        color: "#d97706",
      },
      {
        label: "On Hold",
        value: items.filter((i) => i.status === "On Hold").length.toString(),
        color: "#e11d48",
      },
      {
        label: "Total Orders",
        value: items.length.toString(),
        color: "#1e293b",
      },
    ],
    [items],
  );

  const loadMaintenance = useCallback(async () => {
    const [maintenanceResult, optionResult] = await Promise.all([
      maintenanceService.list(),
      maintenanceService.formOptions(),
    ]);

    if (maintenanceResult.error) {
      setError(maintenanceResult.error);
      setItems([]);
    } else {
      setItems(maintenanceResult.data);
    }

    if (optionResult.error) {
      setError(optionResult.error);
      setOptions({
        technicians: [],
        serviceRequests: [],
      });
    } else {
      setOptions(optionResult.data);
    }

    if (!maintenanceResult.error && !optionResult.error) {
      setError(null);
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function loadInitialData() {
      await loadMaintenance();

      if (active) {
        setIsLoading(false);
      }
    }

    void loadInitialData();

    return () => {
      active = false;
    };
  }, [loadMaintenance]);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-stone-100">
              Maintenance
            </h1>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-stone-400">
              Track work orders, assignment ownership, repair progress, and workflow readiness.
            </p>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            disabled={options.technicians.length === 0 || options.serviceRequests.length === 0}
            className="flex w-fit items-center gap-1.5 rounded-full bg-[#145d66] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0e4d55] disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-[#1a7a86]"
          >
            <Plus className="h-4 w-4" />
            Create maintenance
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {statItems.map((stat) => (
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

        <div className="mt-4 space-y-3 sm:mt-6">
          {error ? <ApiErrorAlert message={error.message} /> : null}
          {!isLoading && options.technicians.length === 0 ? (
            <ApiErrorAlert message="Create a user with the Technician role before opening maintenance work orders." />
          ) : null}
          {!isLoading && options.serviceRequests.length === 0 ? (
            <ApiErrorAlert message="Create a service request before opening a maintenance work order." />
          ) : null}
        </div>

        <div className="mt-4 sm:mt-6">
          <div className="rounded-[20px] border border-slate-200 bg-white shadow-sm sm:rounded-[24px] dark:border-white/10 dark:bg-[#171815]">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5 dark:border-white/8">
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-stone-100">
                  Maintenance queue
                </h2>
                <p className="mt-0.5 text-sm text-slate-400 dark:text-stone-500">
                  {items.length} work orders
                </p>
              </div>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 px-6 py-16 text-sm text-slate-500 dark:text-stone-400">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Loading maintenance work orders...
              </div>
            ) : (
              <MaintenanceTable items={items} />
            )}
          </div>
        </div>
      </div>
      <CreateMaintenanceModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        options={options}
        onSaved={loadMaintenance}
      />
    </div>
  );
}

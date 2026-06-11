"use client";

import Link from "next/link";
import { BrainCircuit, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { ROUTES } from "@/constants/routes";
import type { PredictiveMaintenanceRecord, PredictiveRiskLevel } from "@/features/predictive-maintenance/types/predictive-maintenance";
import { predictiveMaintenanceService } from "@/services";

const riskStyles: Record<PredictiveRiskLevel, string> = {
  Low: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:ring-emerald-800",
  Medium: "bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:ring-amber-800",
  High: "bg-orange-50 text-orange-700 ring-1 ring-orange-200 dark:bg-orange-950/30 dark:text-orange-300 dark:ring-orange-800",
  Critical: "bg-rose-50 text-rose-700 ring-1 ring-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:ring-rose-800",
};

interface PredictiveRiskContextCardProps {
  title: string;
  description: string;
  assetId?: string;
  serviceRequestId?: string;
  maintenanceId?: string;
}

async function loadPrediction({
  assetId,
  serviceRequestId,
  maintenanceId,
}: Pick<PredictiveRiskContextCardProps, "assetId" | "serviceRequestId" | "maintenanceId">) {
  if (maintenanceId) {
    const result = await predictiveMaintenanceService.listByMaintenance(maintenanceId);
    if (result.error || result.data.length > 0 || !serviceRequestId) return result;
  }

  if (serviceRequestId) {
    const result = await predictiveMaintenanceService.listByServiceRequest(serviceRequestId);
    if (result.error || result.data.length > 0 || !assetId) return result;
  }

  if (assetId) return predictiveMaintenanceService.listByAsset(assetId);

  return predictiveMaintenanceService.list({ limit: 1 });
}

export function PredictiveRiskContextCard({
  title,
  description,
  assetId,
  serviceRequestId,
  maintenanceId,
}: PredictiveRiskContextCardProps) {
  const [prediction, setPrediction] = useState<PredictiveMaintenanceRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadContext() {
      const result = await loadPrediction({ assetId, serviceRequestId, maintenanceId });

      if (!active) return;

      setPrediction(result.error ? null : result.data[0] ?? null);
      setIsLoading(false);
    }

    void loadContext();

    return () => {
      active = false;
    };
  }, [assetId, serviceRequestId, maintenanceId]);

  return (
    <div className="rounded-[20px] border border-slate-200 bg-white px-4 py-4 shadow-sm sm:rounded-[24px] sm:px-6 sm:py-6 dark:border-white/10 dark:bg-[#171815]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-4 w-4 text-[#145d66] dark:text-[#86d0d8]" />
            <h2 className="text-base font-semibold text-slate-900 dark:text-stone-100">{title}</h2>
          </div>
          <p className="mt-1 text-sm text-slate-400 dark:text-stone-500">{description}</p>
        </div>
        <Link
          href={ROUTES.predictiveMaintenance}
          className="shrink-0 rounded-full bg-[#145d66]/10 px-3 py-1 text-xs font-semibold text-[#145d66] transition-colors hover:bg-[#145d66]/15 dark:bg-[#145d66]/20 dark:text-[#86d0d8]"
        >
          Open
        </Link>
      </div>

      {isLoading ? (
        <div className="mt-5 flex items-center gap-2 text-sm text-slate-500 dark:text-stone-400">
          <LoaderCircle className="h-4 w-4 animate-spin" />
          Loading predictive context...
        </div>
      ) : prediction ? (
        <div className="mt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-4xl font-bold tracking-tight text-slate-900 dark:text-stone-100">
                {prediction.prediction.riskScore}%
              </p>
              <p className="mt-1 text-sm font-semibold text-[#145d66] dark:text-[#86d0d8]">
                {prediction.prediction.failureType}
              </p>
            </div>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${riskStyles[prediction.prediction.riskLevel]}`}>
              {prediction.prediction.riskLevel}
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-stone-400">
            {prediction.prediction.nextMaintenanceRecommendation}
          </p>
          <p className="mt-2 text-xs text-slate-400 dark:text-stone-500">
            Forecasted {prediction.createdAt}
          </p>
        </div>
      ) : (
        <p className="mt-5 text-sm leading-6 text-slate-500 dark:text-stone-400">
          No linked prediction yet. Run an asset-linked prediction to show risk context here.
        </p>
      )}
    </div>
  );
}

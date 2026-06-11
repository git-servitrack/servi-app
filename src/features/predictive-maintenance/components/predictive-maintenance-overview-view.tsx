import { PredictiveMaintenanceReportPanel } from "@/features/predictive-maintenance/components/predictive-maintenance-report-panel";

export function PredictiveMaintenanceOverviewView() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-stone-100">
            Predictive Maintenance
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-slate-500 dark:text-stone-400">
            Run machine-risk predictions, link readings to assets, train the decision tree, and review saved predictive results.
          </p>
        </div>

        <div className="mt-6 sm:mt-8">
          <PredictiveMaintenanceReportPanel />
        </div>
      </div>
    </div>
  );
}

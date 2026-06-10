"use client";

import { Activity, BrainCircuit, LoaderCircle, RefreshCw, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { sileo } from "sileo";

import { ApiErrorAlert } from "@/components/feedback/api-error-alert";
import type {
  PredictiveAssetOption,
  PredictiveFeatureValues,
  PredictiveMaintenanceRecord,
  PredictiveRiskLevel,
  PredictiveTrainingResult,
  PredictiveTrainValues,
} from "@/features/predictive-maintenance/types/predictive-maintenance";
import { predictiveMaintenanceService } from "@/services";
import type { ApiErrorShape } from "@/services/http/types";

const initialFeatureValues: PredictiveFeatureValues = {
  type: "M",
  airTemperature: "298",
  processTemperature: "308",
  rotationalSpeed: "1450",
  torque: "42",
  toolWear: "120",
  assetId: "",
};

const initialTrainValues: PredictiveTrainValues = {
  validationRatio: "",
  maxDepth: "",
  minNumSamples: "",
};

const riskStyles: Record<PredictiveRiskLevel, string> = {
  Low: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:ring-emerald-800",
  Medium: "bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:ring-amber-800",
  High: "bg-orange-50 text-orange-700 ring-1 ring-orange-200 dark:bg-orange-950/30 dark:text-orange-300 dark:ring-orange-800",
  Critical: "bg-rose-50 text-rose-700 ring-1 ring-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:ring-rose-800",
};

const inputClass =
  "flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100 dark:placeholder:text-stone-500";
const selectClass =
  "flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100";

function isPositiveNumber(value: string) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) && numberValue > 0;
}

function isNonNegativeNumber(value: string) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) && numberValue >= 0;
}

function validateFeatures(values: PredictiveFeatureValues) {
  if (!Number.isFinite(Number(values.airTemperature))) return "Air temperature must be a valid number.";
  if (!Number.isFinite(Number(values.processTemperature))) return "Process temperature must be a valid number.";
  if (!isPositiveNumber(values.rotationalSpeed)) return "Rotational speed must be greater than zero.";
  if (!isNonNegativeNumber(values.torque)) return "Torque cannot be negative.";
  if (!isNonNegativeNumber(values.toolWear)) return "Tool wear cannot be negative.";

  return null;
}

function getAssetLabel(asset: PredictiveAssetOption) {
  return `${asset.name} (${asset.code}) - ${asset.site}`;
}

export function PredictiveMaintenanceReportPanel() {
  const [values, setValues] = useState<PredictiveFeatureValues>(initialFeatureValues);
  const [trainValues, setTrainValues] = useState<PredictiveTrainValues>(initialTrainValues);
  const [assets, setAssets] = useState<PredictiveAssetOption[]>([]);
  const [predictions, setPredictions] = useState<PredictiveMaintenanceRecord[]>([]);
  const [latestPrediction, setLatestPrediction] = useState<PredictiveMaintenanceRecord | null>(null);
  const [trainingResult, setTrainingResult] = useState<PredictiveTrainingResult | null>(null);
  const [error, setError] = useState<ApiErrorShape | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPredicting, setIsPredicting] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const summary = useMemo(() => {
    const critical = predictions.filter((item) => item.prediction.riskLevel === "Critical").length;
    const high = predictions.filter((item) => item.prediction.riskLevel === "High").length;
    const averageRisk =
      predictions.length === 0
        ? 0
        : Math.round(predictions.reduce((total, item) => total + item.prediction.riskScore, 0) / predictions.length);

    return {
      critical,
      high,
      averageRisk,
    };
  }, [predictions]);

  async function loadPredictiveData() {
    const [predictionResult, assetResult] = await Promise.all([
      predictiveMaintenanceService.list(),
      predictiveMaintenanceService.assetOptions(),
    ]);

    if (predictionResult.error) {
      setError(predictionResult.error);
      setPredictions([]);
    } else {
      setPredictions(predictionResult.data);
      setLatestPrediction((current) => current ?? predictionResult.data[0] ?? null);
    }

    if (assetResult.error) {
      setError(assetResult.error);
      setAssets([]);
    } else {
      setAssets(assetResult.data);
    }

    if (!predictionResult.error && !assetResult.error) {
      setError(null);
    }
  }

  useEffect(() => {
    let active = true;

    async function loadInitialData() {
      await loadPredictiveData();

      if (active) {
        setIsLoading(false);
      }
    }

    void loadInitialData();

    return () => {
      active = false;
    };
  }, []);

  function updateValue<TKey extends keyof PredictiveFeatureValues>(
    field: TKey,
    value: PredictiveFeatureValues[TKey],
  ) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateTrainValue<TKey extends keyof PredictiveTrainValues>(
    field: TKey,
    value: PredictiveTrainValues[TKey],
  ) {
    setTrainValues((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handlePredict(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validateFeatures(values);
    if (validationError) {
      setError({
        code: "VALIDATION_ERROR",
        message: validationError,
      });
      return;
    }

    setIsPredicting(true);
    setError(null);

    const prediction = await sileo
      .promise(
        async () => {
          const result = values.assetId
            ? await predictiveMaintenanceService.predictAsset(values.assetId, values)
            : await predictiveMaintenanceService.predict(values);

          if (result.error) {
            throw result.error;
          }

          return result.data.prediction;
        },
        {
          loading: {
            title: "Running prediction...",
            description: values.assetId ? "Analyzing linked asset readings." : "Analyzing manual machine readings.",
          },
          success: (response) => ({
            title: "Prediction complete",
            description: `${response.prediction.riskLevel} risk - ${response.prediction.failureType}`,
          }),
          error: (errorValue) => ({
            title: "Prediction failed",
            description:
              typeof errorValue === "object" && errorValue !== null && "message" in errorValue
                ? String((errorValue as { message?: unknown }).message)
                : "The predictive maintenance model could not process this reading.",
          }),
        },
      )
      .catch((errorValue: ApiErrorShape) => {
        setError(errorValue);
        return null;
      });

    setIsPredicting(false);

    if (!prediction) return;

    setLatestPrediction(prediction);
    setPredictions((current) => [prediction, ...current.filter((item) => item.id !== prediction.id)]);
  }

  async function handleTrain() {
    setIsTraining(true);
    setError(null);

    const training = await sileo
      .promise(
        async () => {
          const result = await predictiveMaintenanceService.train(trainValues);

          if (result.error) {
            throw result.error;
          }

          return result.data.training;
        },
        {
          loading: {
            title: "Training model...",
            description: "Refreshing decision tree parameters.",
          },
          success: (response) => ({
            title: "Model trained",
            description: `Version ${response.version} is ready.`,
          }),
          error: (errorValue) => ({
            title: "Training failed",
            description:
              typeof errorValue === "object" && errorValue !== null && "message" in errorValue
                ? String((errorValue as { message?: unknown }).message)
                : "The model could not be trained.",
          }),
        },
      )
      .catch((errorValue: ApiErrorShape) => {
        setError(errorValue);
        return null;
      });

    setIsTraining(false);

    if (training) {
      setTrainingResult(training);
    }
  }

  async function handleDelete(predictionId: string) {
    setDeletingId(predictionId);

    const deleted = await sileo
      .promise(
        async () => {
          const result = await predictiveMaintenanceService.delete(predictionId);

          if (result.error) {
            throw result.error;
          }

          return result.data;
        },
        {
          loading: {
            title: "Deleting prediction...",
            description: "Removing saved predictive result.",
          },
          success: {
            title: "Prediction deleted",
            description: "The saved result was removed.",
          },
          error: (errorValue) => ({
            title: "Delete failed",
            description:
              typeof errorValue === "object" && errorValue !== null && "message" in errorValue
                ? String((errorValue as { message?: unknown }).message)
                : "The prediction could not be deleted.",
          }),
        },
      )
      .catch((errorValue: ApiErrorShape) => {
        setError(errorValue);
        return null;
      });

    setDeletingId(null);

    if (!deleted) return;

    setPredictions((current) => current.filter((item) => item.id !== predictionId));
    setLatestPrediction((current) => (current?.id === predictionId ? null : current));
  }

  return (
    <section className="rounded-[20px] border border-slate-200 bg-white shadow-sm sm:rounded-[24px] dark:border-white/10 dark:bg-[#171815]">
      <div className="border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5 dark:border-white/8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-stone-100">
              Predictive maintenance
            </h2>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500 dark:text-stone-400">
              Run a decision-tree prediction from machine readings, optionally tie it to an asset, and review recent risk results.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadPredictiveData()}
            disabled={isLoading}
            className="flex h-10 w-fit items-center justify-center gap-2 rounded-full border border-slate-200 px-4 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-50 dark:border-white/10 dark:text-stone-300 dark:hover:bg-white/6"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
        </div>
      </div>

      <div className="space-y-5 px-4 py-4 sm:px-6 sm:py-5">
        {error ? <ApiErrorAlert message={error.message} /> : null}

        <div className="grid gap-3 sm:grid-cols-3">
          <MiniMetric label="Critical risks" value={summary.critical.toString()} color="#e11d48" />
          <MiniMetric label="High risks" value={summary.high.toString()} color="#f97316" />
          <MiniMetric label="Average score" value={`${summary.averageRisk}%`} color="#145d66" />
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.75fr)]">
          <form className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-white/10 dark:bg-white/4" onSubmit={handlePredict}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#145d66]/10 dark:bg-[#145d66]/20">
                <BrainCircuit className="h-5 w-5 text-[#145d66] dark:text-[#86d0d8]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-stone-100">Manual prediction</h3>
                <p className="text-xs text-slate-500 dark:text-stone-400">Use Kaggle-style machine readings. Temperatures are Kelvin.</p>
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <FieldShell label="Linked asset">
                <select
                  value={values.assetId}
                  onChange={(event) => updateValue("assetId", event.target.value)}
                  className={selectClass}
                >
                  <option value="">Manual reading only</option>
                  {assets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {getAssetLabel(asset)}
                    </option>
                  ))}
                </select>
              </FieldShell>
              <FieldShell label="Machine type">
                <select
                  value={values.type}
                  onChange={(event) => updateValue("type", event.target.value as PredictiveFeatureValues["type"])}
                  className={selectClass}
                >
                  <option value="L">Low quality / light duty</option>
                  <option value="M">Medium quality / standard duty</option>
                  <option value="H">High quality / heavy duty</option>
                </select>
              </FieldShell>
              <FieldShell label="Air temperature">
                <input
                  value={values.airTemperature}
                  onChange={(event) => updateValue("airTemperature", event.target.value)}
                  className={inputClass}
                  inputMode="decimal"
                  placeholder="298"
                />
              </FieldShell>
              <FieldShell label="Process temperature">
                <input
                  value={values.processTemperature}
                  onChange={(event) => updateValue("processTemperature", event.target.value)}
                  className={inputClass}
                  inputMode="decimal"
                  placeholder="308"
                />
              </FieldShell>
              <FieldShell label="Rotational speed (rpm)">
                <input
                  value={values.rotationalSpeed}
                  onChange={(event) => updateValue("rotationalSpeed", event.target.value)}
                  className={inputClass}
                  inputMode="numeric"
                  placeholder="1450"
                />
              </FieldShell>
              <FieldShell label="Torque (Nm)">
                <input
                  value={values.torque}
                  onChange={(event) => updateValue("torque", event.target.value)}
                  className={inputClass}
                  inputMode="decimal"
                  placeholder="42"
                />
              </FieldShell>
              <FieldShell label="Tool wear (min)">
                <input
                  value={values.toolWear}
                  onChange={(event) => updateValue("toolWear", event.target.value)}
                  className={inputClass}
                  inputMode="numeric"
                  placeholder="120"
                />
              </FieldShell>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="submit"
                disabled={isPredicting}
                className="flex h-11 items-center justify-center gap-2 rounded-full bg-[#145d66] px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0e4d55] disabled:pointer-events-none disabled:opacity-50"
              >
                {isPredicting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Activity className="h-4 w-4" />}
                {isPredicting ? "Predicting..." : values.assetId ? "Predict asset risk" : "Run manual prediction"}
              </button>
            </div>
          </form>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-white/10 dark:bg-white/4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-stone-100">Model training</h3>
              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-stone-400">
                Optional admin action. Leave fields blank to use API defaults.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                <input
                  value={trainValues.validationRatio}
                  onChange={(event) => updateTrainValue("validationRatio", event.target.value)}
                  placeholder="Validation ratio"
                  className={inputClass}
                />
                <input
                  value={trainValues.maxDepth}
                  onChange={(event) => updateTrainValue("maxDepth", event.target.value)}
                  placeholder="Max depth"
                  className={inputClass}
                />
                <input
                  value={trainValues.minNumSamples}
                  onChange={(event) => updateTrainValue("minNumSamples", event.target.value)}
                  placeholder="Min samples"
                  className={inputClass}
                />
              </div>
                <button
                  type="button"
                  onClick={() => void handleTrain()}
                disabled={isTraining}
                className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-50 dark:border-white/10 dark:bg-[#171815] dark:text-stone-300 dark:hover:bg-white/6"
              >
                {isTraining ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <BrainCircuit className="h-4 w-4 text-[#145d66] dark:text-[#86d0d8]" />}
                {isTraining ? "Training..." : "Train decision tree"}
              </button>
              {trainingResult ? (
                <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-stone-400">
                  Latest training: {trainingResult.version}, target accuracy {(trainingResult.metrics.targetAccuracy * 100).toFixed(1)}%.
                </p>
              ) : null}
            </div>

            <PredictionResultCard prediction={latestPrediction} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-white/10">
          <div className="border-b border-slate-100 px-4 py-3 dark:border-white/8">
            <h3 className="text-sm font-bold text-slate-900 dark:text-stone-100">Recent predictions</h3>
            <p className="text-xs text-slate-500 dark:text-stone-400">Saved API results from manual and asset-linked readings.</p>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 px-4 py-10 text-sm text-slate-500 dark:text-stone-400">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Loading predictions...
            </div>
          ) : predictions.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-slate-500 dark:text-stone-400">
              No predictions yet. Run a manual prediction to create the first result.
            </p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-white/8">
              {predictions.slice(0, 6).map((prediction) => (
                <div
                  key={prediction.id}
                  className="grid gap-3 px-4 py-3 md:grid-cols-[minmax(0,1fr)_9rem_7rem_auto] md:items-center"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-stone-100">{prediction.assetName}</p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-stone-400">
                      {prediction.prediction.failureType} - {prediction.createdAt}
                    </p>
                  </div>
                  <span className={`w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold ${riskStyles[prediction.prediction.riskLevel]}`}>
                    {prediction.prediction.riskLevel}
                  </span>
                  <p className="text-sm font-semibold tabular-nums text-slate-900 dark:text-stone-100">
                    {prediction.prediction.riskScore}%
                  </p>
                  <div className="flex gap-2 md:justify-end">
                    <button
                      type="button"
                      onClick={() => setLatestPrediction(prediction)}
                      className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:text-stone-300 dark:hover:bg-white/6"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(prediction.id)}
                      disabled={deletingId === prediction.id}
                      className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:pointer-events-none disabled:opacity-50 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-500/10"
                    >
                      {deletingId === prediction.id ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function MiniMetric({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-[#171815]">
      <p className="text-xs font-medium text-slate-500 dark:text-stone-400">{label}</p>
      <p className="mt-2 text-2xl font-bold tabular-nums text-slate-900 dark:text-stone-100">{value}</p>
      <div className="mt-2 h-1.5 w-10 rounded-full" style={{ backgroundColor: color, opacity: 0.55 }} />
    </div>
  );
}

function FieldShell({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-1.5">
      <span className="text-sm font-medium text-slate-700 dark:text-stone-300">{label}</span>
      {children}
    </label>
  );
}

function PredictionResultCard({ prediction }: { prediction: PredictiveMaintenanceRecord | null }) {
  if (!prediction) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-4 dark:border-white/10 dark:bg-white/4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-stone-100">Latest result</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-stone-400">
          Run a prediction to see risk score, failure type, recommended window, and model explanation here.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-[#171815]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-stone-100">Latest result</h3>
          <p className="text-xs text-slate-500 dark:text-stone-400">{prediction.assetName}</p>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${riskStyles[prediction.prediction.riskLevel]}`}>
          {prediction.prediction.riskLevel}
        </span>
      </div>
      <p className="mt-4 text-4xl font-bold tabular-nums text-slate-900 dark:text-stone-100">
        {prediction.prediction.riskScore}%
      </p>
      <p className="mt-2 text-sm font-semibold text-[#145d66] dark:text-[#86d0d8]">
        {prediction.prediction.failureType}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-stone-400">
        {prediction.explanation.summary}
      </p>
      <div className="mt-4 rounded-xl bg-slate-50 p-3 dark:bg-white/4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-stone-500">
          Recommended window
        </p>
        <p className="mt-1 text-sm font-medium text-slate-900 dark:text-stone-100">
          {prediction.prediction.recommendedMaintenanceWindow}
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-stone-400">
          {prediction.prediction.nextMaintenanceRecommendation}
        </p>
      </div>
      {prediction.explanation.factors.length > 0 ? (
        <ul className="mt-4 list-disc space-y-1 pl-4 text-xs leading-5 text-slate-500 dark:text-stone-400">
          {prediction.explanation.factors.slice(0, 4).map((factor) => (
            <li key={factor}>{factor}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

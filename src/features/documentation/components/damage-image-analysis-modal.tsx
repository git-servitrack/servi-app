"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Camera,
  ChevronDown,
  LoaderCircle,
  ScanLine,
  Sparkles,
  X,
} from "lucide-react";
import { useCallback, useId, useRef, useState } from "react";

type Severity = "Minor" | "Moderate" | "Critical";

interface MockFinding {
  label: string;
  confidence: number;
  detail: string;
}

interface MockAnalysis {
  severity: Severity;
  summary: string;
  findings: MockFinding[];
  actions: string[];
}

const EQUIPMENT_OPTIONS = [
  { value: "hvac", label: "HVAC / mechanical" },
  { value: "electrical", label: "Electrical / panels" },
  { value: "hydraulic", label: "Hydraulic / fluids" },
  { value: "vehicle", label: "Tires & vehicle undercarriage" },
  { value: "general", label: "General equipment" },
] as const;

const MODEL_OPTIONS = [
  { value: "mobilenet", label: "MobileNet — transfer learning (demo)" },
  { value: "resnet", label: "ResNet backbone — fine-tuned (demo)" },
  { value: "tflite", label: "TensorFlow Lite — mobile / field (demo)" },
] as const;

const selectClass =
  "flex h-11 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2 pl-3.5 pr-10 text-sm text-slate-900 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100";

const SEVERITY_STYLES: Record<Severity, string> = {
  Minor:
    "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-800",
  Moderate:
    "bg-amber-50 text-amber-900 ring-1 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-800",
  Critical: "bg-rose-50 text-rose-900 ring-1 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-800",
};

function buildMockAnalysis(equipment: string): MockAnalysis {
  const base: MockAnalysis = {
    severity: "Moderate",
    summary:
      "Visible surface wear and localized corrosion consistent with environmental exposure. No single catastrophic defect detected in this frame.",
    findings: [
      {
        label: "Surface corrosion / rust",
        confidence: 84,
        detail: "Pattern suggests oxidation along seams and fastener heads.",
      },
      {
        label: "Possible fluid staining",
        confidence: 61,
        detail: "Low-contrast sheen; confirm with wipe test or UV dye on site.",
      },
      {
        label: "Minor coating wear",
        confidence: 72,
        detail: "Protective finish thinning; monitor for crack propagation.",
      },
    ],
    actions: [
      "Schedule closer visual inspection within 7 days and compare against prior photos.",
      "Clean affected area, re-torque visible fasteners, and document baseline photos.",
      "If staining persists, check seals and fluid routes; escalate to corrective work order if leak confirmed.",
    ],
  };

  if (equipment === "vehicle") {
    return {
      severity: "Minor",
      summary:
        "Tread and sidewall appear serviceable in this view; minor uneven wear pattern worth tracking.",
      findings: [
        { label: "Tire tread wear pattern", confidence: 78, detail: "Slight bias wear; check alignment and inflation." },
        { label: "Sidewall scuffing", confidence: 55, detail: "Cosmetic; re-inspect after next rotation." },
      ],
      actions: [
        "Verify cold tire pressure and alignment history.",
        "Rotate per OEM interval and re-capture images after service.",
      ],
    };
  }

  if (equipment === "electrical") {
    return {
      severity: "Critical",
      summary:
        "Strong indicators of arcing or heat discoloration in the visible region — treat as high priority until electrically cleared.",
      findings: [
        { label: "Thermal discoloration", confidence: 88, detail: "Hotspot signature on conductor or lug area." },
        { label: "Insulation irregularity", confidence: 67, detail: "Possible cracking or deformation of jacketing." },
      ],
      actions: [
        "De-energize and isolate circuit per lockout/tagout before physical inspection.",
        "Have qualified electrician measure continuity, torque, and insulation resistance.",
      ],
    };
  }

  return base;
}

export function DamageImageAnalysisLauncher() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-fit items-center gap-1.5 rounded-full bg-[#145d66] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0e4d55] dark:hover:bg-[#1a7a86]"
      >
        <Camera className="h-4 w-4" />
        Upload Image
      </button>
      <DamageImageAnalysisModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

interface DamageImageAnalysisModalProps {
  open: boolean;
  onClose: () => void;
}

export function DamageImageAnalysisModal({ open, onClose }: DamageImageAnalysisModalProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [equipment, setEquipment] = useState<string>(EQUIPMENT_OPTIONS[0].value);
  const [modelProfile, setModelProfile] = useState<string>(MODEL_OPTIONS[0].value);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [phase, setPhase] = useState<"pick" | "ready" | "analyzing" | "done">("pick");
  const [result, setResult] = useState<MockAnalysis | null>(null);

  const resetFlow = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setFileName(null);
    setPhase("pick");
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [previewUrl]);

  const handleClose = useCallback(() => {
    resetFlow();
    onClose();
  }, [onClose, resetFlow]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setFileName(file.name);
    setPhase("ready");
    setResult(null);
  };

  const runAnalyze = () => {
    setPhase("analyzing");
    setResult(null);
    window.setTimeout(() => {
      setResult(buildMockAnalysis(equipment));
      setPhase("done");
    }, 1800);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[90vh] w-full max-w-lg flex-col rounded-[24px] border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#1a1d1b] sm:max-w-xl"
          >
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 px-5 pb-4 pt-5 sm:px-6 dark:border-white/8">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#145d66]/10 dark:bg-[#145d66]/20">
                  <ScanLine className="h-5 w-5 text-[#145d66] dark:text-[#86d0d8]" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-stone-100">
                    Damage detection
                  </h2>
                  <p className="mt-0.5 text-sm leading-snug text-slate-500 dark:text-stone-400">
                    Upload an equipment photo. A CNN-style pipeline (transfer learning e.g. MobileNet / ResNet) would classify visible damage; TensorFlow, PyTorch, or TensorFlow Lite would host the real model — this UI simulates results only.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:text-stone-500 dark:hover:bg-white/8 dark:hover:text-stone-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-stone-500">
                    Equipment context
                  </span>
                  <div className="relative">
                    <select
                      value={equipment}
                      onChange={(e) => setEquipment(e.target.value)}
                      className={selectClass}
                      disabled={phase === "analyzing"}
                    >
                      {EQUIPMENT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-stone-500" />
                  </div>
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-stone-500">
                    Model profile (demo)
                  </span>
                  <div className="relative">
                    <select
                      value={modelProfile}
                      onChange={(e) => setModelProfile(e.target.value)}
                      className={selectClass}
                      disabled={phase === "analyzing"}
                    >
                      {MODEL_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-stone-500" />
                  </div>
                </label>
              </div>

              <input
                ref={fileInputRef}
                id={inputId}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={onFileChange}
              />

              {!previewUrl ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={phase === "analyzing"}
                  className="mt-5 flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-linear-to-br from-[#145d66]/5 to-transparent px-4 py-10 transition-colors hover:border-[#145d66]/40 hover:bg-[#145d66]/5 disabled:opacity-50 dark:border-white/15 dark:from-[#145d66]/10"
                >
                  <Camera className="h-8 w-8 text-[#145d66] dark:text-[#86d0d8]" />
                  <span className="text-sm font-semibold text-slate-800 dark:text-stone-200">
                    Choose equipment image
                  </span>
                  <span className="text-xs text-slate-500 dark:text-stone-500">PNG or JPEG recommended</span>
                </button>
              ) : (
                <div className="mt-5 space-y-4">
                  <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-white/5">
                    <img
                      src={previewUrl}
                      alt={fileName ?? "Upload preview"}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <p className="truncate text-center text-xs text-slate-500 dark:text-stone-500">{fileName}</p>

                  {phase === "analyzing" && (
                    <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-4 dark:border-white/10 dark:bg-white/4">
                      <LoaderCircle className="h-5 w-5 animate-spin text-[#145d66] dark:text-[#86d0d8]" />
                      <span className="text-sm font-medium text-slate-700 dark:text-stone-300">
                        Running vision inference…
                      </span>
                    </div>
                  )}

                  {phase !== "done" && phase !== "analyzing" && (
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-stone-300 dark:hover:bg-white/6"
                      >
                        Replace image
                      </button>
                      <button
                        type="button"
                        onClick={runAnalyze}
                        className="flex items-center gap-2 rounded-full bg-[#145d66] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#0e4d55]"
                      >
                        <Sparkles className="h-4 w-4" />
                        Analyze image
                      </button>
                    </div>
                  )}

                  {phase === "done" && result && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-stone-500">
                          Overall severity
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${SEVERITY_STYLES[result.severity]}`}
                        >
                          {result.severity}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-stone-500">
                        {MODEL_OPTIONS.find((o) => o.value === modelProfile)?.label ?? modelProfile}
                      </p>
                      <p className="text-sm leading-relaxed text-slate-700 dark:text-stone-300">{result.summary}</p>

                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-stone-500">
                          Detected signals
                        </p>
                        <ul className="space-y-2">
                          {result.findings.map((f) => (
                            <li
                              key={f.label}
                              className="rounded-lg border border-slate-200/80 bg-white px-3 py-2 dark:border-white/8 dark:bg-[#171815]"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-medium text-slate-900 dark:text-stone-100">{f.label}</span>
                                <span className="text-xs font-semibold tabular-nums text-[#145d66] dark:text-[#86d0d8]">
                                  {f.confidence}%
                                </span>
                              </div>
                              <p className="mt-1 text-xs text-slate-500 dark:text-stone-500">{f.detail}</p>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-stone-500">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          Suggested maintenance
                        </p>
                        <ul className="list-disc space-y-1 pl-4 text-sm text-slate-700 dark:text-stone-300">
                          {result.actions.map((a) => (
                            <li key={a}>{a}</li>
                          ))}
                        </ul>
                      </div>

                      <p className="border-t border-slate-200 pt-3 text-[11px] leading-relaxed text-slate-400 dark:border-white/8 dark:text-stone-500">
                        Simulated output for UI only. Production would use a trained CNN with transfer learning (e.g. MobileNet / ResNet), packaged via TensorFlow or PyTorch, optionally TensorFlow Lite for mobile technicians.
                      </p>

                      <div className="flex flex-wrap justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={resetFlow}
                          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white dark:border-white/10 dark:text-stone-300 dark:hover:bg-white/6"
                        >
                          New image
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPhase("ready");
                            setResult(null);
                          }}
                          className="rounded-full bg-[#145d66] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0e4d55]"
                        >
                          Re-analyze same photo
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

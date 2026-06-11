"use client";

import { AlertTriangle, Camera, Images, LoaderCircle, ScanLine, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import type { DocumentationFile, DocumentationStatus, VisionSeverity } from "@/features/documentation/types/documentation";

const SEVERITY_STYLES: Record<VisionSeverity, string> = {
  Low:
    "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-800",
  Medium:
    "bg-amber-50 text-amber-900 ring-1 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-800",
  High:
    "bg-orange-50 text-orange-900 ring-1 ring-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:ring-orange-800",
  Minor:
    "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-800",
  Moderate:
    "bg-amber-50 text-amber-900 ring-1 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-800",
  Critical: "bg-rose-50 text-rose-900 ring-1 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-800",
};

interface DocumentationPreviewModalProps {
  file: DocumentationFile | null;
  open: boolean;
  onClose: () => void;
  isLoading?: boolean;
  isAnalyzing?: boolean;
  isUpdatingStatus?: boolean;
  onAnalyze?: (file: DocumentationFile) => void;
  onStatusChange?: (file: DocumentationFile, status: DocumentationStatus) => void;
}

export function DocumentationPreviewModal({
  file,
  open,
  onClose,
  isLoading = false,
  isAnalyzing = false,
  isUpdatingStatus = false,
  onAnalyze,
  onStatusChange,
}: DocumentationPreviewModalProps) {
  return (
    <AnimatePresence>
      {open && file ? (
        <PreviewModalContent
          key={`${file.id}-${file.status}`}
          file={file}
          onClose={onClose}
          isLoading={isLoading}
          isAnalyzing={isAnalyzing}
          isUpdatingStatus={isUpdatingStatus}
          onAnalyze={onAnalyze}
          onStatusChange={onStatusChange}
        />
      ) : null}
    </AnimatePresence>
  );
}

function PreviewModalContent({
  file,
  onClose,
  isLoading,
  isAnalyzing,
  isUpdatingStatus,
  onAnalyze,
  onStatusChange,
}: {
  file: DocumentationFile;
  onClose: () => void;
  isLoading: boolean;
  isAnalyzing: boolean;
  isUpdatingStatus: boolean;
  onAnalyze?: (file: DocumentationFile) => void;
  onStatusChange?: (file: DocumentationFile, status: DocumentationStatus) => void;
}) {
  const va = file.visionAnalysis;
  const [selectedStatus, setSelectedStatus] = useState<DocumentationStatus>(file.status);
  const statusChanged = selectedStatus !== file.status;

  return (
        <motion.div
          key={file.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#1a1d1b]"
          >
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6 dark:border-white/8">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#145d66]/10 dark:bg-[#145d66]/20">
                  <Images className="h-5 w-5 text-[#145d66] dark:text-[#86d0d8]" />
                </div>
                <div className="min-w-0">
                      <h2 className="text-lg font-bold text-slate-900 dark:text-stone-100">{file.title}</h2>
                  <p className="mt-0.5 text-sm text-slate-500 dark:text-stone-400">{file.summary}</p>
                  {isLoading ? (
                    <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-[#145d66] dark:text-[#86d0d8]">
                      <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                      Refreshing preview data...
                    </p>
                  ) : null}
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:text-stone-500 dark:hover:bg-white/8 dark:hover:text-stone-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="overflow-y-auto overscroll-contain">
              <div className="grid gap-6 p-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start lg:gap-8 lg:p-6">
                <div className="space-y-4">
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/4">
                    <div
                      className="flex aspect-[4/3] items-center justify-center bg-linear-to-br from-slate-200/80 via-slate-100 to-[#145d66]/10 bg-cover bg-center dark:from-white/8 dark:via-white/4 dark:to-[#145d66]/15"
                      style={file.url ? { backgroundImage: `url(${file.url})` } : undefined}
                    >
                      <div className="flex flex-col items-center gap-3 px-6 text-center">
                        {!file.url ? (
                          <>
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/90 shadow-sm dark:bg-white/10">
                              <Camera className="h-8 w-8 text-[#145d66] dark:text-[#86d0d8]" />
                            </div>
                            <p className="text-sm font-medium text-slate-700 dark:text-stone-300">{file.previewLabel}</p>
                            <p className="text-xs text-slate-500 dark:text-stone-500">
                              Image URL was not returned by the API.
                            </p>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/4">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-stone-500">File details</p>
                    <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                      <div>
                        <dt className="text-xs text-slate-400 dark:text-stone-500">Name</dt>
                        <dd className="mt-0.5 font-medium text-slate-900 dark:text-stone-100">{file.fileName}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-slate-400 dark:text-stone-500">Size</dt>
                        <dd className="mt-0.5 font-medium text-slate-900 dark:text-stone-100">{file.size}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-slate-400 dark:text-stone-500">Uploaded</dt>
                        <dd className="mt-0.5 font-medium text-slate-900 dark:text-stone-100">{file.uploadedAt}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-slate-400 dark:text-stone-500">By</dt>
                        <dd className="mt-0.5 font-medium text-slate-900 dark:text-stone-100">{file.uploadedBy}</dd>
                      </div>
                    </dl>
                    {onStatusChange ? (
                      <div className="mt-4 border-t border-slate-200 pt-4 dark:border-white/8">
                        <label className="text-xs text-slate-400 dark:text-stone-500" htmlFor={`status-${file.id}`}>
                          Review status
                        </label>
                        <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
                          <select
                            id={`status-${file.id}`}
                            value={selectedStatus}
                            onChange={(event) => setSelectedStatus(event.target.value as DocumentationStatus)}
                            disabled={isUpdatingStatus}
                            className="flex h-10 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 disabled:opacity-60 dark:border-white/10 dark:bg-[#171815] dark:text-stone-100"
                          >
                            <option value="Pending Review">Pending Review</option>
                            <option value="Verified">Verified</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => onStatusChange(file, selectedStatus)}
                            disabled={!statusChanged || isUpdatingStatus}
                            className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#145d66] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#0e4d55] disabled:pointer-events-none disabled:opacity-50"
                          >
                            {isUpdatingStatus ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                            {isUpdatingStatus ? "Saving..." : "Save status"}
                          </button>
                        </div>
                      </div>
                    ) : null}
                    <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-200 pt-4 dark:border-white/8">
                      {file.links.map((link) => (
                        <span
                          key={`${file.id}-${link.label}`}
                          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-600 dark:border-white/10 dark:bg-[#171815] dark:text-stone-400"
                        >
                          <span className="font-semibold text-slate-400 dark:text-stone-500">{link.label}:</span>
                          {link.value}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/4">
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-3 dark:border-white/8">
                    <ScanLine className="h-5 w-5 text-[#145d66] dark:text-[#86d0d8]" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-stone-100">Vision analysis</h3>
                      <p className="text-xs text-slate-500 dark:text-stone-500">Stored model result</p>
                    </div>
                  </div>

                  {va.applicable && va.severity ? (
                    <div className="mt-4 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-stone-500">
                          Severity
                        </span>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${SEVERITY_STYLES[va.severity]}`}>
                          {va.severity}
                        </span>
                      </div>
                      {va.modelProfile ? (
                        <p className="text-[11px] text-slate-500 dark:text-stone-500">{va.modelProfile}</p>
                      ) : null}
                      {va.analyzedAt ? (
                        <p className="text-[11px] text-slate-400 dark:text-stone-500">Analyzed {va.analyzedAt}</p>
                      ) : null}
                      {va.summary ? (
                        <p className="text-sm leading-relaxed text-slate-700 dark:text-stone-300">{va.summary}</p>
                      ) : null}

                      {va.findings && va.findings.length > 0 ? (
                        <div>
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-stone-500">
                            Detected signals
                          </p>
                          <ul className="space-y-2">
                            {va.findings.map((f) => (
                              <li
                                key={f.label}
                                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-white/8 dark:bg-[#171815]"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-sm font-medium text-slate-900 dark:text-stone-100">{f.label}</span>
                                  <span className="text-xs font-bold tabular-nums text-[#145d66] dark:text-[#86d0d8]">
                                    {f.confidence}%
                                  </span>
                                </div>
                                <p className="mt-1 text-xs text-slate-500 dark:text-stone-500">{f.detail}</p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {va.actions && va.actions.length > 0 ? (
                        <div>
                          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-stone-500">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            Suggested maintenance
                          </p>
                          <ul className="list-disc space-y-1 pl-4 text-sm text-slate-700 dark:text-stone-300">
                            {va.actions.map((a) => (
                              <li key={a}>{a}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white/60 p-4 dark:border-white/10 dark:bg-[#171815]/60">
                      <p className="text-sm font-medium text-slate-800 dark:text-stone-200">No completed vision pass</p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-stone-400">
                        {va.skipReason ??
                          "Upload completed; run analysis from Upload Image or wait for batch inference."}
                      </p>
                      {va.modelProfile ? (
                        <p className="mt-3 text-[11px] text-slate-400 dark:text-stone-500">{va.modelProfile}</p>
                      ) : null}
                      {va.analyzedAt ? (
                        <p className="mt-1 text-[11px] text-slate-400 dark:text-stone-500">Recorded {va.analyzedAt}</p>
                      ) : null}
                    </div>
                  )}

                  {onAnalyze ? (
                    <button
                      type="button"
                      onClick={() => onAnalyze(file)}
                      disabled={isAnalyzing}
                      className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#145d66] px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0e4d55] disabled:pointer-events-none disabled:opacity-50"
                    >
                      {isAnalyzing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ScanLine className="h-4 w-4" />}
                      {isAnalyzing ? "Analyzing..." : va.applicable ? "Re-analyze media" : "Analyze media"}
                    </button>
                  ) : null}

                  <p className="mt-4 border-t border-slate-200 pt-3 text-[11px] leading-relaxed text-slate-400 dark:border-white/8 dark:text-stone-500">
                    Results are generated by the API-side Teachable Machine TensorFlow.js damage detection model.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
  );
}

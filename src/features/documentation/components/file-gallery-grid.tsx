"use client";

import { Camera, ChevronLeft, ChevronRight, LayoutGrid, Table2, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { DocumentationPreviewModal } from "@/features/documentation/components/documentation-preview-modal";
import { MediaPreviewCard } from "@/features/documentation/components/media-preview-card";
import type { DocumentationFile, DocumentationStatus, VisionSeverity } from "@/features/documentation/types/documentation";

const PAGE_SIZE = 4;

const STATUS_FILTERS = [
  { id: "all" as const, label: "All" },
  { id: "Verified" as const, label: "Verified" },
  { id: "Pending Review" as const, label: "Pending" },
];

const SEVERITY_STYLES: Record<VisionSeverity, string> = {
  Low: "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-800",
  Medium: "bg-amber-50 text-amber-900 ring-1 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-800",
  High: "bg-orange-50 text-orange-900 ring-1 ring-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:ring-orange-800",
  Minor: "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-800",
  Moderate: "bg-amber-50 text-amber-900 ring-1 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-800",
  Critical: "bg-rose-50 text-rose-900 ring-1 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-800",
};

interface FileGalleryGridProps {
  files: DocumentationFile[];
  onDelete?: (file: DocumentationFile) => void;
  onLoadPreview?: (fileId: string) => Promise<DocumentationFile | null>;
  onAnalyzeDamage?: (file: DocumentationFile) => Promise<DocumentationFile | null>;
  onStatusChange?: (file: DocumentationFile, status: DocumentationStatus) => Promise<DocumentationFile | null>;
}

export function FileGalleryGrid({ files, onDelete, onLoadPreview, onAnalyzeDamage, onStatusChange }: FileGalleryGridProps) {
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_FILTERS)[number]["id"]>("all");
  const [view, setView] = useState<"cards" | "table">("table");
  const [page, setPage] = useState(1);
  const [previewFile, setPreviewFile] = useState<DocumentationFile | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLoadingId, setPreviewLoadingId] = useState<string | null>(null);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return files;
    return files.filter((f) => f.status === statusFilter);
  }, [files, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [currentPage, filtered]);

  const rangeStart = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, filtered.length);

  async function openPreview(file: DocumentationFile) {
    setPreviewFile(file);
    setPreviewOpen(true);

    if (!onLoadPreview) return;

    setPreviewLoadingId(file.id);
    const freshFile = await onLoadPreview(file.id);
    setPreviewLoadingId(null);

    if (freshFile) {
      setPreviewFile(freshFile);
    }
  }

  function closePreview() {
    setPreviewOpen(false);
  }

  async function analyzePreviewFile(file: DocumentationFile) {
    if (!onAnalyzeDamage) return;

    setAnalyzingId(file.id);
    const updatedFile = await onAnalyzeDamage(file);
    setAnalyzingId(null);

    if (updatedFile) {
      setPreviewFile(updatedFile);
    }
  }

  async function updatePreviewStatus(file: DocumentationFile, status: DocumentationStatus) {
    if (!onStatusChange) return;

    setUpdatingStatusId(file.id);
    const updatedFile = await onStatusChange(file, status);
    setUpdatingStatusId(null);

    if (updatedFile) {
      setPreviewFile(updatedFile);
    }
  }

  const pageNumbers = useMemo(() => {
    const nums: number[] = [];
    const maxButtons = 5;
    let start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + maxButtons - 1);
    start = Math.max(1, end - maxButtons + 1);
    for (let i = start; i <= end; i += 1) nums.push(i);
    return nums;
  }, [currentPage, totalPages]);

  function changeStatusFilter(nextStatus: (typeof STATUS_FILTERS)[number]["id"]) {
    setStatusFilter(nextStatus);
    setPage(1);
  }

  function changeView(nextView: "cards" | "table") {
    setView(nextView);
    setPage(1);
  }

  return (
    <div className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[24px] sm:p-6 dark:border-white/10 dark:bg-[#171815]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-stone-100">Image gallery</h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-stone-400">
            Equipment photos only. Open a row or card for full preview and vision analysis.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((f) => {
              const count = f.id === "all" ? files.length : files.filter((x) => x.status === f.id).length;
              const active = statusFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => changeStatusFilter(f.id)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                    active
                      ? "bg-[#145d66] text-white shadow-sm"
                      : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:bg-white/4 dark:text-stone-400 dark:hover:bg-white/8"
                  }`}
                >
                  {f.label}
                  <span className={`ml-1.5 tabular-nums ${active ? "text-white/80" : "text-slate-400 dark:text-stone-500"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex rounded-full border border-slate-200 p-1 dark:border-white/10">
            <button
              type="button"
              onClick={() => changeView("cards")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                view === "cards"
                  ? "bg-[#145d66] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 dark:text-stone-400 dark:hover:bg-white/6"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Cards
            </button>
            <button
              type="button"
              onClick={() => changeView("table")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                view === "table"
                  ? "bg-[#145d66] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 dark:text-stone-400 dark:hover:bg-white/6"
              }`}
            >
              <Table2 className="h-3.5 w-3.5" />
              Table
            </button>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 py-12 text-center text-sm text-slate-500 dark:text-stone-400">No images match this filter.</p>
      ) : view === "cards" ? (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {paginated.map((file) => (
            <MediaPreviewCard
              key={file.id}
              file={file}
              onPreview={() => void openPreview(file)}
              onDelete={onDelete ? () => onDelete(file) : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/90 dark:border-white/8 dark:bg-white/4">
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-stone-500">
                  Preview
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-stone-500">
                  Title
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-stone-500">
                  File
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-stone-500">
                  Status
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-stone-500">
                  Severity
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-stone-500">
                  Uploaded
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-stone-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/6">
              {paginated.map((file) => {
                const va = file.visionAnalysis;
                return (
                  <tr key={file.id} className="transition-colors hover:bg-slate-50/80 dark:hover:bg-white/4">
                    <td className="px-4 py-3">
                      <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-linear-to-br from-slate-100 to-[#145d66]/10 dark:from-white/8 dark:to-[#145d66]/15">
                        <div
                          className="flex h-full w-full items-center justify-center rounded-lg bg-cover bg-center"
                          style={file.url ? { backgroundImage: `url(${file.url})` } : undefined}
                        >
                          {!file.url ? <Camera className="h-5 w-5 text-[#145d66] dark:text-[#86d0d8]" /> : null}
                        </div>
                      </div>
                    </td>
                    <td className="max-w-[200px] px-4 py-3">
                      <p className="font-semibold text-slate-900 dark:text-stone-100">{file.title}</p>
                      <p className="mt-0.5 line-clamp-1 text-xs text-slate-500 dark:text-stone-500">{file.previewLabel}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-mono text-xs text-slate-700 dark:text-stone-300">{file.fileName}</p>
                      <p className="text-xs text-slate-400 dark:text-stone-500">{file.size}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          file.status === "Verified"
                            ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:ring-emerald-800"
                            : "bg-amber-50 text-amber-800 ring-1 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:ring-amber-800"
                        }`}
                      >
                        {file.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {va.applicable && va.severity ? (
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${SEVERITY_STYLES[va.severity]}`}>
                          {va.severity}
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-slate-400 dark:text-stone-500">Not analyzed</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-600 dark:text-stone-400">{file.uploadedAt}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => void openPreview(file)}
                          className="rounded-full bg-[#145d66] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#0e4d55]"
                        >
                          View
                        </button>
                        {onDelete ? (
                          <button
                            type="button"
                            onClick={() => onDelete(file)}
                            className="inline-flex items-center gap-1 rounded-full border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-500/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="mt-6 flex flex-col items-stretch gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-white/8">
          <p className="text-center text-sm text-slate-500 dark:text-stone-400 sm:text-left">
            Showing <span className="font-semibold tabular-nums text-slate-800 dark:text-stone-200">{rangeStart}</span>
            –
            <span className="font-semibold tabular-nums text-slate-800 dark:text-stone-200">{rangeEnd}</span>
            <span className="text-slate-400 dark:text-stone-500"> of </span>
            <span className="font-semibold tabular-nums text-slate-800 dark:text-stone-200">{filtered.length}</span>
            <span className="text-slate-400 dark:text-stone-500"> images</span>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex h-9 items-center gap-1 rounded-full border border-slate-200 px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40 dark:border-white/10 dark:text-stone-300 dark:hover:bg-white/6"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </button>

            <div className="flex items-center gap-1">
              {pageNumbers.map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setPage(num)}
                  className={`flex h-9 min-w-9 items-center justify-center rounded-full text-sm font-semibold tabular-nums transition-colors ${
                    num === currentPage
                      ? "bg-[#145d66] text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 dark:text-stone-400 dark:hover:bg-white/8"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="flex h-9 items-center gap-1 rounded-full border border-slate-200 px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40 dark:border-white/10 dark:text-stone-300 dark:hover:bg-white/6"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}

      <DocumentationPreviewModal
        file={previewFile}
        open={previewOpen}
        onClose={closePreview}
        isLoading={Boolean(previewLoadingId)}
        isAnalyzing={Boolean(previewFile && analyzingId === previewFile.id)}
        isUpdatingStatus={Boolean(previewFile && updatingStatusId === previewFile.id)}
        onAnalyze={onAnalyzeDamage ? (file) => void analyzePreviewFile(file) : undefined}
        onStatusChange={onStatusChange ? (file, status) => void updatePreviewStatus(file, status) : undefined}
      />
    </div>
  );
}

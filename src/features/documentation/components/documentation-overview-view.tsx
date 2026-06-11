"use client";

import { LoaderCircle, UploadCloud } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { sileo } from "sileo";

import { ApiErrorAlert } from "@/components/feedback/api-error-alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DocumentationUploadModal } from "@/features/documentation/components/documentation-upload-modal";
import { FileGalleryGrid } from "@/features/documentation/components/file-gallery-grid";
import type {
  DocumentationFile,
  DocumentationStatus,
  DocumentationUploadOptions,
} from "@/features/documentation/types/documentation";
import { damageDetectionService, documentationService } from "@/services";
import type { ApiErrorShape } from "@/services/http/types";

const emptyUploadOptions: DocumentationUploadOptions = {
  Asset: [],
  ServiceRequest: [],
  Maintenance: [],
};

export function DocumentationOverviewView() {
  const [files, setFiles] = useState<DocumentationFile[]>([]);
  const [uploadOptions, setUploadOptions] = useState<DocumentationUploadOptions>(emptyUploadOptions);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiErrorShape | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DocumentationFile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const statItems = useMemo(() => {
    const visionReady = files.filter((f) => f.visionAnalysis.applicable).length;

    return [
      { label: "Verified", value: files.filter((f) => f.status === "Verified").length.toString(), color: "#059669" },
      { label: "Pending Review", value: files.filter((f) => f.status === "Pending Review").length.toString(), color: "#d97706" },
      { label: "Total Files", value: files.length.toString(), color: "#145d66" },
      { label: "AI analyzed", value: visionReady.toString(), color: "#1e293b", hint: "Teachable Machine results" },
    ];
  }, [files]);

  async function loadDocumentation() {
    const [fileResult, optionResult] = await Promise.all([
      documentationService.list(),
      documentationService.uploadOptions(),
    ]);

    if (fileResult.error) {
      setError(fileResult.error);
      setFiles([]);
    } else {
      setFiles(fileResult.data);
    }

    if (optionResult.error) {
      setError(optionResult.error);
      setUploadOptions(emptyUploadOptions);
    } else {
      setUploadOptions(optionResult.data);
    }

    if (!fileResult.error && !optionResult.error) {
      setError(null);
    }
  }

  useEffect(() => {
    let active = true;

    async function loadInitialData() {
      await loadDocumentation();

      if (active) {
        setIsLoading(false);
      }
    }

    void loadInitialData();

    return () => {
      active = false;
    };
  }, []);

  async function loadPreview(fileId: string) {
    const result = await documentationService.getById(fileId);

    if (result.error) {
      setError(result.error);
      return null;
    }

    setFiles((current) => current.map((file) => (file.id === fileId ? result.data : file)));
    setError(null);
    return result.data;
  }

  async function analyzeExistingMedia(file: DocumentationFile) {
    const result = await damageDetectionService.analyzeMediaFile(file.id);

    if (result.error) {
      setError(result.error);
      return null;
    }

    const updatedFile = damageDetectionService.toDocumentationFile(file, result.data);
    setFiles((current) => current.map((item) => (item.id === file.id ? updatedFile : item)));
    setError(null);

    return updatedFile;
  }

  async function updateMediaStatus(file: DocumentationFile, status: DocumentationStatus) {
    const updated = await sileo
      .promise(
        async () => {
          const result = await documentationService.updateStatus(file.id, status);

          if (result.error) {
            throw result.error;
          }

          return result.data;
        },
        {
          loading: {
            title: "Updating status...",
            description: file.title,
          },
          success: (response) => ({
            title: "Status updated",
            description: response.message,
          }),
          error: (errorValue) => ({
            title: "Status update failed",
            description:
              typeof errorValue === "object" && errorValue !== null && "message" in errorValue
                ? String((errorValue as { message?: unknown }).message)
                : "The media status could not be updated.",
          }),
        },
      )
      .catch((errorValue: ApiErrorShape) => {
        setError(errorValue);
        return null;
      });

    if (!updated) return null;

    const updatedFile: DocumentationFile = {
      ...file,
      status: updated.file.status,
    };
    setFiles((current) => current.map((item) => (item.id === file.id ? updatedFile : item)));
    setError(null);

    return updatedFile;
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    setIsDeleting(true);

    const deleted = await sileo
      .promise(
        async () => {
          const result = await documentationService.delete(deleteTarget.id);

          if (result.error) {
            throw result.error;
          }

          return result.data;
        },
        {
          loading: {
            title: "Deleting documentation...",
            description: deleteTarget.title,
          },
          success: {
            title: "Documentation deleted",
            description: `${deleteTarget.title} was removed.`,
          },
          error: (errorValue) => ({
            title: "Delete failed",
            description:
              typeof errorValue === "object" && errorValue !== null && "message" in errorValue
                ? String((errorValue as { message?: unknown }).message)
                : "The media file could not be deleted.",
          }),
        },
      )
      .catch((errorValue: ApiErrorShape) => {
        setError(errorValue);
        return null;
      });

    setIsDeleting(false);

    if (!deleted) return;

    setFiles((current) => current.filter((file) => file.id !== deleteTarget.id));
    setDeleteTarget(null);
    setError(null);
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-stone-100">
              Documentation
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm text-slate-500 dark:text-stone-400">
              Upload equipment images, connect them to operational records, and review API-side damage detection results.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setUploadOpen(true)}
            disabled={isLoading}
            className="flex w-fit items-center gap-1.5 rounded-full bg-[#145d66] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0e4d55] disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-[#1a7a86]"
          >
            <UploadCloud className="h-4 w-4" />
            Upload documentation
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
              {"hint" in stat && stat.hint ? (
                <p className="mt-2 text-xs text-slate-400 dark:text-stone-500">{stat.hint}</p>
              ) : null}
              <div className="mt-3 h-1.5 w-12 rounded-full sm:mt-4" style={{ backgroundColor: stat.color, opacity: 0.5 }} />
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-3 sm:mt-6">
          {error ? <ApiErrorAlert message={error.message} /> : null}
        </div>

        <div className="mt-6 sm:mt-8">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 rounded-[20px] border border-slate-200 bg-white px-6 py-16 text-sm text-slate-500 shadow-sm sm:rounded-[24px] dark:border-white/10 dark:bg-[#171815] dark:text-stone-400">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Loading documentation...
            </div>
          ) : (
            <FileGalleryGrid
              files={files}
              onDelete={setDeleteTarget}
              onLoadPreview={loadPreview}
              onAnalyzeDamage={analyzeExistingMedia}
              onStatusChange={updateMediaStatus}
            />
          )}
        </div>
      </div>

      <DocumentationUploadModal
        open={uploadOpen}
        options={uploadOptions}
        onClose={() => setUploadOpen(false)}
        onUploaded={loadDocumentation}
      />

      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setDeleteTarget(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete documentation?</DialogTitle>
            <DialogDescription>
              {deleteTarget
                ? `This will permanently delete ${deleteTarget.title}.`
                : "This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting}
              className="flex h-11 items-center justify-center rounded-full border border-slate-200 px-5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-50 dark:border-white/10 dark:text-stone-300 dark:hover:bg-white/6"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="flex h-11 items-center justify-center gap-2 rounded-full bg-rose-500 px-5 text-sm font-semibold text-white transition-colors hover:bg-rose-600 disabled:pointer-events-none disabled:opacity-50"
            >
              {isDeleting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
              {isDeleting ? "Deleting..." : "Delete file"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

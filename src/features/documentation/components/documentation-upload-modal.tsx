"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, FileImage, LoaderCircle, UploadCloud, X } from "lucide-react";
import { useMemo, useState } from "react";
import { sileo } from "sileo";

import { ApiErrorAlert } from "@/components/feedback/api-error-alert";
import type {
  DocumentationPurpose,
  DocumentationRelatedModel,
  DocumentationStatus,
  DocumentationUploadOptions,
} from "@/features/documentation/types/documentation";
import { documentationService } from "@/services";
import type { ApiErrorShape } from "@/services/http/types";

interface DocumentationUploadModalProps {
  open: boolean;
  options: DocumentationUploadOptions;
  onClose: () => void;
  onUploaded?: () => void | Promise<void>;
}

const purposes: DocumentationPurpose[] = [
  "General",
  "Asset Photo",
  "Damage Photo",
  "Repair Completion Photo",
];
const relatedModels: DocumentationRelatedModel[] = ["Asset", "ServiceRequest", "Maintenance"];
const statuses: Array<DocumentationStatus | ""> = ["", "Pending Review", "Verified"];

const inputClass =
  "flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100 dark:placeholder:text-stone-500";
const selectClass =
  "flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100";
const textareaClass =
  "flex min-h-[92px] w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-[#145d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145d66]/20 dark:border-white/10 dark:bg-white/4 dark:text-stone-100 dark:placeholder:text-stone-500";

function getModelLabel(model: DocumentationRelatedModel) {
  if (model === "ServiceRequest") return "Service Request";
  if (model === "Maintenance") return "Maintenance Job";
  return "Asset";
}

export function DocumentationUploadModal({
  open,
  options,
  onClose,
  onUploaded,
}: DocumentationUploadModalProps) {
  const [image, setImage] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [purpose, setPurpose] = useState<DocumentationPurpose>("General");
  const [tags, setTags] = useState("");
  const [relatedModel, setRelatedModel] = useState<DocumentationRelatedModel>("Asset");
  const [relatedId, setRelatedId] = useState("");
  const [status, setStatus] = useState<DocumentationStatus | "">("");
  const [error, setError] = useState<ApiErrorShape | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const relatedOptions = options[relatedModel];
  const canSubmit = Boolean(image && relatedId && !isSubmitting);
  const selectedFileMeta = useMemo(() => {
    if (!image) return "PNG or JPEG, up to 5 MB.";
    return `${image.name} - ${(image.size / 1024 / 1024).toFixed(2)} MB`;
  }, [image]);

  function resetForm() {
    setImage(null);
    setTitle("");
    setSummary("");
    setPurpose("General");
    setTags("");
    setRelatedModel("Asset");
    setRelatedId("");
    setStatus("");
    setError(null);
  }

  function handleClose() {
    if (isSubmitting) return;
    resetForm();
    onClose();
  }

  function handleModelChange(nextModel: DocumentationRelatedModel) {
    setRelatedModel(nextModel);
    setRelatedId("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!image) {
      setError({
        code: "VALIDATION_ERROR",
        message: "Please choose a PNG or JPEG image.",
      });
      return;
    }

    if (!relatedId) {
      setError({
        code: "VALIDATION_ERROR",
        message: "Choose the related asset, service request, or maintenance job.",
      });
      return;
    }

    setIsSubmitting(true);

    const uploaded = await sileo
      .promise(
        async () => {
          const result = await documentationService.upload({
            image,
            title,
            summary,
            purpose,
            tags,
            relatedModel,
            relatedId,
            status,
          });

          if (result.error) {
            throw result.error;
          }

          return result.data;
        },
        {
          loading: {
            title: "Uploading documentation...",
            description: image.name,
          },
          success: (response) => ({
            title: "Documentation uploaded",
            description: response.message,
          }),
          error: (errorValue) => ({
            title: "Upload failed",
            description:
              typeof errorValue === "object" && errorValue !== null && "message" in errorValue
                ? String((errorValue as { message?: unknown }).message)
                : "The image could not be uploaded.",
          }),
        },
      )
      .catch((errorValue: ApiErrorShape) => {
        setError(errorValue);
        return null;
      });

    setIsSubmitting(false);

    if (!uploaded) return;

    await onUploaded?.();
    resetForm();
    onClose();
  }

  return (
    <AnimatePresence>
      {open ? (
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
            onClick={(event) => event.stopPropagation()}
            className="relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-[24px] border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#1a1d1b]"
          >
            <div className="flex shrink-0 items-start justify-between border-b border-slate-100 px-6 pb-4 pt-6 dark:border-white/8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#145d66]/10 dark:bg-[#145d66]/20">
                  <UploadCloud className="h-5 w-5 text-[#145d66] dark:text-[#86d0d8]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-stone-100">
                    Upload documentation
                  </h2>
                  <p className="text-sm text-slate-400 dark:text-stone-500">
                    Store equipment images and connect them to an asset, request, or maintenance job.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:pointer-events-none disabled:opacity-50 dark:text-stone-500 dark:hover:bg-white/8 dark:hover:text-stone-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form className="overflow-y-auto overscroll-contain px-6 py-5" onSubmit={handleSubmit}>
              <div className="space-y-5">
                {error ? <ApiErrorAlert message={error.message} /> : null}

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition-colors hover:border-[#145d66] hover:bg-[#145d66]/5 dark:border-white/10 dark:bg-white/4 dark:hover:border-[#86d0d8] dark:hover:bg-[#145d66]/10">
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    className="sr-only"
                    onChange={(event) => setImage(event.target.files?.[0] ?? null)}
                  />
                  <FileImage className="h-8 w-8 text-[#145d66] dark:text-[#86d0d8]" />
                  <span className="mt-3 text-sm font-semibold text-slate-900 dark:text-stone-100">
                    Choose image
                  </span>
                  <span className="mt-1 text-xs text-slate-500 dark:text-stone-400">
                    {selectedFileMeta}
                  </span>
                </label>

                <div className="grid gap-4 md:grid-cols-2">
                  <FieldShell label="Title">
                    <input
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      placeholder="Forklift inspection photo"
                      className={inputClass}
                    />
                  </FieldShell>
                  <FieldShell label="Purpose">
                    <select
                      value={purpose}
                      onChange={(event) => setPurpose(event.target.value as DocumentationPurpose)}
                      className={selectClass}
                    >
                      {purposes.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </FieldShell>
                  <FieldShell label="Related model">
                    <select
                      value={relatedModel}
                      onChange={(event) => handleModelChange(event.target.value as DocumentationRelatedModel)}
                      className={selectClass}
                    >
                      {relatedModels.map((option) => (
                        <option key={option} value={option}>
                          {getModelLabel(option)}
                        </option>
                      ))}
                    </select>
                  </FieldShell>
                  <FieldShell label="Related record">
                    <select
                      value={relatedId}
                      onChange={(event) => setRelatedId(event.target.value)}
                      className={selectClass}
                    >
                      <option value="">Select {getModelLabel(relatedModel).toLowerCase()}</option>
                      {relatedOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}{option.detail ? ` - ${option.detail}` : ""}
                        </option>
                      ))}
                    </select>
                  </FieldShell>
                  <FieldShell label="Status">
                    <select
                      value={status}
                      onChange={(event) => setStatus(event.target.value as DocumentationStatus | "")}
                      className={selectClass}
                    >
                      {statuses.map((option) => (
                        <option key={option || "default"} value={option}>
                          {option || "Use API default"}
                        </option>
                      ))}
                    </select>
                  </FieldShell>
                  <FieldShell label="Tags">
                    <input
                      value={tags}
                      onChange={(event) => setTags(event.target.value)}
                      placeholder="Electrical, Inspection, Safety"
                      className={inputClass}
                    />
                  </FieldShell>
                </div>

                <FieldShell label="Summary">
                  <textarea
                    value={summary}
                    onChange={(event) => setSummary(event.target.value)}
                    placeholder="Add context for this field photo."
                    className={textareaClass}
                  />
                </FieldShell>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-5 dark:border-white/8">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex h-12 items-center justify-center rounded-full border border-slate-200 px-8 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-50 dark:border-white/10 dark:text-stone-300 dark:hover:bg-white/6"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#145d66] px-8 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0e4d55] disabled:pointer-events-none disabled:opacity-50"
                >
                  {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                  {isSubmitting ? "Uploading..." : "Upload documentation"}
                  {!isSubmitting ? <ArrowRight className="h-4 w-4" /> : null}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
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

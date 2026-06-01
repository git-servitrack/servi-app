"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ClipboardList, X } from "lucide-react";

import { RequestForm } from "@/features/service-requests/components/request-form";
import type {
  ServiceRequestAssetOption,
  ServiceRequestFormValues,
  ServiceRequestRequesterOption,
} from "@/features/service-requests/types/service-requests";

interface RequestFormModalProps {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  values: ServiceRequestFormValues;
  requestId?: string;
  assets: ServiceRequestAssetOption[];
  requesters: ServiceRequestRequesterOption[];
  onSaved?: () => void | Promise<void>;
}

export function RequestFormModal({
  open,
  onClose,
  mode,
  values,
  requestId,
  assets,
  requesters,
  onSaved,
}: RequestFormModalProps) {
  const isEdit = mode === "edit";

  async function handleSuccess() {
    await onSaved?.();
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-[24px] border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#1a1d1b]"
          >
            <div className="flex shrink-0 items-start justify-between border-b border-slate-100 px-6 pb-4 pt-6 dark:border-white/8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#145d66]/10 dark:bg-[#145d66]/20">
                  <ClipboardList className="h-5 w-5 text-[#145d66] dark:text-[#86d0d8]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-stone-100">
                    {isEdit ? "Update request" : "Create service request"}
                  </h2>
                  <p className="text-sm text-slate-400 dark:text-stone-500">
                    {isEdit ? "Update the service request details." : "Fill in the details for a new service request."}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:text-stone-500 dark:hover:bg-white/8 dark:hover:text-stone-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="overflow-y-auto overscroll-contain px-6 py-5">
              <RequestForm
                submitLabel={isEdit ? "Save update" : "Create request"}
                values={values}
                requestId={requestId}
                assets={assets}
                requesters={requesters}
                onSuccess={handleSuccess}
                onCancel={onClose}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

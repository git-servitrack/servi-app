"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Package, X } from "lucide-react";

import { AssetForm } from "@/features/assets/components/asset-form";
import type { AssetFormValues } from "@/features/assets/types/assets";

interface AssetFormModalProps {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  values: AssetFormValues;
  assetId?: string;
}

export function AssetFormModal({ open, onClose, mode, values, assetId }: AssetFormModalProps) {
  const isEdit = mode === "edit";

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
                  <Package className="h-5 w-5 text-[#145d66] dark:text-[#86d0d8]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-stone-100">
                    {isEdit ? "Edit asset" : "Create new asset"}
                  </h2>
                  <p className="text-sm text-slate-400 dark:text-stone-500">
                    {isEdit ? "Update the asset record details." : "Fill in the details for a new asset record."}
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
              <AssetForm
                submitLabel={isEdit ? "Save changes" : "Create asset"}
                values={values}
                assetId={assetId}
                onSuccess={onClose}
                onCancel={onClose}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

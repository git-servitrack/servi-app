import { FormPageLayout } from "@/components/shared/form-page-layout";
import { ROUTES } from "@/constants/routes";
import { StockAdjustmentForm } from "@/features/spare-parts/components/stock-adjustment-form";
import type { SparePartFormValues } from "@/features/spare-parts/types/spare-parts";

interface SparePartFormViewProps {
  mode: "create" | "edit";
  values: SparePartFormValues;
  partId?: string;
}

export function SparePartFormView({ mode, values, partId }: SparePartFormViewProps) {
  const isEdit = mode === "edit";

  return (
    <FormPageLayout
        eyebrow={isEdit ? "Edit Spare Part" : "Create Spare Part"}
        title={isEdit ? "Update spare part record" : "Create spare part record"}
        description={
          isEdit
            ? "Keep part metadata, storage details, and stock thresholds aligned so later inventory actions can stay predictable."
            : "Set up a reusable inventory record shape that can later support procurement, stock issue, and reconciliation flows."
        }
        flowLabel={isEdit ? "Edit flow" : "Create flow"}
        backHref={ROUTES.spareParts}
        backLabel="Back to spare parts"
        formTitle="Inventory form"
        formDescription="Create and edit share one contract so stock fields and thresholds behave consistently across routes."
        formContent={
          <StockAdjustmentForm
            title={isEdit ? "Edit inventory details" : "New inventory details"}
            description="This form covers the stable record shape for spare parts before real stock adjustments become transactional."
            submitLabel={isEdit ? "Save changes" : "Create spare part"}
            values={values}
            partId={partId}
          />
        }
        guidanceTitle="Inventory guidance"
        guidanceDescription="Keep the base record lean now so later transaction workflows can extend without reworking the form surface."
        guidanceEyebrow="Recommended integration approach"
        guidanceCardTitle="Future API notes"
        guidanceContent={
          <>
            <p>Use one part master DTO for this form, and handle stock issues, receipts, and adjustments as separate inventory transaction endpoints.</p>
            <p>Hydrate edit defaults from the part detail payload so create and edit can share the same validation schema later.</p>
            <p>When procurement arrives, add supplier lead time, purchase order references, and restock ETA as adjacent views rather than inflating the base record form.</p>
          </>
        }
      />
  );
}

import { FormPageLayout } from "@/components/shared/form-page-layout";
import { ROUTES } from "@/constants/routes";
import { AssetForm } from "@/features/assets/components/asset-form";
import type { AssetFormValues } from "@/features/assets/types/assets";

interface AssetFormViewProps {
  mode: "create" | "edit";
  values: AssetFormValues;
  assetId?: string;
}

export function AssetFormView({ mode, values, assetId }: AssetFormViewProps) {
  const isEdit = mode === "edit";

  return (
    <FormPageLayout
        eyebrow={isEdit ? "Edit Asset" : "Create Asset"}
        title={isEdit ? "Update asset record" : "Create new asset"}
        description={
          isEdit
            ? "Use the shared asset form to adjust ownership, service cadence, and asset metadata."
            : "Prepare a clean asset record structure ready for validation rules and API submission later."
        }
        flowLabel={isEdit ? "Edit flow" : "Create flow"}
        backHref={ROUTES.assets}
        backLabel="Back to assets"
        formTitle="Asset form"
        formDescription="Form layout is shared between create and edit routes to prevent duplicated module logic."
        formContent={
          <AssetForm
            title={isEdit ? "Edit asset details" : "New asset details"}
            description="Form field strategy mirrors the expected shape of future service contracts."
            submitLabel={isEdit ? "Save changes" : "Create asset"}
            values={values}
            assetId={assetId}
          />
        }
        guidanceTitle="Form guidance"
        guidanceDescription="Keep field ownership consistent so create and edit flows can share the same contract."
        guidanceEyebrow="Recommended integration approach"
        guidanceCardTitle="Future API notes"
        guidanceContent={
          <>
            <p>Map this form directly to a typed asset DTO and add validation with `react-hook-form` and `zod` in Phase 11.</p>
            <p>Use the same schema for create and edit, with route-level default values supplied from the asset detail fetch.</p>
            <p>Keep file uploads, linked documents, and maintenance history as adjacent flows rather than expanding this base form too early.</p>
          </>
        }
      />
  );
}

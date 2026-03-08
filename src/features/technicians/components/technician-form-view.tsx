import { FormPageLayout } from "@/components/shared/form-page-layout";
import { ROUTES } from "@/constants/routes";
import { TechnicianForm } from "@/features/technicians/components/technician-form";
import type { TechnicianFormValues } from "@/features/technicians/types/technicians";

interface TechnicianFormViewProps {
  mode: "create" | "edit";
  values: TechnicianFormValues;
  technicianId?: string;
}

export function TechnicianFormView({ mode, values, technicianId }: TechnicianFormViewProps) {
  const isEdit = mode === "edit";

  return (
    <FormPageLayout
        eyebrow={isEdit ? "Edit Technician" : "Create Technician"}
        title={isEdit ? "Update technician profile" : "Create technician profile"}
        description={
          isEdit
            ? "Maintain a stable workforce contract so scheduling, credentials, and performance surfaces can extend without reworking this form."
            : "Set up a technician profile structure that can later connect cleanly to dispatch, staffing, and identity data."
        }
        flowLabel={isEdit ? "Edit flow" : "Create flow"}
        backHref={ROUTES.technicians}
        backLabel="Back to technicians"
        formTitle="Technician form"
        formDescription="Create and edit flows share one form contract so field behavior stays consistent when validation is introduced."
        formContent={
          <TechnicianForm
            title={isEdit ? "Edit technician details" : "New technician details"}
            description="Field names mirror the expected workforce profile payload for later API integration."
            submitLabel={isEdit ? "Save changes" : "Create technician"}
            values={values}
            technicianId={technicianId}
          />
        }
        guidanceTitle="Implementation notes"
        guidanceDescription="Keep the module stable now so later workforce and scheduling APIs can layer in without UI churn."
        guidanceEyebrow="Recommended integration approach"
        guidanceCardTitle="Future API notes"
        guidanceContent={
          <>
            <p>Map this form to a single technician profile DTO and keep shift assignment, credentials, and leave calendars as adjacent resources.</p>
            <p>Use shared validation rules across create and edit, with route-level default values hydrated from the technician detail payload.</p>
            <p>When dispatch scheduling arrives, prefer linking workload and assignment data from dedicated endpoints instead of inflating the profile form contract.</p>
          </>
        }
      />
  );
}

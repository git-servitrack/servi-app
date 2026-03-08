import { FormPageLayout } from "@/components/shared/form-page-layout";
import { ROUTES } from "@/constants/routes";
import { RequestForm } from "@/features/service-requests/components/request-form";
import type { ServiceRequestFormValues } from "@/features/service-requests/types/service-requests";

interface RequestFormViewProps {
  mode: "create" | "edit";
  values: ServiceRequestFormValues;
  requestId?: string;
}

export function RequestFormView({ mode, values, requestId }: RequestFormViewProps) {
  const isEdit = mode === "edit";

  return (
    <FormPageLayout
        eyebrow={isEdit ? "Update Request" : "Create Request"}
        title={isEdit ? "Update service request" : "Create service request"}
        description={
          isEdit
            ? "Adjust triage state, scheduling, and request context using the same shared form contract."
            : "Capture request context in a reusable structure that can later map to typed backend mutations."
        }
        flowLabel={isEdit ? "Update flow" : "Create flow"}
        backHref={ROUTES.serviceRequests}
        backLabel="Back to requests"
        formTitle="Request form"
        formDescription="Create and update routes share one request form to avoid duplication and drift."
        formContent={
          <RequestForm
            title={isEdit ? "Edit request details" : "New request details"}
            description="Field ownership mirrors the expected shape of future service request DTOs."
            submitLabel={isEdit ? "Save update" : "Create request"}
            values={values}
            requestId={requestId}
          />
        }
        guidanceTitle="Module notes"
        guidanceDescription="These notes keep the request flow ready for later API and validation work."
        guidanceEyebrow="Recommended next integration step"
        guidanceCardTitle="Future API notes"
        guidanceContent={
          <>
            <p>The request form now uses `react-hook-form` and `zod`, so create and edit already share one schema and submit flow.</p>
            <p>Keep timeline events and remarks as separate API resources or embedded collections depending on backend pagination needs.</p>
            <p>Status transitions should remain explicit and auditable, ideally with server-side rules around closure and reassignment.</p>
          </>
        }
      />
  );
}

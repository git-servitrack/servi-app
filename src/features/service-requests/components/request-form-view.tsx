import Link from "next/link";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <PageContainer>
      <PageHeader
        eyebrow={isEdit ? "Update Request" : "Create Request"}
        title={isEdit ? "Update service request" : "Create service request"}
        description={
          isEdit
            ? "Adjust triage state, scheduling, and request context using the same shared form contract."
            : "Capture request context in a reusable structure that can later map to typed backend mutations."
        }
        actions={
          <>
            <Badge variant="outline">{isEdit ? "Update flow" : "Create flow"}</Badge>
            <Button asChild variant="outline">
              <Link href={ROUTES.serviceRequests}>Back to requests</Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionWrapper title="Request form" description="Create and update routes share one request form to avoid duplication and drift.">
          <RequestForm
            title={isEdit ? "Edit request details" : "New request details"}
            description="Field ownership mirrors the expected shape of future service request DTOs."
            submitLabel={isEdit ? "Save update" : "Create request"}
            values={values}
            requestId={requestId}
          />
        </SectionWrapper>

        <SectionWrapper title="Module notes" description="These notes keep the request flow ready for later API and validation work.">
          <Card>
            <CardHeader>
              <CardDescription>Recommended next integration step</CardDescription>
              <CardTitle>Future API notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
              <p>The request form now uses `react-hook-form` and `zod`, so create and edit already share one schema and submit flow.</p>
              <p>Keep timeline events and remarks as separate API resources or embedded collections depending on backend pagination needs.</p>
              <p>Status transitions should remain explicit and auditable, ideally with server-side rules around closure and reassignment.</p>
            </CardContent>
          </Card>
        </SectionWrapper>
      </div>
    </PageContainer>
  );
}

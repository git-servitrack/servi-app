import Link from "next/link";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <PageContainer>
      <PageHeader
        eyebrow={isEdit ? "Edit Technician" : "Create Technician"}
        title={isEdit ? "Update technician profile" : "Create technician profile"}
        description={
          isEdit
            ? "Maintain a stable workforce contract so scheduling, credentials, and performance surfaces can extend without reworking this form."
            : "Set up a technician profile structure that can later connect cleanly to dispatch, staffing, and identity data."
        }
        actions={
          <>
            <Badge variant="outline">{isEdit ? "Edit flow" : "Create flow"}</Badge>
            <Button asChild variant="outline">
              <Link href={ROUTES.technicians}>Back to technicians</Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionWrapper title="Technician form" description="Create and edit flows share one form contract so field behavior stays consistent when validation is introduced.">
          <TechnicianForm
            title={isEdit ? "Edit technician details" : "New technician details"}
            description="Field names mirror the expected workforce profile payload for later API integration."
            submitLabel={isEdit ? "Save changes" : "Create technician"}
            values={values}
            technicianId={technicianId}
          />
        </SectionWrapper>

        <SectionWrapper title="Implementation notes" description="Keep the module stable now so later workforce and scheduling APIs can layer in without UI churn.">
          <Card>
            <CardHeader>
              <CardDescription>Recommended integration approach</CardDescription>
              <CardTitle>Future API notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
              <p>Map this form to a single technician profile DTO and keep shift assignment, credentials, and leave calendars as adjacent resources.</p>
              <p>Use shared validation rules across create and edit, with route-level default values hydrated from the technician detail payload.</p>
              <p>When dispatch scheduling arrives, prefer linking workload and assignment data from dedicated endpoints instead of inflating the profile form contract.</p>
            </CardContent>
          </Card>
        </SectionWrapper>
      </div>
    </PageContainer>
  );
}

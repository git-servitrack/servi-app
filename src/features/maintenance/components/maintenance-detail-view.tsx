import Link from "next/link";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DiagnosisNotesPanel } from "@/features/maintenance/components/diagnosis-notes-panel";
import { MaintenanceAssignmentUi } from "@/features/maintenance/components/maintenance-assignment-ui";
import { MaintenanceStatusBadge } from "@/features/maintenance/components/maintenance-status-badge";
import { RepairActionList } from "@/features/maintenance/components/repair-action-list";
import { getMaintenanceWorkflowRoute } from "@/features/maintenance/lib/maintenance";
import type { MaintenanceRecord } from "@/features/maintenance/types/maintenance";

export function MaintenanceDetailView({ item }: { item: MaintenanceRecord }) {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Maintenance Details"
        title={item.assetName}
        description="Review diagnosis, assignment ownership, repair tasks, and workflow readiness from a single maintenance detail surface."
        actions={
          <>
            <MaintenanceStatusBadge status={item.status} />
            <Button asChild>
              <Link href={getMaintenanceWorkflowRoute(item.id)}>Open workflow</Link>
            </Button>
          </>
        }
      />

      <section className="grid gap-4 lg:grid-cols-4">
        {[
          { label: "Work Order", value: item.workOrder },
          { label: "Request Ticket", value: item.requestTicket },
          { label: "Site", value: item.site },
          { label: "Priority", value: item.priority },
        ].map((detail) => (
          <Card key={detail.label}>
            <CardHeader>
              <CardDescription>{detail.label}</CardDescription>
              <CardTitle className="text-2xl">{detail.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <SectionWrapper title="Diagnosis" description="Keep diagnosis notes separate from the action list so technicians and reviewers can scan the root issue quickly.">
          <DiagnosisNotesPanel notes={item.diagnosisNotes} />
        </SectionWrapper>

        <SectionWrapper title="Assignment" description="Assignment metadata should remain stable so scheduling or dispatch updates can evolve independently later.">
          <MaintenanceAssignmentUi assignment={item.assignment} />
        </SectionWrapper>
      </div>

      <SectionWrapper title="Repair action list" description="Structured repair actions make the workflow easier to audit and later sync with task-based backend models.">
        <RepairActionList actions={item.repairActions} />
      </SectionWrapper>
    </PageContainer>
  );
}

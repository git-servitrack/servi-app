import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DiagnosisNotesPanel } from "@/features/maintenance/components/diagnosis-notes-panel";
import { MaintenanceAssignmentUi } from "@/features/maintenance/components/maintenance-assignment-ui";
import { MaintenanceCompletionForm } from "@/features/maintenance/components/maintenance-completion-form";
import { MaintenanceStatusBadge } from "@/features/maintenance/components/maintenance-status-badge";
import { MaintenanceTimeline } from "@/features/maintenance/components/maintenance-timeline";
import { RepairActionList } from "@/features/maintenance/components/repair-action-list";
import type { MaintenanceRecord } from "@/features/maintenance/types/maintenance";

const workflowSteps = [
  "Assigned",
  "Diagnosing",
  "Awaiting Parts",
  "Repair In Progress",
  "Ready for QA",
  "Completed",
] as const;

export function MaintenanceWorkflowView({ item }: { item: MaintenanceRecord }) {
  const currentStepIndex = workflowSteps.findIndex((step) => step === item.status);

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Maintenance Workflow"
        title={`Workflow for ${item.workOrder}`}
        description="This view emphasizes progression, blockers, assignment, and completion readiness so maintenance work remains operationally clear."
        actions={<MaintenanceStatusBadge status={item.status} />}
      />

      <SectionWrapper title="Workflow stage" description="Use clear step visibility so the team can quickly understand whether the job is blocked, active, or ready for close-out.">
        <div className="grid gap-3 lg:grid-cols-6">
          {workflowSteps.map((step, index) => {
            const isActive = index === currentStepIndex;
            const isComplete = index < currentStepIndex;

            return (
              <Card key={step} className={isActive ? "border-primary bg-primary/5" : isComplete ? "border-accent/30 bg-accent/5" : ""}>
                <CardHeader className="gap-2 p-4">
                  <CardDescription>{isComplete ? "Completed" : isActive ? "Current" : "Upcoming"}</CardDescription>
                  <CardTitle className="text-lg">{step}</CardTitle>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </SectionWrapper>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <SectionWrapper title="Timeline" description="Timeline events show how the work order moved between dispatch, diagnosis, and repair.">
          <MaintenanceTimeline events={item.timeline} />
        </SectionWrapper>

        <SectionWrapper title="Assignment and diagnosis" description="Current ownership and diagnosis notes stay close to the workflow so blockers are visible in one pass.">
          <div className="space-y-6">
            <MaintenanceAssignmentUi maintenanceId={item.id} assignment={item.assignment} />
            <DiagnosisNotesPanel notes={item.diagnosisNotes} />
          </div>
        </SectionWrapper>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <SectionWrapper title="Repair actions" description="Break the repair into explicit steps to keep accountability and progress visible.">
          <RepairActionList actions={item.repairActions} />
        </SectionWrapper>

        <SectionWrapper title="Completion handoff" description="The completion form is ready for later validation and mutation wiring.">
          <MaintenanceCompletionForm maintenanceId={item.id} values={item.completion} />
          <Card>
            <CardHeader>
              <CardDescription>Scalability note</CardDescription>
              <CardTitle>Future detail-page expansion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
              <p>Keep workflow, diagnostic history, and completion records separable so larger work orders do not overload the core detail route.</p>
              <p>Recommended later API split: work order detail, task actions, timeline audit log, and completion payload.</p>
            </CardContent>
          </Card>
        </SectionWrapper>
      </div>
    </PageContainer>
  );
}

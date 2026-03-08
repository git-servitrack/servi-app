import Link from "next/link";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Button } from "@/components/ui/button";
import { getTechnicianEditRoute } from "@/features/technicians/lib/technicians";
import type { TechnicianRecord } from "@/features/technicians/types/technicians";
import { TechnicianHistoryTable } from "@/features/technicians/components/technician-history-table";
import { TechnicianProfileCard } from "@/features/technicians/components/technician-profile-card";
import { TechnicianScorecardView } from "@/features/technicians/components/technician-scorecard-view";
import { TechnicianStatusBadge } from "@/features/technicians/components/technician-status-badge";
import { WorkloadSummarySection } from "@/features/technicians/components/workload-summary-section";

export function TechnicianDetailView({ technician }: { technician: TechnicianRecord }) {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Technician Details"
        title={technician.name}
        description="Centralized technician profile context covering assignment load, performance indicators, and recent work history."
        actions={
          <>
            <TechnicianStatusBadge status={technician.status} />
            <Button asChild>
              <Link href={getTechnicianEditRoute(technician.id)}>Edit technician</Link>
            </Button>
          </>
        }
      />

      <SectionWrapper
        title="Profile"
        description="The profile card is designed to stay stable as personnel, credential, and schedule data expand in later phases."
      >
        <TechnicianProfileCard technician={technician} />
      </SectionWrapper>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <SectionWrapper title="Workload summary" description="Operational workload stays separate from scorecard metrics so dispatch and performance data can evolve independently.">
          <WorkloadSummarySection workload={technician.workload} />
        </SectionWrapper>

        <SectionWrapper title="Scorecard" description="Performance metrics are isolated for straightforward API hydration from reporting or workforce endpoints later.">
          <TechnicianScorecardView scorecard={technician.scorecard} />
        </SectionWrapper>
      </div>

      <SectionWrapper
        title="Recent technician history"
        description="Recent work-order context helps supervisors review technician output without mixing assignment history into the core profile card."
      >
        <TechnicianHistoryTable items={technician.history} />
      </SectionWrapper>
    </PageContainer>
  );
}

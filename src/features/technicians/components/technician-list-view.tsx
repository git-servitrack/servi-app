import Link from "next/link";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { ModuleStatGrid } from "@/components/shared/module-stat-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { TechnicianTable } from "@/features/technicians/components/technician-table";
import { technicianRecords } from "@/features/technicians/data/technicians";

export function TechnicianListView() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Technician Module"
        title="Technician directory"
        description="Monitor technician availability, skill coverage, and live assignment load with a structure ready for future dispatch and workforce APIs."
        actions={
          <>
            <Badge variant="accent">{technicianRecords.length} active profiles</Badge>
            <Button asChild>
              <Link href={`${ROUTES.technicians}/new`}>Create technician</Link>
            </Button>
          </>
        }
      />

      <ModuleStatGrid
        items={[
          { label: "Available now", value: technicianRecords.filter((item) => item.status === "Available").length.toString(), hint: "Technicians ready for dispatch" },
          { label: "On assignment", value: technicianRecords.filter((item) => item.status === "On Assignment").length.toString(), hint: "Profiles currently tied to active work" },
          { label: "Coverage teams", value: new Set(technicianRecords.map((item) => item.team)).size.toString(), hint: "Distinct service teams represented" },
        ]}
      />

      <SectionWrapper
        title="Technician listing"
        description="Typed table composition keeps profile, coverage, and current workload visible without making the route file carry module logic."
      >
        <TechnicianTable technicians={technicianRecords} />
      </SectionWrapper>
    </PageContainer>
  );
}

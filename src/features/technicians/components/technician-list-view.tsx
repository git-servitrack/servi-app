import Link from "next/link";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            label: "Available now",
            value: technicianRecords.filter((item) => item.status === "Available").length.toString(),
            hint: "Technicians ready for dispatch",
          },
          {
            label: "On assignment",
            value: technicianRecords.filter((item) => item.status === "On Assignment").length.toString(),
            hint: "Profiles currently tied to active work",
          },
          {
            label: "Coverage teams",
            value: new Set(technicianRecords.map((item) => item.team)).size.toString(),
            hint: "Distinct service teams represented",
          },
        ].map((item) => (
          <Card key={item.label}>
            <CardHeader>
              <CardDescription>{item.label}</CardDescription>
              <CardTitle className="text-4xl">{item.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">{item.hint}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <SectionWrapper
        title="Technician listing"
        description="Typed table composition keeps profile, coverage, and current workload visible without making the route file carry module logic."
      >
        <TechnicianTable technicians={technicianRecords} />
      </SectionWrapper>
    </PageContainer>
  );
}

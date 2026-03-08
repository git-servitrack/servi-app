import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { ModuleStatGrid } from "@/components/shared/module-stat-grid";
import { Badge } from "@/components/ui/badge";
import { maintenanceRecords } from "@/features/maintenance/data/maintenance";
import { MaintenanceTable } from "@/features/maintenance/components/maintenance-table";

export function MaintenanceListView() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Maintenance Module"
        title="Maintenance queue"
        description="Track work orders, assignment ownership, repair progress, and workflow readiness with a structure prepared for real maintenance data later."
        actions={<Badge variant="accent">{maintenanceRecords.length} active work orders</Badge>}
      />

      <ModuleStatGrid
        items={[
          { label: "Active repairs", value: maintenanceRecords.filter((item) => item.status === "Repair In Progress").length.toString(), hint: "Jobs currently under technician action" },
          { label: "Awaiting parts", value: maintenanceRecords.filter((item) => item.status === "Awaiting Parts").length.toString(), hint: "Blocked until supply or procurement completes" },
          { label: "Ready for handoff", value: maintenanceRecords.filter((item) => item.status === "Ready for QA" || item.status === "Completed").length.toString(), hint: "Jobs nearing completion or already closed" },
        ]}
      />

      <SectionWrapper title="Maintenance listing" description="The maintenance table gives a quick operational view of work order ownership and current stage.">
        <MaintenanceTable items={maintenanceRecords} />
      </SectionWrapper>
    </PageContainer>
  );
}

import Link from "next/link";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { ModuleStatGrid } from "@/components/shared/module-stat-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { sparePartRecords } from "@/features/spare-parts/data/spare-parts";
import { SparePartsTable } from "@/features/spare-parts/components/spare-parts-table";

export function SparePartsListView() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Spare Parts Module"
        title="Spare parts inventory"
        description="Track stock health, reservation pressure, and part availability with a layout designed for future inventory APIs and procurement workflows."
        actions={
          <>
            <Badge variant="accent">{sparePartRecords.length} stocked parts</Badge>
            <Button asChild>
              <Link href={`${ROUTES.spareParts}/new`}>Create spare part</Link>
            </Button>
          </>
        }
      />

      <ModuleStatGrid
        items={[
          { label: "In healthy stock", value: sparePartRecords.filter((part) => part.status === "In Stock").length.toString(), hint: "Parts above reorder threshold" },
          { label: "Needs attention", value: sparePartRecords.filter((part) => part.status === "Low Stock" || part.status === "Critical" || part.status === "Out of Stock").length.toString(), hint: "Parts requiring replenishment or action" },
          { label: "Reserved quantity", value: sparePartRecords.reduce((total, part) => total + part.reservedStock, 0).toString(), hint: "Units already committed to work orders" },
        ]}
      />

      <SectionWrapper
        title="Inventory listing"
        description="The list view keeps stock position, location, and low-stock pressure readable before adding filters, pagination, or real-time stock events."
      >
        <SparePartsTable parts={sparePartRecords} />
      </SectionWrapper>
    </PageContainer>
  );
}

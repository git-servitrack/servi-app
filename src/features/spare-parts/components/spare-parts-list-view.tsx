import Link from "next/link";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            label: "In healthy stock",
            value: sparePartRecords.filter((part) => part.status === "In Stock").length.toString(),
            hint: "Parts above reorder threshold",
          },
          {
            label: "Needs attention",
            value: sparePartRecords.filter((part) => part.status === "Low Stock" || part.status === "Critical" || part.status === "Out of Stock").length.toString(),
            hint: "Parts requiring replenishment or action",
          },
          {
            label: "Reserved quantity",
            value: sparePartRecords.reduce((total, part) => total + part.reservedStock, 0).toString(),
            hint: "Units already committed to work orders",
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
        title="Inventory listing"
        description="The list view keeps stock position, location, and low-stock pressure readable before adding filters, pagination, or real-time stock events."
      >
        <SparePartsTable parts={sparePartRecords} />
      </SectionWrapper>
    </PageContainer>
  );
}

import Link from "next/link";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSparePartEditRoute } from "@/features/spare-parts/lib/spare-parts";
import type { SparePartRecord } from "@/features/spare-parts/types/spare-parts";
import { LowStockIndicator } from "@/features/spare-parts/components/low-stock-indicator";
import { PartUsageSection } from "@/features/spare-parts/components/part-usage-section";
import { StockBadge } from "@/features/spare-parts/components/stock-badge";
import { StockMovementHistoryView } from "@/features/spare-parts/components/stock-movement-history-view";

export function SparePartDetailView({ part }: { part: SparePartRecord }) {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Spare Part Details"
        title={part.name}
        description="Inventory detail focused on stock position, issue history, and operational consumption so procurement and maintenance teams read the same source of truth."
        actions={
          <>
            <StockBadge status={part.status} />
            <Button asChild>
              <Link href={getSparePartEditRoute(part.id)}>Edit part</Link>
            </Button>
          </>
        }
      />

      <section className="grid gap-4 lg:grid-cols-4">
        {[
          { label: "Part Number", value: part.partNumber },
          { label: "Stock On Hand", value: `${part.stockOnHand} ${part.unit}` },
          { label: "Reserved", value: `${part.reservedStock} ${part.unit}` },
          { label: "Reorder Point", value: `${part.reorderPoint} ${part.unit}` },
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
        <SectionWrapper title="Inventory profile" description="Storage, compatibility, and supply details remain together so the part record can scale without fragmenting the core inventory view.">
          <Card>
            <CardContent className="grid gap-4 p-6 md:grid-cols-2">
              {[
                { label: "Category", value: part.category },
                { label: "Site", value: part.site },
                { label: "Compatible Assets", value: part.compatibleAssets },
                { label: "Bin Location", value: part.binLocation },
                { label: "Supplier", value: part.supplier },
              ].map((item) => (
                <div key={item.label} className="rounded-[calc(var(--radius)-0.15rem)] border border-border/70 bg-background/65 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                  <p className="mt-2 text-sm font-medium text-foreground">{item.value}</p>
                </div>
              ))}
              <div className="rounded-[calc(var(--radius)-0.15rem)] border border-border/70 bg-background/65 p-4 md:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Operational Notes</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{part.notes}</p>
              </div>
            </CardContent>
          </Card>
        </SectionWrapper>

        <SectionWrapper title="Stock signal" description="Keep low-stock visibility separate from raw counts so decision pressure stays obvious on mobile and desktop.">
          <Card>
            <CardHeader>
              <CardDescription>Inventory health</CardDescription>
              <CardTitle>Replenishment state</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <LowStockIndicator stockOnHand={part.stockOnHand} reorderPoint={part.reorderPoint} />
              <p className="text-sm leading-6 text-muted-foreground">
                Available stock after reservations: {part.stockOnHand - part.reservedStock} {part.unit}. Use this panel later for supplier lead time, reorder ETA, and procurement status.
              </p>
            </CardContent>
          </Card>
        </SectionWrapper>
      </div>

      <SectionWrapper title="Stock movement history" description="Movement records should remain audit-focused so inventory variance and replenishment events are easy to review later.">
        <StockMovementHistoryView items={part.movements} />
      </SectionWrapper>

      <SectionWrapper title="Part usage" description="Usage records show how the part is consumed in actual maintenance work without mixing those events into stock adjustment history.">
        <PartUsageSection items={part.usage} />
      </SectionWrapper>
    </PageContainer>
  );
}

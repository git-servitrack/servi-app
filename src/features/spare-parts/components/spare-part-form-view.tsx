import Link from "next/link";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { StockAdjustmentForm } from "@/features/spare-parts/components/stock-adjustment-form";
import type { SparePartFormValues } from "@/features/spare-parts/types/spare-parts";

interface SparePartFormViewProps {
  mode: "create" | "edit";
  values: SparePartFormValues;
  partId?: string;
}

export function SparePartFormView({ mode, values, partId }: SparePartFormViewProps) {
  const isEdit = mode === "edit";

  return (
    <PageContainer>
      <PageHeader
        eyebrow={isEdit ? "Edit Spare Part" : "Create Spare Part"}
        title={isEdit ? "Update spare part record" : "Create spare part record"}
        description={
          isEdit
            ? "Keep part metadata, storage details, and stock thresholds aligned so later inventory actions can stay predictable."
            : "Set up a reusable inventory record shape that can later support procurement, stock issue, and reconciliation flows."
        }
        actions={
          <>
            <Badge variant="outline">{isEdit ? "Edit flow" : "Create flow"}</Badge>
            <Button asChild variant="outline">
              <Link href={ROUTES.spareParts}>Back to spare parts</Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionWrapper title="Inventory form" description="Create and edit share one contract so stock fields and thresholds behave consistently across routes.">
          <StockAdjustmentForm
            title={isEdit ? "Edit inventory details" : "New inventory details"}
            description="This form covers the stable record shape for spare parts before real stock adjustments become transactional."
            submitLabel={isEdit ? "Save changes" : "Create spare part"}
            values={values}
            partId={partId}
          />
        </SectionWrapper>

        <SectionWrapper title="Inventory guidance" description="Keep the base record lean now so later transaction workflows can extend without reworking the form surface.">
          <Card>
            <CardHeader>
              <CardDescription>Recommended integration approach</CardDescription>
              <CardTitle>Future API notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
              <p>Use one part master DTO for this form, and handle stock issues, receipts, and adjustments as separate inventory transaction endpoints.</p>
              <p>Hydrate edit defaults from the part detail payload so create and edit can share the same validation schema later.</p>
              <p>When procurement arrives, add supplier lead time, purchase order references, and restock ETA as adjacent views rather than inflating the base record form.</p>
            </CardContent>
          </Card>
        </SectionWrapper>
      </div>
    </PageContainer>
  );
}

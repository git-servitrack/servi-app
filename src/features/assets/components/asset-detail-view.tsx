import Link from "next/link";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AssetDetailsPanel } from "@/features/assets/components/asset-details-panel";
import { AssetStatusBadge } from "@/features/assets/components/asset-status-badge";
import { getAssetEditRoute } from "@/features/assets/lib/assets";
import type { AssetRecord } from "@/features/assets/types/assets";

export function AssetDetailView({ asset }: { asset: AssetRecord }) {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Asset Details"
        title={asset.name}
        description="Detailed operational context for a single asset record, including ownership, service cadence, and maintenance notes."
        actions={
          <>
            <AssetStatusBadge status={asset.status} />
            <Button asChild>
              <Link href={getAssetEditRoute(asset.id)}>Edit asset</Link>
            </Button>
          </>
        }
      />

      <SectionWrapper
        title="Asset profile"
        description="This detail panel is structured for future API hydration and side-by-side expansion with service history."
      >
        <AssetDetailsPanel asset={asset} />
      </SectionWrapper>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardDescription>Service planning</CardDescription>
            <CardTitle>Maintenance context</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>Last serviced on {asset.lastServiceDate}. Next planned service is {asset.nextServiceDate}.</p>
            <p>The assigned team is {asset.assignedTeam}, with current asset criticality marked as {asset.criticality.toLowerCase()}.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>API integration notes</CardDescription>
            <CardTitle>Future data shape</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>Later phases can enrich this route with maintenance history, linked documentation, and service request relationships without changing the base panel contract.</p>
            <p>Recommended future API split: asset detail payload, maintenance summary payload, and linked documents payload.</p>
          </CardContent>
        </Card>
      </section>
    </PageContainer>
  );
}

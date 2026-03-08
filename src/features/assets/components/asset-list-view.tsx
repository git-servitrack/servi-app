import Link from "next/link";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { AssetFilters } from "@/features/assets/components/asset-filters";
import { AssetTable } from "@/features/assets/components/asset-table";
import { assetFilterOptions, assetRecords, defaultAssetFilters } from "@/features/assets/data/assets";
import { filterAssets } from "@/features/assets/lib/assets";

const filteredAssets = filterAssets(assetRecords, defaultAssetFilters);

export function AssetListView() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Asset Module"
        title="Asset register"
        description="Manage operational assets, watch service schedules, and keep site ownership visible before backend integration is connected."
        actions={
          <>
            <Badge variant="accent">{assetRecords.length} tracked assets</Badge>
            <Button asChild>
              <Link href={`${ROUTES.assets}/new`}>Create asset</Link>
            </Button>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Operational", value: assetRecords.filter((asset) => asset.status === "Operational").length.toString(), hint: "Assets ready for active use" },
          { label: "Maintenance Due", value: assetRecords.filter((asset) => asset.status === "Maintenance Due").length.toString(), hint: "Scheduled attention this cycle" },
          { label: "Under Repair", value: assetRecords.filter((asset) => asset.status === "Under Repair").length.toString(), hint: "Repair queue currently active" },
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
        title="Filters"
        description="Filter wiring remains static in this phase, but the structure is ready for URL state or API-backed queries later."
      >
        <AssetFilters
          filters={defaultAssetFilters}
          categoryOptions={assetFilterOptions.categories}
          siteOptions={assetFilterOptions.sites}
          statusOptions={assetFilterOptions.statuses}
        />
      </SectionWrapper>

      <SectionWrapper
        title="Asset listing"
        description="Typed table composition designed to map cleanly to later API pagination and filter responses."
      >
        <AssetTable assets={filteredAssets} />
      </SectionWrapper>
    </PageContainer>
  );
}

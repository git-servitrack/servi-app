import Link from "next/link";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { ModuleStatGrid } from "@/components/shared/module-stat-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

      <ModuleStatGrid
        items={[
          { label: "Operational", value: assetRecords.filter((asset) => asset.status === "Operational").length.toString(), hint: "Assets ready for active use" },
          { label: "Maintenance Due", value: assetRecords.filter((asset) => asset.status === "Maintenance Due").length.toString(), hint: "Scheduled attention this cycle" },
          { label: "Under Repair", value: assetRecords.filter((asset) => asset.status === "Under Repair").length.toString(), hint: "Repair queue currently active" },
        ]}
      />

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

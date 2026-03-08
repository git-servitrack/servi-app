import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AssetStatusBadge } from "@/features/assets/components/asset-status-badge";
import type { AssetRecord } from "@/features/assets/types/assets";

const detailSections = [
  { label: "Category", key: "category" },
  { label: "Site", key: "site" },
  { label: "Assigned Team", key: "assignedTeam" },
  { label: "Manufacturer", key: "manufacturer" },
  { label: "Model", key: "model" },
  { label: "Serial Number", key: "serialNumber" },
  { label: "Last Service", key: "lastServiceDate" },
  { label: "Next Service", key: "nextServiceDate" },
] as const;

export function AssetDetailsPanel({ asset }: { asset: AssetRecord }) {
  return (
    <Card>
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <CardDescription>Asset record</CardDescription>
            <CardTitle className="text-3xl">{asset.name}</CardTitle>
            <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
              {asset.id} · {asset.code}
            </p>
          </div>
          <AssetStatusBadge status={asset.status} />
        </div>
        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">{asset.condition}</p>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {detailSections.map((detail) => (
          <div key={detail.key} className="rounded-[calc(var(--radius)-0.15rem)] border border-border/70 bg-background/65 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{detail.label}</p>
            <p className="mt-2 text-sm font-medium text-foreground">{asset[detail.key]}</p>
          </div>
        ))}
        <div className="rounded-[calc(var(--radius)-0.15rem)] border border-border/70 bg-background/65 p-4 md:col-span-2 xl:col-span-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Notes</p>
          <p className="mt-2 text-sm leading-6 text-foreground">{asset.notes}</p>
        </div>
      </CardContent>
    </Card>
  );
}

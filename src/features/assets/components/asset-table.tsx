import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AssetStatusBadge } from "@/features/assets/components/asset-status-badge";
import { getAssetDetailRoute, getAssetEditRoute } from "@/features/assets/lib/assets";
import type { AssetRecord } from "@/features/assets/types/assets";

export function AssetTable({ assets }: { assets: AssetRecord[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Asset</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Site</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Team</TableHead>
          <TableHead>Next Service</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assets.map((asset) => (
          <TableRow key={asset.id}>
            <TableCell>
              <div className="space-y-1">
                <p className="font-semibold text-foreground">{asset.name}</p>
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  {asset.id} · {asset.code}
                </p>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">{asset.category}</TableCell>
            <TableCell className="text-muted-foreground">{asset.site}</TableCell>
            <TableCell>
              <AssetStatusBadge status={asset.status} />
            </TableCell>
            <TableCell className="text-muted-foreground">{asset.assignedTeam}</TableCell>
            <TableCell className="text-muted-foreground">{asset.nextServiceDate}</TableCell>
            <TableCell>
              <div className="flex justify-end gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={getAssetDetailRoute(asset.id)}>View</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href={getAssetEditRoute(asset.id)}>Edit</Link>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

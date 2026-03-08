import Link from "next/link";

import { EmptyTableState } from "@/components/shared/empty-table-state";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getSparePartDetailRoute, getSparePartEditRoute } from "@/features/spare-parts/lib/spare-parts";
import type { SparePartRecord } from "@/features/spare-parts/types/spare-parts";
import { LowStockIndicator } from "@/features/spare-parts/components/low-stock-indicator";
import { StockBadge } from "@/features/spare-parts/components/stock-badge";

export function SparePartsTable({ parts }: { parts: SparePartRecord[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Part</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Site</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Stock On Hand</TableHead>
          <TableHead>Reserved</TableHead>
          <TableHead>Low Stock Signal</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {parts.length === 0 ? (
          <EmptyTableState colSpan={8} title="No spare parts found" description="Create a spare part record or broaden the current inventory scope." />
        ) : parts.map((part) => (
          <TableRow key={part.id}>
            <TableCell>
              <div className="space-y-1">
                <p className="font-semibold text-foreground">{part.name}</p>
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{part.partNumber}</p>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">{part.category}</TableCell>
            <TableCell className="text-muted-foreground">{part.site}</TableCell>
            <TableCell>
              <StockBadge status={part.status} />
            </TableCell>
            <TableCell className="text-muted-foreground">{part.stockOnHand} {part.unit}</TableCell>
            <TableCell className="text-muted-foreground">{part.reservedStock} {part.unit}</TableCell>
            <TableCell>
              <LowStockIndicator stockOnHand={part.stockOnHand} reorderPoint={part.reorderPoint} />
            </TableCell>
            <TableCell>
              <div className="flex justify-end gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={getSparePartDetailRoute(part.id)}>View</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href={getSparePartEditRoute(part.id)}>Edit</Link>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

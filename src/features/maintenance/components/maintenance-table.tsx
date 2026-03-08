import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getMaintenanceDetailRoute, getMaintenanceWorkflowRoute } from "@/features/maintenance/lib/maintenance";
import type { MaintenanceRecord } from "@/features/maintenance/types/maintenance";
import { MaintenanceStatusBadge } from "@/features/maintenance/components/maintenance-status-badge";

export function MaintenanceTable({ items }: { items: MaintenanceRecord[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Work Order</TableHead>
          <TableHead>Asset</TableHead>
          <TableHead>Site</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Team</TableHead>
          <TableHead>Scheduled</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <div className="space-y-1">
                <p className="font-semibold text-foreground">{item.workOrder}</p>
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{item.requestTicket}</p>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">{item.assetName}</TableCell>
            <TableCell className="text-muted-foreground">{item.site}</TableCell>
            <TableCell>
              <MaintenanceStatusBadge status={item.status} />
            </TableCell>
            <TableCell className="text-muted-foreground">{item.assignedTeam}</TableCell>
            <TableCell className="text-muted-foreground">{item.scheduledFor}</TableCell>
            <TableCell>
              <div className="flex justify-end gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={getMaintenanceDetailRoute(item.id)}>Details</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href={getMaintenanceWorkflowRoute(item.id)}>Workflow</Link>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

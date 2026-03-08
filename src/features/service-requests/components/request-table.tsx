import Link from "next/link";

import { EmptyTableState } from "@/components/shared/empty-table-state";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getServiceRequestDetailRoute, getServiceRequestEditRoute } from "@/features/service-requests/lib/service-requests";
import type { ServiceRequestRecord } from "@/features/service-requests/types/service-requests";
import { RequestStatusBadge } from "@/features/service-requests/components/request-status-badge";

export function RequestTable({ requests }: { requests: ServiceRequestRecord[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Request</TableHead>
          <TableHead>Requester</TableHead>
          <TableHead>Site</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Scheduled</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.length === 0 ? (
          <EmptyTableState colSpan={7} title="No requests found" description="Try a broader filter or create a new service request." />
        ) : requests.map((request) => (
          <TableRow key={request.id}>
            <TableCell>
              <div className="space-y-1">
                <p className="font-semibold text-foreground">{request.title}</p>
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  {request.ticketNumber} | {request.assetName}
                </p>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">{request.requester}</TableCell>
            <TableCell className="text-muted-foreground">{request.site}</TableCell>
            <TableCell>
              <RequestStatusBadge status={request.status} />
            </TableCell>
            <TableCell className="text-muted-foreground">{request.priority}</TableCell>
            <TableCell className="text-muted-foreground">{request.scheduledFor}</TableCell>
            <TableCell>
              <div className="flex justify-end gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={getServiceRequestDetailRoute(request.id)}>View</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href={getServiceRequestEditRoute(request.id)}>Update</Link>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

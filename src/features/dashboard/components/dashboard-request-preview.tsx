import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ROUTES } from "@/constants/routes";
import type { DashboardRequestItem } from "@/features/dashboard/types/dashboard";

const statusVariant = {
  New: "accent",
  "Under Review": "secondary",
  Scheduled: "default",
  Resolved: "outline",
} as const;

export function DashboardRequestPreview({ items }: { items: DashboardRequestItem[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <CardTitle>Request summary</CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">Incoming issues across sites that need action or scheduling.</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href={ROUTES.serviceRequests}>Open module</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Request</TableHead>
              <TableHead>Requester</TableHead>
              <TableHead>Site</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Submitted</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">{item.issue}</p>
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{item.id}</p>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{item.requester}</TableCell>
                <TableCell className="text-muted-foreground">{item.site}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[item.status]}>{item.status}</Badge>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">{item.submittedAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

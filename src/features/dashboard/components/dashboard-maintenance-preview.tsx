import { ROUTES } from "@/constants/routes";
import type { DashboardMaintenanceItem } from "@/features/dashboard/types/dashboard";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";

const priorityVariant = {
  Critical: "accent",
  High: "default",
  Medium: "secondary",
  Low: "outline",
} as const;

const statusVariant = {
  Assigned: "outline",
  "In Progress": "default",
  "Awaiting Parts": "secondary",
  Completed: "accent",
} as const;

export function DashboardMaintenancePreview({ items }: { items: DashboardMaintenanceItem[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <CardTitle>Maintenance summary</CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">Current high-priority jobs and active assignments.</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href={ROUTES.maintenance}>Open module</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Work order</TableHead>
              <TableHead>Technician</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Due</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">{item.asset}</p>
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{item.id}</p>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{item.technician}</TableCell>
                <TableCell>
                  <Badge variant={priorityVariant[item.priority]}>{item.priority}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[item.status]}>{item.status}</Badge>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">{item.dueDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

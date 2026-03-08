import Link from "next/link";

import { EmptyTableState } from "@/components/shared/empty-table-state";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getTechnicianDetailRoute, getTechnicianEditRoute } from "@/features/technicians/lib/technicians";
import type { TechnicianRecord } from "@/features/technicians/types/technicians";
import { TechnicianStatusBadge } from "@/features/technicians/components/technician-status-badge";

export function TechnicianTable({ technicians }: { technicians: TechnicianRecord[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Technician</TableHead>
          <TableHead>Team</TableHead>
          <TableHead>Primary Skill</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Coverage</TableHead>
          <TableHead>Active Assignments</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {technicians.length === 0 ? (
          <EmptyTableState colSpan={7} title="No technicians found" description="Add a technician profile to start building assignment coverage." />
        ) : technicians.map((technician) => (
          <TableRow key={technician.id}>
            <TableCell>
              <div className="space-y-1">
                <p className="font-semibold text-foreground">{technician.name}</p>
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{technician.employeeId}</p>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">{technician.team}</TableCell>
            <TableCell className="text-muted-foreground">{technician.primarySkill}</TableCell>
            <TableCell>
              <TechnicianStatusBadge status={technician.status} />
            </TableCell>
            <TableCell className="text-muted-foreground">{technician.siteCoverage}</TableCell>
            <TableCell className="text-muted-foreground">{technician.workload.activeAssignments}</TableCell>
            <TableCell>
              <div className="flex justify-end gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={getTechnicianDetailRoute(technician.id)}>View</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href={getTechnicianEditRoute(technician.id)}>Edit</Link>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

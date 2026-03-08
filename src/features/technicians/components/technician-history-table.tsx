import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { TechnicianHistoryItem } from "@/features/technicians/types/technicians";

export function TechnicianHistoryTable({ items }: { items: TechnicianHistoryItem[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Work Order</TableHead>
          <TableHead>Asset</TableHead>
          <TableHead>Result</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="text-muted-foreground">{item.date}</TableCell>
            <TableCell className="font-medium text-foreground">{item.workOrder}</TableCell>
            <TableCell className="text-muted-foreground">{item.asset}</TableCell>
            <TableCell className="text-muted-foreground">{item.result}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

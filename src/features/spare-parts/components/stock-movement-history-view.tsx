import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { StockMovementItem } from "@/features/spare-parts/types/spare-parts";

export function StockMovementHistoryView({ items }: { items: StockMovementItem[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Reference</TableHead>
          <TableHead>Notes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="text-muted-foreground">{item.date}</TableCell>
            <TableCell className="font-medium text-foreground">{item.type}</TableCell>
            <TableCell className="text-muted-foreground">{item.quantity}</TableCell>
            <TableCell className="text-muted-foreground">{item.reference}</TableCell>
            <TableCell className="text-muted-foreground">{item.note}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

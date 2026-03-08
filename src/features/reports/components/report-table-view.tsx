import { EmptyTableState } from "@/components/shared/empty-table-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ReportTableViewProps {
  columns: string[];
  rows: string[][];
}

export function ReportTableView({ columns, rows }: ReportTableViewProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column}>{column}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length === 0 ? (
          <EmptyTableState colSpan={columns.length} title="No report rows available" description="Adjust the active reporting filters or wait for incoming analytics data." />
        ) : rows.map((row, rowIndex) => (
          <TableRow key={`${row.join("-")}-${rowIndex}`}>
            {row.map((cell, cellIndex) => (
              <TableCell key={`${cell}-${cellIndex}`} className={cellIndex === 0 ? "font-medium text-foreground" : "text-muted-foreground"}>
                {cell}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

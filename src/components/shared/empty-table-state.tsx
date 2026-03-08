import { SearchX } from "lucide-react";

import { TableCell, TableRow } from "@/components/ui/table";

interface EmptyTableStateProps {
  colSpan: number;
  title: string;
  description: string;
}

export function EmptyTableState({ colSpan, title, description }: EmptyTableStateProps) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="p-0">
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <SearchX className="size-5" />
          </div>
          <div className="space-y-1">
            <p className="font-medium text-foreground">{title}</p>
            <p className="text-sm leading-6 text-muted-foreground">{description}</p>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}

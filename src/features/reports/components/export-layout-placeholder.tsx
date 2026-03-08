import { FileSpreadsheet, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ExportLayoutPlaceholder() {
  return (
    <Card className="bg-[linear-gradient(160deg,rgba(23,78,79,0.96),rgba(20,32,51,0.96))] text-primary-foreground">
      <CardHeader>
        <CardDescription className="text-primary-foreground/70">Export-ready layout</CardDescription>
        <CardTitle className="text-2xl text-primary-foreground">Reporting output placeholder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm leading-6 text-primary-foreground/80">
        <p>Reserve this surface for PDF, spreadsheet, and print-specific report compositions once server-generated exports are introduced.</p>
        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="secondary" size="sm">
            <FileSpreadsheet className="size-4" />
            Spreadsheet export
          </Button>
          <Button type="button" variant="secondary" size="sm">
            <Printer className="size-4" />
            Print layout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

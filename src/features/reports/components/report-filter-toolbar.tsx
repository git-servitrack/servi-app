import { Download, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ReportFilterState } from "@/features/reports/types/reports";

export function ReportFilterToolbar({ filters }: { filters: ReportFilterState }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid flex-1 gap-4 md:grid-cols-3">
          {[
            { label: "Period", value: filters.period },
            { label: "Site", value: filters.site },
            { label: "Team", value: filters.team },
          ].map((item) => (
            <label key={item.label} className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{item.label}</span>
              <select
                defaultValue={item.value}
                className="flex h-11 w-full rounded-full border border-input bg-background px-4 text-sm text-foreground shadow-sm outline-none"
              >
                <option>{item.value}</option>
              </select>
            </label>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" variant="outline">
            <SlidersHorizontal className="size-4" />
            Adjust filters
          </Button>
          <Button type="button">
            <Download className="size-4" />
            Export report pack
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

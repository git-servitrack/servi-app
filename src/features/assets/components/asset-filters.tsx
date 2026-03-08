"use client";

import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { AssetFilterState } from "@/features/assets/types/assets";

interface AssetFiltersProps {
  filters: AssetFilterState;
  categoryOptions: readonly string[];
  siteOptions: readonly string[];
  statusOptions: readonly string[];
}

export function AssetFilters({
  filters,
  categoryOptions,
  siteOptions,
  statusOptions,
}: AssetFiltersProps) {
  return (
    <Card className="bg-card/85">
      <CardContent className="grid gap-4 p-5 lg:grid-cols-[1.5fr_repeat(3,minmax(0,1fr))_auto]">
        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Search</span>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={filters.query} readOnly className="pl-10" placeholder="Search name, code, category, or site" />
          </div>
        </label>

        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Category</span>
          <select
            value={filters.category}
            disabled
            className="flex h-11 w-full rounded-full border border-input bg-background px-4 text-sm text-foreground shadow-sm outline-none"
          >
            {categoryOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Site</span>
          <select
            value={filters.site}
            disabled
            className="flex h-11 w-full rounded-full border border-input bg-background px-4 text-sm text-foreground shadow-sm outline-none"
          >
            {siteOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Status</span>
          <select
            value={filters.status}
            disabled
            className="flex h-11 w-full rounded-full border border-input bg-background px-4 text-sm text-foreground shadow-sm outline-none"
          >
            {statusOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>

        <div className="flex items-end">
          <Button variant="outline" disabled className="w-full lg:w-auto">
            Filter wiring starts in API phase
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

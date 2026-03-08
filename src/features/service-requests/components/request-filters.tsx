"use client";

import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { RequestFilterState } from "@/features/service-requests/types/service-requests";

interface RequestFiltersProps {
  filters: RequestFilterState;
  statuses: readonly string[];
  priorities: readonly string[];
  sites: readonly string[];
}

export function RequestFilters({ filters, statuses, priorities, sites }: RequestFiltersProps) {
  return (
    <Card className="bg-card/85">
      <CardContent className="grid gap-4 p-5 lg:grid-cols-[1.5fr_repeat(3,minmax(0,1fr))_auto]">
        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Search</span>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={filters.query} readOnly className="pl-10" placeholder="Search request, site, requester, or asset" />
          </div>
        </label>

        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Status</span>
          <select value={filters.status} disabled className="flex h-11 w-full rounded-full border border-input bg-background px-4 text-sm text-foreground shadow-sm outline-none">
            {statuses.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Priority</span>
          <select value={filters.priority} disabled className="flex h-11 w-full rounded-full border border-input bg-background px-4 text-sm text-foreground shadow-sm outline-none">
            {priorities.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Site</span>
          <select value={filters.site} disabled className="flex h-11 w-full rounded-full border border-input bg-background px-4 text-sm text-foreground shadow-sm outline-none">
            {sites.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>

        <div className="flex items-end">
          <Button variant="outline" disabled className="w-full lg:w-auto">
            Live filtering starts with API integration
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

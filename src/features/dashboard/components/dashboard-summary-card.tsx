import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DashboardSummaryMetric } from "@/features/dashboard/types/dashboard";

const trendStyles = {
  up: {
    icon: ArrowUpRight,
    valueClassName: "text-primary",
    chipClassName: "bg-primary/10 text-primary",
  },
  down: {
    icon: ArrowDownRight,
    valueClassName: "text-accent",
    chipClassName: "bg-accent/10 text-accent",
  },
  neutral: {
    icon: ArrowRight,
    valueClassName: "text-muted-foreground",
    chipClassName: "bg-muted text-foreground",
  },
} as const;

export function DashboardSummaryCard({ metric }: { metric: DashboardSummaryMetric }) {
  const trend = trendStyles[metric.trend];
  const TrendIcon = trend.icon;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm leading-6 text-muted-foreground">{metric.label}</p>
            <CardTitle className="mt-2 text-4xl">{metric.value}</CardTitle>
          </div>
          <div className={cn("flex size-11 items-center justify-center rounded-2xl", trend.chipClassName)}>
            <TrendIcon className="size-5" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm">
          <span className={cn("font-semibold", trend.valueClassName)}>{metric.change}</span>
          <span className="text-muted-foreground">{metric.changeLabel}</span>
        </div>
      </CardContent>
    </Card>
  );
}

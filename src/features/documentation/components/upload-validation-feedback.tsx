import { AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { UploadValidationItem } from "@/features/documentation/types/documentation";
import { cn } from "@/lib/utils";

const iconMap = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: ShieldAlert,
} as const;

const toneMap = {
  success: "text-emerald-700 bg-emerald-50 border-emerald-200",
  warning: "text-amber-700 bg-amber-50 border-amber-200",
  error: "text-rose-700 bg-rose-50 border-rose-200",
} as const;

export function UploadValidationFeedback({ items }: { items: UploadValidationItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Upload validation</CardDescription>
        <CardTitle>Submission checks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => {
          const Icon = iconMap[item.level];

          return (
            <div key={item.id} className={cn("rounded-[calc(var(--radius)-0.15rem)] border p-4", toneMap[item.level])}>
              <div className="flex gap-3">
                <Icon className="mt-0.5 size-4 shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className="text-sm leading-6">{item.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

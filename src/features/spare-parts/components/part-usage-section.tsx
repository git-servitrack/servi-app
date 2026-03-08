import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PartUsageItem } from "@/features/spare-parts/types/spare-parts";

export function PartUsageSection({ items }: { items: PartUsageItem[] }) {
  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <Card key={item.id}>
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardDescription>{item.workOrder}</CardDescription>
                <CardTitle className="text-xl">{item.asset}</CardTitle>
              </div>
              <div className="text-sm text-muted-foreground">{item.date}</div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Quantity</p>
              <p className="mt-2 text-sm font-medium text-foreground">{item.quantity}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Technician</p>
              <p className="mt-2 text-sm font-medium text-foreground">{item.technician}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Usage Context</p>
              <p className="mt-2 text-sm font-medium text-foreground">Consumed against active maintenance work</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

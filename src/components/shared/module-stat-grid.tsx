import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export interface ModuleStatItem {
  label: string;
  value: string;
  hint: string;
}

export function ModuleStatGrid({ items }: { items: ModuleStatItem[] }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <Card key={item.label}>
          <CardHeader>
            <CardDescription>{item.label}</CardDescription>
            <CardTitle className="text-4xl">{item.value}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-muted-foreground">{item.hint}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

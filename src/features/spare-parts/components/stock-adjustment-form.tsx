import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { SparePartFormValues, StockStatus } from "@/features/spare-parts/types/spare-parts";

interface StockAdjustmentFormProps {
  title: string;
  description: string;
  submitLabel: string;
  values: SparePartFormValues;
}

const statusOptions: StockStatus[] = ["In Stock", "Low Stock", "Critical", "Out of Stock"];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{children}</span>;
}

export function StockAdjustmentForm({ title, description, submitLabel, values }: StockAdjustmentFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <FieldLabel>Part Name</FieldLabel>
              <Input defaultValue={values.name} placeholder="Compressor Relay" />
            </label>
            <label className="space-y-2">
              <FieldLabel>Part Number</FieldLabel>
              <Input defaultValue={values.partNumber} placeholder="SP-AC-2201" />
            </label>
            <label className="space-y-2">
              <FieldLabel>Category</FieldLabel>
              <Input defaultValue={values.category} placeholder="HVAC Electrical" />
            </label>
            <label className="space-y-2">
              <FieldLabel>Site</FieldLabel>
              <Input defaultValue={values.site} placeholder="Central Office" />
            </label>
            <label className="space-y-2">
              <FieldLabel>Compatible Assets</FieldLabel>
              <Input defaultValue={values.compatibleAssets} placeholder="AHU-08, CU-12, CU-15" />
            </label>
            <label className="space-y-2">
              <FieldLabel>Unit</FieldLabel>
              <Input defaultValue={values.unit} placeholder="pcs" />
            </label>
            <label className="space-y-2">
              <FieldLabel>Stock On Hand</FieldLabel>
              <Input defaultValue={values.stockOnHand} placeholder="18" />
            </label>
            <label className="space-y-2">
              <FieldLabel>Reserved Stock</FieldLabel>
              <Input defaultValue={values.reservedStock} placeholder="4" />
            </label>
            <label className="space-y-2">
              <FieldLabel>Reorder Point</FieldLabel>
              <Input defaultValue={values.reorderPoint} placeholder="10" />
            </label>
            <label className="space-y-2">
              <FieldLabel>Bin Location</FieldLabel>
              <Input defaultValue={values.binLocation} placeholder="Aisle A · Bin 12" />
            </label>
            <label className="space-y-2">
              <FieldLabel>Supplier</FieldLabel>
              <Input defaultValue={values.supplier} placeholder="Metro Controls Supply" />
            </label>
            <label className="space-y-2">
              <FieldLabel>Status</FieldLabel>
              <select
                defaultValue={values.status}
                className="flex h-11 w-full rounded-full border border-input bg-background px-4 text-sm text-foreground shadow-sm outline-none"
              >
                {statusOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="space-y-2">
            <FieldLabel>Inventory Notes</FieldLabel>
            <Textarea defaultValue={values.notes} placeholder="Capture storage conditions, procurement notes, or operational handling constraints." />
          </label>

          <div className="flex flex-col gap-3 rounded-[calc(var(--radius)-0.15rem)] border border-dashed border-border bg-muted/35 p-4 text-sm text-muted-foreground lg:flex-row lg:items-center lg:justify-between">
            <p>Submission and stock mutation workflows remain static in this phase. Validation and backend integration will arrive in the forms and API phase.</p>
            <Button type="button">{submitLabel}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

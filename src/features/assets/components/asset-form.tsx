import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { AssetCriticality, AssetFormValues, AssetStatus } from "@/features/assets/types/assets";

interface AssetFormProps {
  title: string;
  description: string;
  submitLabel: string;
  values: AssetFormValues;
}

const statusOptions: AssetStatus[] = ["Operational", "Maintenance Due", "Under Repair", "Decommissioned"];
const criticalityOptions: AssetCriticality[] = ["Critical", "High", "Medium", "Low"];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{children}</span>;
}

export function AssetForm({ title, description, submitLabel, values }: AssetFormProps) {
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
              <FieldLabel>Asset Name</FieldLabel>
              <Input defaultValue={values.name} placeholder="Main Generator" />
            </label>
            <label className="space-y-2">
              <FieldLabel>Asset Code</FieldLabel>
              <Input defaultValue={values.code} placeholder="GEN-104" />
            </label>
            <label className="space-y-2">
              <FieldLabel>Category</FieldLabel>
              <Input defaultValue={values.category} placeholder="Power Systems" />
            </label>
            <label className="space-y-2">
              <FieldLabel>Site</FieldLabel>
              <Input defaultValue={values.site} placeholder="Central Office" />
            </label>
            <label className="space-y-2">
              <FieldLabel>Assigned Team</FieldLabel>
              <Input defaultValue={values.assignedTeam} placeholder="Electrical" />
            </label>
            <label className="space-y-2">
              <FieldLabel>Manufacturer</FieldLabel>
              <Input defaultValue={values.manufacturer} placeholder="Caterpillar" />
            </label>
            <label className="space-y-2">
              <FieldLabel>Model</FieldLabel>
              <Input defaultValue={values.model} placeholder="CAT C15" />
            </label>
            <label className="space-y-2">
              <FieldLabel>Serial Number</FieldLabel>
              <Input defaultValue={values.serialNumber} placeholder="CAT-55-2190" />
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
            <label className="space-y-2">
              <FieldLabel>Criticality</FieldLabel>
              <select
                defaultValue={values.criticality}
                className="flex h-11 w-full rounded-full border border-input bg-background px-4 text-sm text-foreground shadow-sm outline-none"
              >
                {criticalityOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <FieldLabel>Last Service Date</FieldLabel>
              <Input type="date" defaultValue={values.lastServiceDate} />
            </label>
            <label className="space-y-2">
              <FieldLabel>Next Service Date</FieldLabel>
              <Input type="date" defaultValue={values.nextServiceDate} />
            </label>
          </div>

          <label className="space-y-2">
            <FieldLabel>Condition Summary</FieldLabel>
            <Textarea defaultValue={values.condition} placeholder="Describe current operational condition and recent findings." />
          </label>

          <label className="space-y-2">
            <FieldLabel>Notes</FieldLabel>
            <Textarea defaultValue={values.notes} placeholder="Add handling notes, constraints, or operating context." />
          </label>

          <div className="flex flex-col gap-3 rounded-[calc(var(--radius)-0.15rem)] border border-dashed border-border bg-muted/35 p-4 text-sm text-muted-foreground lg:flex-row lg:items-center lg:justify-between">
            <p>Form wiring is intentionally static in Phase 4. Submission logic and validation will connect during the forms and API integration phase.</p>
            <Button type="button">{submitLabel}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

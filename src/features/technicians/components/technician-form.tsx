import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { TechnicianFormValues, TechnicianStatus } from "@/features/technicians/types/technicians";

interface TechnicianFormProps {
  title: string;
  description: string;
  submitLabel: string;
  values: TechnicianFormValues;
}

const statusOptions: TechnicianStatus[] = ["Available", "On Assignment", "Off Shift", "Leave"];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{children}</span>;
}

export function TechnicianForm({ title, description, submitLabel, values }: TechnicianFormProps) {
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
              <FieldLabel>Technician Name</FieldLabel>
              <Input defaultValue={values.name} placeholder="R. Santos" />
            </label>
            <label className="space-y-2">
              <FieldLabel>Employee ID</FieldLabel>
              <Input defaultValue={values.employeeId} placeholder="EMP-2041" />
            </label>
            <label className="space-y-2">
              <FieldLabel>Role</FieldLabel>
              <Input defaultValue={values.role} placeholder="Senior Electrical Technician" />
            </label>
            <label className="space-y-2">
              <FieldLabel>Team</FieldLabel>
              <Input defaultValue={values.team} placeholder="Electrical Response" />
            </label>
            <label className="space-y-2">
              <FieldLabel>Primary Skill</FieldLabel>
              <Input defaultValue={values.primarySkill} placeholder="Power Systems" />
            </label>
            <label className="space-y-2">
              <FieldLabel>Site Coverage</FieldLabel>
              <Input defaultValue={values.siteCoverage} placeholder="Central Office, Annex Building" />
            </label>
            <label className="space-y-2">
              <FieldLabel>Phone</FieldLabel>
              <Input defaultValue={values.phone} placeholder="+63 912 300 1001" />
            </label>
            <label className="space-y-2">
              <FieldLabel>Email</FieldLabel>
              <Input defaultValue={values.email} placeholder="r.santos@servi.local" />
            </label>
            <label className="space-y-2 md:col-span-2">
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
            <FieldLabel>Professional Summary</FieldLabel>
            <Textarea defaultValue={values.bio} placeholder="Describe the technician's responsibilities, specialization, and current operating context." />
          </label>

          <div className="flex flex-col gap-3 rounded-[calc(var(--radius)-0.15rem)] border border-dashed border-border bg-muted/35 p-4 text-sm text-muted-foreground lg:flex-row lg:items-center lg:justify-between">
            <p>Form submission, validation, and mutation feedback will connect when the shared forms and API integration phase is implemented.</p>
            <Button type="button">{submitLabel}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

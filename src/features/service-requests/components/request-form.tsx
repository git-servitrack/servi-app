import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type {
  RequestPriority,
  RequestStatus,
  ServiceRequestFormValues,
} from "@/features/service-requests/types/service-requests";

interface RequestFormProps {
  title: string;
  description: string;
  submitLabel: string;
  values: ServiceRequestFormValues;
}

const statusOptions: RequestStatus[] = ["New", "Under Review", "Scheduled", "In Progress", "Resolved", "Closed"];
const priorityOptions: RequestPriority[] = ["Critical", "High", "Medium", "Low"];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{children}</span>;
}

export function RequestForm({ title, description, submitLabel, values }: RequestFormProps) {
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
              <FieldLabel>Request Title</FieldLabel>
              <Input defaultValue={values.title} placeholder="Badge scanner intermittently offline" />
            </label>
            <label className="space-y-2">
              <FieldLabel>Requester</FieldLabel>
              <Input defaultValue={values.requester} placeholder="M. Garcia" />
            </label>
            <label className="space-y-2">
              <FieldLabel>Site</FieldLabel>
              <Input defaultValue={values.site} placeholder="Central Office" />
            </label>
            <label className="space-y-2">
              <FieldLabel>Category</FieldLabel>
              <Input defaultValue={values.category} placeholder="Access Control" />
            </label>
            <label className="space-y-2">
              <FieldLabel>Related Asset</FieldLabel>
              <Input defaultValue={values.assetName} placeholder="Lobby Access Reader" />
            </label>
            <label className="space-y-2">
              <FieldLabel>Scheduled For</FieldLabel>
              <Input type="datetime-local" defaultValue={values.scheduledFor} />
            </label>
            <label className="space-y-2">
              <FieldLabel>Status</FieldLabel>
              <select defaultValue={values.status} className="flex h-11 w-full rounded-full border border-input bg-background px-4 text-sm text-foreground shadow-sm outline-none">
                {statusOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <FieldLabel>Priority</FieldLabel>
              <select defaultValue={values.priority} className="flex h-11 w-full rounded-full border border-input bg-background px-4 text-sm text-foreground shadow-sm outline-none">
                {priorityOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="space-y-2">
            <FieldLabel>Issue Summary</FieldLabel>
            <Textarea defaultValue={values.summary} placeholder="Describe the issue, current impact, and any observations from the requester." />
          </label>

          <div className="flex flex-col gap-3 rounded-[calc(var(--radius)-0.15rem)] border border-dashed border-border bg-muted/35 p-4 text-sm text-muted-foreground lg:flex-row lg:items-center lg:justify-between">
            <p>Submission, mutation feedback, and validation are intentionally deferred until the forms and API integration phase.</p>
            <Button type="button">{submitLabel}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

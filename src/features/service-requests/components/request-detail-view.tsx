import Link from "next/link";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RequestRemarksSection } from "@/features/service-requests/components/request-remarks-section";
import { RequestStatusBadge } from "@/features/service-requests/components/request-status-badge";
import { RequestTimeline } from "@/features/service-requests/components/request-timeline";
import { getServiceRequestEditRoute } from "@/features/service-requests/lib/service-requests";
import type { ServiceRequestRecord } from "@/features/service-requests/types/service-requests";

export function RequestDetailView({ request }: { request: ServiceRequestRecord }) {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Request Details"
        title={request.title}
        description="Track ticket context, asset linkage, timeline progression, and dispatcher or technician remarks from a single detail surface."
        actions={
          <>
            <RequestStatusBadge status={request.status} />
            <Button asChild>
              <Link href={getServiceRequestEditRoute(request.id)}>Update request</Link>
            </Button>
          </>
        }
      />

      <section className="grid gap-4 lg:grid-cols-4">
        {[
          { label: "Ticket", value: request.ticketNumber },
          { label: "Requester", value: request.requester },
          { label: "Site", value: request.site },
          { label: "Priority", value: request.priority },
        ].map((item) => (
          <Card key={item.label}>
            <CardHeader>
              <CardDescription>{item.label}</CardDescription>
              <CardTitle className="text-2xl">{item.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </section>

      <SectionWrapper title="Request summary" description="Core issue details and service context for the selected request.">
        <Card>
          <CardContent className="grid gap-4 p-6 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Category</p>
              <p className="text-sm font-medium text-foreground">{request.category}</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Related Asset</p>
              <p className="text-sm font-medium text-foreground">{request.assetName}</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Submitted At</p>
              <p className="text-sm font-medium text-foreground">{request.submittedAt}</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Scheduled For</p>
              <p className="text-sm font-medium text-foreground">{request.scheduledFor}</p>
            </div>
            <div className="space-y-2 md:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Summary</p>
              <p className="text-sm leading-6 text-foreground">{request.summary}</p>
            </div>
          </CardContent>
        </Card>
      </SectionWrapper>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <SectionWrapper title="Timeline" description="Use the timeline to visualize request progress and intervention checkpoints.">
          <RequestTimeline events={request.timeline} />
        </SectionWrapper>

        <SectionWrapper title="Remarks" description="Dispatcher, technician, and requester notes stay separate from the timeline for easier scanning.">
          <RequestRemarksSection remarks={request.remarks} />
        </SectionWrapper>
      </div>
    </PageContainer>
  );
}
